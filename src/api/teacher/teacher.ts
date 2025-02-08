import { BasicFetchResult } from '../model/baseModel';

export interface TeacherListItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  status: number;
}

/**
 * @description: Request list return value
 */
export type TeacherListGetResultModel = BasicFetchResult<TeacherListItem>;
