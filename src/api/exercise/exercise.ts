import { otherHttp } from '@/utils/http/axios';
import { BasicPageParams } from '../model/baseModel';
import { ExerciseListGetResultModel } from './exerciseModel';

enum Api {
  EXERCISE_LIST = '/table/getExerciseList',
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
