import { BasicFetchResult } from '../model/baseModel';

export interface TeacherListItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  status: number;
}

export interface AssignmentForm {
  title: string;
  class_id: number;
  exam_id: number;
  date: string;
}

/**
 * @description: Request list return value
 */
export type TeacherListGetResultModel = BasicFetchResult<TeacherListItem>;
