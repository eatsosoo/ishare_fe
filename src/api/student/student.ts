import { defHttp } from '@/utils/http/axios';
import { StudentListGetResultModel } from './studentModel';
import { BasicPageParams, Result } from '../model/baseModel';
import { ExamPartItem, ResponseExamPartItem, SkillType } from '../exam/examModel';
import { ErrorMessageMode } from '#/axios';

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
    url: `${Api.STUDENT_LIST}${Api.EXAM}`,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const getTestOfStudentApi = (studentId: number, testId: number) =>
  defHttp.get<Result<ExamPartItem>>({
    url: `${Api.STUDENT_LIST}/${studentId}${Api.HOMEWORK}/${testId}`,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const getExamCapacityApi = () => (params: BasicPageParams) =>
  defHttp.get<Result<ExamPartItem>>({
    url: `${Api.STUDENT_LIST}${Api.CAPACITY}`,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const getDetailExamOfStudent = (studentId: number, examId: number, type: SkillType) =>
  defHttp.get<Result<ResponseExamPartItem[]>>({
    url: `${Api.STUDENT_LIST}/${studentId}/tests/${examId}?type=${type}`,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const importExcelApi = (formData: FormData, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<Result<string>>(
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
