import { defHttp } from '@/utils/http/axios';
import {
  AttendanceItem,
  AttendanceStudentsParams,
  ClassAddStudentsParams,
  ClassDeleteStudentsParams,
  ClassListGetResultModel,
  ClassListItem,
  ClassStudentGetResultModel,
  CreateClassParams,
} from './classModel';
import { ErrorMessageMode } from '#/axios';
import { BasicApiResult, BasicPageParams, Result } from '../model/baseModel';
import { useUserStore } from '@/store/modules/user';

enum Api {
  CLASS_ROUTE = '/classes',
  ATTENDANCE = '/attendances',
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

export const classOptionsApi = () =>
  defHttp.get<Result<ClassListItem[]>>({
    url: Api.CLASS_ROUTE,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const getStudentsOfClassApi = () => (params: BasicPageParams) => {
  const useStore = useUserStore();
  const classId = useStore.getClassId;
  return defHttp.get<ClassStudentGetResultModel>({
    url: `${Api.CLASS_ROUTE}/${classId}/students`,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
};

export const getHomeworksOfClassApi = () => (params: BasicPageParams) => {
  const useStore = useUserStore();
  const classId = useStore.getClassId;
  return defHttp.get<ClassListGetResultModel>({
    url: `${Api.CLASS_ROUTE}/${classId}/homework`,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
};

export const addStudentClassApi = (
  params: ClassAddStudentsParams,
  mode: ErrorMessageMode = 'modal',
) =>
  defHttp.post<BasicApiResult<ClassListItem>>(
    {
      url: `${Api.CLASS_ROUTE}/${params.class_id}/students`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const attendanceListApi = (classId: number, date: string) => {
  return defHttp.get<Result<AttendanceItem[][]>>({
    url: `${Api.ATTENDANCE}/${classId}?date=${date}`,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
};

export const attendanceApi = (params: AttendanceStudentsParams, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<Result<Boolean>>(
    {
      url: `${Api.ATTENDANCE}/${params.class_id}`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
