import { defHttp } from '@/utils/http/axios';
import { ClassListGetResultModel, CreateClassParams } from './classModel';
import { BasicPageParams, BasicPostResult } from '../model/baseModel';
import { ErrorMessageMode } from '#/axios';

enum Api {
  CLASS_LIST = '/classes',
}

export const classCreateApi = (params: CreateClassParams, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<BasicPostResult<CreateClassParams>>(
    {
      url: Api.CLASS_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const classListApi = () => (params: BasicPageParams) =>
  defHttp.get<ClassListGetResultModel>({
    url: Api.CLASS_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
