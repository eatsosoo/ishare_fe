import { defHttp } from '@/utils/http/axios';
import { ExamAddForm, ExamBasicItem, ExamListGetResultModel } from './examModel';
import { BasicApiResult, BasicPageParams } from '../model/baseModel';
import { ErrorMessageMode } from '#/axios';

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

export const examCreateApi = (params: ExamAddForm, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<BasicApiResult<ExamAddForm>>(
    {
      url: Api.EXAM_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
