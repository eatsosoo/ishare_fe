import { defHttp } from '@/utils/http/axios';
import {
  ExamAddForm,
  ExamBasicItem,
  ExamDetailItem,
  ExamListGetResultModel,
  ExamPartForm,
  ExamPartItem,
  SubmitExam,
} from './examModel';
import { BasicApiResult, BasicPageParams, Result } from '../model/baseModel';
import { ErrorMessageMode } from '#/axios';

enum Api {
  EXAM_LIST = '/exams',
  EXAM_ACTION = '/exam',
}

export const examListApi = () => (params: BasicPageParams) =>
  defHttp.get<ExamListGetResultModel>({
    url: `${Api.EXAM_LIST}?type=exam`,
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

export const examPartApi = (params: ExamPartForm, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<Result<ExamPartItem>>(
    {
      url: `${Api.EXAM_ACTION}/${params.exam_id}/tests`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const examDetailApi = (examId: number) =>
  defHttp.get<ExamDetailItem>({
    url: `${Api.EXAM_ACTION}/${examId}/tests`,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const examSubmitApi = (
  examId: number,
  params: SubmitExam,
  mode: ErrorMessageMode = 'modal',
) =>
  defHttp.post<Result<ExamPartItem>>(
    {
      url: `${Api.EXAM_LIST}/${examId}/submit`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const uploadAudioApi = (formData: FormData, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<Result<string>>(
    {
      url: '/files/upload',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    {
      errorMessageMode: mode,
    },
  );
