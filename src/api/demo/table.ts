import { otherHttp } from '@/utils/http/axios';
import { DemoParams, DemoListGetResultModel } from './model/tableModel';

enum Api {
  DEMO_LIST = '/table/getDemoList',
  CLASS_LIST = '/classes',
  STUDENT_LIST = '/users',
  TEACHER_LIST = '/table/getTeacherList',
  EXERCISE_LIST = '/table/getExerciseList',
  EXAM_LIST = '/table/getExamList',
}

/**
 * @description: Get sample list value
 */

export const demoListApi = (params: DemoParams) =>
  otherHttp.get<DemoListGetResultModel>({
    url: Api.DEMO_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const exerciseListApi = () => (params: DemoParams) =>
  otherHttp.get<DemoListGetResultModel>({
    url: Api.EXERCISE_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
