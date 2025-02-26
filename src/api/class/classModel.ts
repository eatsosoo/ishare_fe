import { BasicFetchResult } from '@/api/model/baseModel';

export interface CreateClassParams {
  title: string;
  description: string;
  start_date: string;
  key: string;
  shifts: { title: string; description: string }[];
  students: { id: string }[];
}

export interface ShiftItem {
  id: number;
  title: string;
  description: string;
}

export interface ClassListItem {
  id: number;
  title: string;
  description: string;
  teacher: string;
  students_count: number;
  start_date: string;
  level: string;
  key: string;
  shifts: ShiftItem[];
}

export interface ClassStudentItem {
  id: number;
  name: string;
  email: string;
  phone_number: string;
}

export interface ClassAddStudentsParams {
  class_id: number;
  students: { id: number }[];
}

export interface ClassDeleteStudentsParams {
  class_id: number;
  students: { id: string }[];
}

/**
 * @description: Request list return value
 */
export type ClassListGetResultModel = BasicFetchResult<ClassListItem>;

/**
 * @description: Request list retunr value
 */
export type ClassStudentGetResultModel = BasicFetchResult<ClassStudentItem>;
