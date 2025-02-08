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

/**
 * @description: Request list return value
 */
export type ClassListGetResultModel = BasicFetchResult<ClassListItem>;
