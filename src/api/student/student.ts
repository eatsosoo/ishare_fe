import { defHttp } from '@/utils/http/axios';
import { StudentListGetResultModel } from './studentModel';
import { BasicPageParams } from '../model/baseModel';

enum Api {
  STUDENT_LIST = '/users',
}

export const studentListApi = () => (params: BasicPageParams) => {
  return defHttp.get<StudentListGetResultModel>({
    url: Api.STUDENT_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
};
