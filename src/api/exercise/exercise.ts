import { defHttp, otherHttp } from '@/utils/http/axios';
import { BasicPageParams } from '../model/baseModel';
import {
  AssignExerciseParams,
  BookListGetResultModel,
  ExerciseListGetResultModel,
  HomeworkListGetResultModel,
} from './exerciseModel';
import { ErrorMessageMode, Result } from '#/axios';

enum Api {
  EXERCISE_LIST = '/table/getExerciseList',
  HOMEWORK_LIST = '/exams',
  BOOK_LIST = '/books',
  ASSIGN_EXE = '/homeworks',
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

export const assignExercise = (params: AssignExerciseParams, mode: ErrorMessageMode = 'none') =>
  defHttp.post<Result<AssignExerciseParams>>(
    {
      url: `${Api.ASSIGN_EXE}`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
