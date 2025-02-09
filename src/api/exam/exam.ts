import { defHttp } from '@/utils/http/axios';
import { ExamBasicItem, ExamListGetResultModel } from './examModel';
import { BasicApiResult, BasicPageParams } from '../model/baseModel';

enum Api {
  EXAM_LIST = '/exams',
}

export const examListApi = () => (params: BasicPageParams) =>
  defHttp.get<ExamListGetResultModel>({
    url: Api.EXAM_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const examDeleteApi = (examId: number) => () => {
  defHttp.delete<BasicApiResult<ExamBasicItem>>(
    {
      url: `${Api.EXAM_LIST}/${examId}`,
    },
    {
      errorMessageMode: 'modal',
    },
  );
};
