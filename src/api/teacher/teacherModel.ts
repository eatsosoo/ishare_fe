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

export interface AssignmentLisItem {
  id: number;
  title: string;
  description: null;
  deadline: string;
  teacher: string;
  class_name: string;
  exam_title: string;
}

/**
 * @description: Request list return value
 */
export type TeacherListGetResultModel = BasicFetchResult<TeacherListItem>;

/**
 * @description: Request list return value
 */
export type AssignmentListGetResultModel = BasicFetchResult<AssignmentLisItem>;
