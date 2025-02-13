import { defHttp, otherHttp } from '@/utils/http/axios';
import { BasicPageParams } from '../model/baseModel';
import { ExerciseListGetResultModel, HomeworkListGetResultModel } from './exerciseModel';

enum Api {
  EXERCISE_LIST = '/table/getExerciseList',
  HOMEWORK_LIST = '/exams',
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
    url: `${Api.HOMEWORK_LIST}?type=Homework`,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
