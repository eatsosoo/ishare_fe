import { otherHttp } from '@/utils/http/axios';
import { ExamListGetResultModel } from './examModel';
import { BasicPageParams } from '../model/baseModel';

enum Api {
  EXAM_LIST = '/table/getExamList',
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
