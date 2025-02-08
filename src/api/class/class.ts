import { defHttp } from '@/utils/http/axios';
import { CreateClassParams } from './model/classModel';
import { BasicPostResult } from '../model/baseModel';
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
