import { otherHttp } from '@/utils/http/axios';
import { BasicPageParams } from '../model/baseModel';
import { TeacherListGetResultModel } from './teacher';

enum Api {
  TEACHER_LIST = '/table/teachers',
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
