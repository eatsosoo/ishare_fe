import { defHttp, otherHttp } from '@/utils/http/axios';
import { BasicPageParams } from '../model/baseModel';
import {
  AssignmentForm,
  AssignmentListGetResultModel,
  GradingForm,
  TeacherListGetResultModel,
} from './teacherModel';
import { ErrorMessageMode } from '#/axios';

enum Api {
  TEACHER_LIST = '/table/teachers',
  ASSIGNMENT = '/assignments',
  EXAM = '/exams',
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
      params: { title: params.title, type: 'exam', date: params.date },
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

export const submitGradingApi = (params: GradingForm, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<Boolean>(
    {
      url: `${Api.EXAM}/${params.exam_id}/teacher-submit`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
