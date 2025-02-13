import { defHttp } from '@/utils/http/axios';
import { StudentListGetResultModel } from './studentModel';
import { BasicPageParams } from '../model/baseModel';

enum Api {
  STUDENT_LIST = '/users',
}

export const classListApi = () => (params: BasicPageParams) =>
  defHttp.get<StudentListGetResultModel>({
    url: Api.STUDENT_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
