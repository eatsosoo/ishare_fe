import { defHttp } from '@/utils/http/axios';
import { DemoParams, DemoListGetResultModel, ClassListGetResultModel } from './model/tableModel';

enum Api {
  DEMO_LIST = '/table/getDemoList',
  CLASS_LIST = '/table/getClassList',
  STUDENT_LIST = '/table/getStudentList',
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
