import { otherHttp } from '@/utils/http/axios';
import { ExamListGetResultModel } from './exam';
import { BasicPageParams } from '../model/baseModel';

enum Api {
  EXAM_LIST = '/table/exam',
}
export const examListApi = () => (params: BasicPageParams) =>
  otherHttp.get<ExamListGetResultModel>({
    url: Api.EXAM_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
