import { defHttp, otherHttp } from '@/utils/http/axios';
import { BasicPageParams, ResultBase } from '../model/baseModel';
import {
  AssignExerciseParams,
  BookListGetResultModel,
  CopyExerciseParams,
  ExerciseListGetResultModel,
  HomeworkListGetResultModel,
  ScoreExercise,
  SubmitExerciseParams,
} from './exerciseModel';
import { ErrorMessageMode } from '#/axios';

enum Api {
  EXERCISE_LIST = '/table/getExerciseList',
  HOMEWORK_LIST = '/exams',
  BOOK_LIST = '/books',
  ASSIGN_EXE = '/homeworks',
  ATTENDANCE = '/attendances',
}

export const exerciseListApi = () => (params: BasicPageParams) =>
  otherHttp.get<ExerciseListGetResultModel>({
    url: Api.EXERCISE_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

// list homework created
export const homeworkListApi = () => (params: BasicPageParams) =>
  defHttp.get<HomeworkListGetResultModel>({
    url: `${Api.HOMEWORK_LIST}?&type=Homework`,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const bookListApi = () => (params: BasicPageParams) =>
  defHttp.get<BookListGetResultModel>({
    url: `${Api.BOOK_LIST}`,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const studyDateListApi = (classId: number) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-based in JavaScript
  const currentYear = currentDate.getFullYear();
  return defHttp.get<ResultBase<string[]>>({
    url: `${Api.ATTENDANCE}/${classId}/dates?month=${currentMonth}&year=${currentYear}`,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
};

export const assignExercise = (params: AssignExerciseParams, mode: ErrorMessageMode = 'none') =>
  defHttp.post<ResultBase<AssignExerciseParams>>(
    {
      url: `${Api.ASSIGN_EXE}`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const copyExercise = (params: CopyExerciseParams, mode: ErrorMessageMode = 'none') =>
  defHttp.post<ResultBase<CopyExerciseParams>>(
    {
      url: `${Api.ASSIGN_EXE}/copy`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const deleteExercise = (id: number, mode: ErrorMessageMode = 'modal') =>
  defHttp.delete<ResultBase<Boolean>>(
    {
      url: `${Api.ASSIGN_EXE}/${id}`,
    },
    {
      errorMessageMode: mode,
    },
  );

export const deleteGroupQuestion = (params: any, mode: ErrorMessageMode = 'modal') =>
  defHttp.delete<ResultBase<Boolean>>(
    {
      url: `${Api.ASSIGN_EXE}/questions`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );

export const exerciseSubmitApi = (
  homeworkId: number,
  params: SubmitExerciseParams,
  mode: ErrorMessageMode = 'modal',
) =>
  defHttp.post<ResultBase<ScoreExercise>>(
    {
      url: `/homework/${homeworkId}/submit`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
