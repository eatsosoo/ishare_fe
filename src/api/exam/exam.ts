import { defHttp } from '@/utils/http/axios';
import {
  ExamAddForm,
  ExamBasicItem,
  ExamDetailItem,
  ExamGradingGetResultModel,
  ExamListGetResultModel,
  ExamPartItem,
  ExamSkillForm,
  SubmitExam,
} from './examModel';
import { BasicApiResult, BasicPageParams, Result } from '../model/baseModel';
import { ErrorMessageMode } from '#/axios';
import { useUserStore } from '@/store/modules/user';
import { SkillItem } from '@/views/test/types/question';

enum Api {
  EXAM_LIST = '/exams',
  EXAM_ACTION = '/exam',
  EXAM_SKILL = '/exam-skill',
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

export const examSkillApi = (
  examId: number,
  params: ExamSkillForm,
  mode: ErrorMessageMode = 'none',
) =>
  defHttp.post<Result<SkillItem>>(
    {
      url: `${Api.EXAM_SKILL}/${examId}`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const examDetailApi = (examId: number) =>
  defHttp.get<ExamDetailItem>({
    url: `${Api.EXAM_ACTION}/${examId}`,
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

export const examGradingListApi = () => (params: BasicPageParams) => {
  const useStore = useUserStore();
  const classId = useStore.getClassId;
  const skill = useStore.gradingType;
  return defHttp.get<ExamGradingGetResultModel>({
    url: `${Api.EXAM_LIST}/${classId}/students?type=${skill}`,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
};
