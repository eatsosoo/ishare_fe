import { defHttp } from '@/utils/http/axios';
import {
  StudentListGetResultModel,
  TakeExamStudentItem,
  TakeExerciseStudentItem,
  UpdateStudentInfoParams,
} from './studentModel';
import { BasicPageParams, ResultBase } from '../model/baseModel';
import { ExamPartItem, ResponseExamPartItem, SkillType } from '../exam/examModel';
import { ErrorMessageMode } from '#/axios';
import { useUserStore } from '@/store/modules/user';
import { ExerciseResultItem } from '../exercise/exerciseModel';

enum Api {
  STUDENT_LIST = '/students',
  HOMEWORK = '/homework',
  EXAM = '/exam',
  CAPACITY = '/exam-capacity',
}

export const getAllStudentListApi = () => (params: BasicPageParams) =>
  defHttp.get<StudentListGetResultModel>({
    url: Api.STUDENT_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const getHomeworkListOfStudentApi = () => (params: BasicPageParams) =>
  defHttp.get<StudentListGetResultModel>({
    url: `${Api.STUDENT_LIST}${Api.HOMEWORK}`,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const getExamListOfStudentApi = () => (params: BasicPageParams) =>
  defHttp.get<StudentListGetResultModel>({
    url: `${Api.STUDENT_LIST}/exam/list`,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const getTestOfStudentApi = (studentId: number, testId: number) =>
  defHttp.get<ResultBase<ExamPartItem>>({
    url: `${Api.STUDENT_LIST}/${studentId}${Api.HOMEWORK}/${testId}`,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const getExamCapacityApi = () => (params: BasicPageParams) =>
  defHttp.get<ResultBase<ExamPartItem>>({
    url: `${Api.STUDENT_LIST}${Api.CAPACITY}`,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const getDetailExamOfStudent = (
  studentId: number,
  examId: number,
  type: SkillType,
  times = 1,
) => {
  const url = `${Api.STUDENT_LIST}/${studentId}/skill/${examId}?type=${type}&times=${times}`;
  return defHttp.get<ResultBase<ResponseExamPartItem>>({
    url,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
};

export const getResExercise = (studentId: number, examId: number, times = 1) => {
  return defHttp.get<ResultBase<ExerciseResultItem>>({
    url: `${Api.STUDENT_LIST}/${studentId}/homework/${examId}?times=${times}`,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
};

export const importExcelApi = (formData: FormData, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<ResultBase<string>>(
    {
      url: '/users/import',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    {
      errorMessageMode: mode,
    },
  );

export const takeExamStudentApi = (examId: number, skillType: SkillType) => {
  const useStore = useUserStore();
  const userId = useStore.getUserInfo.id;
  return defHttp.get<ResultBase<TakeExamStudentItem>>({
    url: `${Api.STUDENT_LIST}/${userId}/skill/${examId}?type=${skillType}`,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
};

export const takeExerciseStudentApi = (exerciseId: number) => {
  const useStore = useUserStore();
  const userId = useStore.getUserInfo.id;
  return defHttp.get<ResultBase<TakeExerciseStudentItem>>({
    url: `${Api.STUDENT_LIST}/${userId}/homework/${exerciseId}`,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
};

export const updateStudentInfoApi = (
  formData: UpdateStudentInfoParams,
  mode: ErrorMessageMode = 'modal',
) =>
  defHttp.put<ResultBase<UpdateStudentInfoParams>>(
    {
      url: '/profile',
      data: formData,
    },
    {
      errorMessageMode: mode,
    },
  );

export const getHistoryClassApi = (studentId: number) =>
  defHttp.get<ResultBase<any>>({
    url: `/all-classes-by-students/${studentId}`,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
