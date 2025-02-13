import { defHttp, otherHttp } from '@/utils/http/axios';
import { BasicPageParams } from '../model/baseModel';
import { AssignmentForm, TeacherListGetResultModel } from './teacherModel';
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
  defHttp.post<ExamPartItem>(
    {
      url: `${Api.ASSIGNMENT}/${params.exam_id}/classes/${params.class_id}`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
