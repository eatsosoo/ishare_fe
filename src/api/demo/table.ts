import { defHttp } from '@/utils/http/axios';
import {
  DemoParams,
  DemoListGetResultModel,
  ClassListGetResultModel,
  ExerciseListGetResultModel,
  ExamListGetResultModel,
} from './model/tableModel';

enum Api {
  DEMO_LIST = '/table/getDemoList',
  CLASS_LIST = '/table/getClassList',
  STUDENT_LIST = '/table/getStudentList',
  TEACHER_LIST = '/table/getTeacherList',
  EXERCISE_LIST = '/table/getExerciseList',
  EXAM_LIST = '/table/getExamList',
}

/**
 * @description: Get sample list value
 */

export const demoListApi = (params: DemoParams) =>
  defHttp.get<DemoListGetResultModel>({
    url: Api.DEMO_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const classListApi = () => (params: DemoParams) =>
  defHttp.get<ClassListGetResultModel>({
    url: Api.CLASS_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const studentListApi = () => (params: DemoParams) =>
  defHttp.get<ClassListGetResultModel>({
    url: Api.STUDENT_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const teacherListApi = () => (params: DemoParams) =>
  defHttp.get<ClassListGetResultModel>({
    url: Api.TEACHER_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const exerciseListApi = () => (params: DemoParams) =>
  defHttp.get<ExerciseListGetResultModel>({
    url: Api.EXERCISE_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const examListApi = () => (params: DemoParams) =>
  defHttp.get<ExamListGetResultModel>({
    url: Api.EXAM_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
