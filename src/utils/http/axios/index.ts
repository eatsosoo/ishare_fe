// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosInstance, AxiosResponse } from 'axios';
import { clone } from 'lodash-es';
import type { RequestOptions, Result } from '#/axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
import { checkStatus } from './checkStatus';
import { useGlobSetting } from '@/hooks/setting';
import { useMessage } from '@/hooks/web/useMessage';
import { RequestEnum, ResultEnum, ContentTypeEnum } from '@/enums/httpEnum';
import { isString, isUndefined, isNull, isEmpty } from '@/utils/is';
import { getToken } from '@/utils/auth';
import { setObjToUrlParams, deepMerge } from '@/utils';
import { useErrorLogStoreWithOut } from '@/store/modules/errorLog';
import { useI18n } from '@/hooks/web/useI18n';
import { joinTimestamp, formatRequestDate } from './helper';
import { useUserStoreWithOut } from '@/store/modules/user';
import { AxiosRetry } from '@/utils/http/axios/axiosRetry';
import axios from 'axios';

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
const { createMessage, createErrorModal, createSuccessModal } = useMessage();

/**
 * @description: Data processing, convenient to distinguish multiple processing methods
 */
const transform: AxiosTransform = {
  /**
   * @description: Process response data. If the data is not in the expected format, an error can be thrown directly
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { t } = useI18n();
    const { isTransformResponse, isReturnNativeResponse } = options;
    // Whether to return the native response headers, for example: use this attribute when you need to get the response headers
    if (isReturnNativeResponse) {
      return res;
    }
    // Do not process anything, return directly
    // Used when the page code may need to directly obtain code, data, message information
    if (!isTransformResponse) {
      return res.data;
    }
    // Return in case of error

    const { data } = res;

    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error(t('sys.api.apiRequestFailed'));
    }
    // Here code, result, and message are the unified fields from the backend. You need to modify them to your project's own interface return format in types.ts
    const { statusCode, result, message } = data;

    // The logic here can be modified according to the project
    const hasSuccess = data && Reflect.has(data, 'statusCode') && statusCode === ResultEnum.SUCCESS;
    if (hasSuccess) {
      let successMsg = message;

      if (isNull(successMsg) || isUndefined(successMsg) || isEmpty(successMsg)) {
        successMsg = t(`sys.api.operationSuccess`);
      }

      if (options.successMessageMode === 'modal') {
        createSuccessModal({ title: t('sys.api.successTip'), content: successMsg });
      } else if (options.successMessageMode === 'message') {
        createMessage.success(successMsg);
      }
      return result;
    }

    // Perform different operations for different codes according to the actual situation of your project here
    // If you do not want to interrupt the current request, please return the data, otherwise, throw an exception directly
    let timeoutMsg = '';
    switch (statusCode) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = t('sys.api.timeoutMessage');
        const userStore = useUserStoreWithOut();
        // 被动登出，带redirect地址
        userStore.logout(false);
        break;
      default:
        if (message) {
          timeoutMsg = message;
        }
    }

    // When errorMessageMode='modal', a modal error popup will be displayed instead of a message prompt, used for more important errors
    // errorMessageMode='none' is generally used when it is explicitly stated that no error prompt should be automatically displayed
    if (options.errorMessageMode === 'modal') {
      createErrorModal({ title: t('sys.api.errorTip'), content: timeoutMsg });
    } else if (options.errorMessageMode === 'message') {
      createMessage.error(timeoutMsg);
    }

    throw new Error(timeoutMsg || t('sys.api.apiRequestFailed'));
  },

  // Process config before request
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // Add timestamp parameter to GET request to avoid fetching data from cache.
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // Compatible with RESTful style
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          (Object.keys(config.data).length > 0 || config.data instanceof FormData)
        ) {
          config.data = data;
          config.params = params;
        } else {
          // If data is not provided for non-GET requests, treat params as data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          );
        }
      } else {
        // Compatible with RESTful style
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: Request interceptor processing
   */
  requestInterceptors: (config, options) => {
    // Process config before request
    const token = getToken();
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      (config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }
    return config;
  },

  /**
   * @description: Response interceptor processing
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: Response error handling
   */
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
    const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const msg: string = response?.data?.error?.message ?? '';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = t('sys.api.apiTimeoutMessage');
      }
      if (err?.includes('Network Error')) {
        errMessage = t('sys.api.networkExceptionMsg');
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
        } else if (errorMessageMode === 'message') {
          createMessage.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as unknown as string);
    }

    checkStatus(error?.response?.status, msg, errorMessageMode);

    // Add automatic retry mechanism, just in case, only for GET requests
    const retryRequest = new AxiosRetry();
    const { isOpenRetry } = config.requestOptions.retryRequest;
    config.method?.toUpperCase() === RequestEnum.GET &&
      isOpenRetry &&
      error?.response?.status !== 401 &&
      // @ts-ignore
      retryRequest.retry(axiosInstance, error);
    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    // Deep merge
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes, e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 10 * 1000,
        // Base API URL
        // baseURL: globSetting.apiUrl,

        headers: {
          'Content-Type': ContentTypeEnum.JSON,
        },
        // If the format is form-data
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // Data processing method
        transform: clone(transform),
        // Configuration options, the following options can be overridden in individual interface requests
        requestOptions: {
          // Add prefix to URL by default
          joinPrefix: true,
          // Whether to return native response headers, for example: use this attribute when you need to get the response headers
          isReturnNativeResponse: false,
          // Need to process the returned data
          isTransformResponse: true,
          // Add parameters to URL in post request
          joinParamsToUrl: false,
          // Format submission parameter time
          formatDate: true,
          // Message prompt type
          errorMessageMode: 'message',
          // API URL
          apiUrl: globSetting.apiUrl,
          // URL prefix
          urlPrefix: urlPrefix,
          // Whether to add timestamp
          joinTime: true,
          // Ignore duplicate requests
          ignoreCancelToken: true,
          // Whether to carry token
          withToken: true,
          retryRequest: {
            isOpenRetry: true,
            count: 0,
            waitTime: 100,
          },
        },
      },
      opt || {},
    ),
  );
}
export const defHttp = createAxios({ authenticationScheme: 'Bearer' });

// other api url
export const otherHttp = createAxios({
  requestOptions: {
    apiUrl: '/basic-api',
    // urlPrefix: 'xxx',
  },
});
