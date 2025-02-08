import { BasicFetchResult } from '@/api/model/baseModel';

export interface CreateClassParams {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  hour: string;
  students: { id: string }[];
}

export interface ClassListItem {
  id: string;
  title: string;
  classCode: string;
  teacher: string;
  students_count: number;
  start_date: string;
  end_date: string;
  status: number;
}

export interface ClassAddStudentsParams {
  class_id: number;
  students: { id: string }[];
}

export interface ClassDeleteStudentsParams {
  class_id: number;
  students: { id: string }[];
}

/**
 * @description: Request list return value
 */
export type ClassListGetResultModel = BasicFetchResult<ClassListItem>;
