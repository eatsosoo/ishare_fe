import { defHttp } from '@/utils/http/axios';
import {
  ClassAddStudentsParams,
  ClassDeleteStudentsParams,
  ClassListGetResultModel,
  CreateClassParams,
} from './classModel';
import { BasicPageParams, BasicApiResult } from '../model/baseModel';
import { ErrorMessageMode } from '#/axios';

enum Api {
  CLASS_ROUTE = '/classes',
}

export const createClassApi = (params: CreateClassParams, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<BasicApiResult<CreateClassParams>>(
    {
      url: Api.CLASS_ROUTE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const deleteClassApi = (
  params: ClassDeleteStudentsParams,
  mode: ErrorMessageMode = 'modal',
) =>
  defHttp.delete<BasicApiResult<string>>(
    {
      url: `${Api.CLASS_ROUTE}/${params.class_id}/students`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const deleteStudentOfClassApi = (classId: number, mode: ErrorMessageMode = 'modal') =>
  defHttp.delete<BasicApiResult<string>>(
    {
      url: `${Api.CLASS_ROUTE}/${classId}`,
    },
    {
      errorMessageMode: mode,
    },
  );

export const classListApi = () => (params: BasicPageParams) =>
  defHttp.get<ClassListGetResultModel>({
    url: Api.CLASS_ROUTE,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const classAddStudentsApi =
  () =>
  (params: ClassAddStudentsParams, mode: ErrorMessageMode = 'modal') =>
    defHttp.post<BasicApiResult<ClassAddStudentsParams>>(
      {
        url: `${Api.CLASS_ROUTE}/${params.class_id}/students`,
        params,
      },
      {
        errorMessageMode: mode,
      },
    );

export const getStudentsOfClassApi = (classId: number) => (params: BasicPageParams) =>
  defHttp.get<ClassListGetResultModel>({
    url: `${Api.CLASS_ROUTE}/${classId}/students`,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
