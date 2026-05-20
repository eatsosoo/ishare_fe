import { defHttp } from '@/utils/http/axios';
import { BasicApiResult, ResultBase } from '@/api/model/baseModel';
import { ErrorMessageMode } from '#/axios';
import {
  SystemSettingItem,
  SystemSettingListGetResultModel,
  SystemSettingListParams,
  SystemSettingParams,
} from './systemSettingsModel';

enum Api {
  SYSTEM_SETTINGS = '/system-settings',
}

function normalizeListParams(params: SystemSettingListParams) {
  const { pageSize, per_page, is_public, ...rest } = params;
  return {
    ...rest,
    is_public: is_public === 'true' ? true : is_public === 'false' ? false : is_public,
    per_page: per_page || pageSize,
  };
}

export const systemSettingListApi = () => (params: SystemSettingListParams) =>
  defHttp.get<SystemSettingListGetResultModel>({
    url: Api.SYSTEM_SETTINGS,
    params: normalizeListParams(params),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const getSystemSettingApi = (id: number, mode: ErrorMessageMode = 'modal') =>
  defHttp.get<ResultBase<SystemSettingItem>>(
    {
      url: `${Api.SYSTEM_SETTINGS}/${id}`,
    },
    {
      errorMessageMode: mode,
    },
  );

export const createSystemSettingApi = (
  params: SystemSettingParams,
  mode: ErrorMessageMode = 'modal',
) =>
  defHttp.post<BasicApiResult<SystemSettingItem>>(
    {
      url: Api.SYSTEM_SETTINGS,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const updateSystemSettingApi = (
  id: number,
  params: SystemSettingParams,
  mode: ErrorMessageMode = 'modal',
) =>
  defHttp.put<ResultBase<SystemSettingItem>>(
    {
      url: `${Api.SYSTEM_SETTINGS}/${id}`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const deleteSystemSettingApi = (id: number, mode: ErrorMessageMode = 'modal') =>
  defHttp.delete<ResultBase<Boolean>>(
    {
      url: `${Api.SYSTEM_SETTINGS}/${id}`,
    },
    {
      errorMessageMode: mode,
    },
  );

export const getPublicSystemSettingByKeyApi = (key: string) =>
  defHttp.get<SystemSettingListGetResultModel>({
    url: Api.SYSTEM_SETTINGS,
    params: {
      keyword: key,
      is_public: true,
      page: 1,
      per_page: 1,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
