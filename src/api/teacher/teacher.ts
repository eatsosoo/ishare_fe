import { defHttp, otherHttp } from '@/utils/http/axios';
import { BasicPageParams } from '../model/baseModel';
import {
  AssignmentForm,
  AssignmentListGetResultModel,
  TeacherListGetResultModel,
} from './teacherModel';
import { ErrorMessageMode } from '#/axios';

enum Api {
  TEACHER_LIST = '/table/teachers',
  ASSIGNMENT = '/assignments',
}

export const teacherListApi = () => (params: BasicPageParams) =>
  otherHttp.get<TeacherListGetResultModel>({
    url: Api.TEACHER_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const assignmentApi = (params: AssignmentForm, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<Boolean>(
    {
      url: `${Api.ASSIGNMENT}/${params.exam_id}/classes/${params.class_id}`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const assignmentListApi =
  (type = '') =>
  (params: BasicPageParams) =>
    defHttp.get<AssignmentListGetResultModel>({
      url: `${Api.ASSIGNMENT}?type=${type}`,
      params,
      headers: {
        // @ts-ignore
        ignoreCancelToken: true,
      },
    });
