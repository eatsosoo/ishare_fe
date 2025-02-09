import { BasicFetchResult } from '../model/baseModel';

export interface ExamListItem {
  id: string;
  name: string;
  type: string;
  student: string;
  status: number;
  score: number;
  created_at: string;
}

/**
 * @description: Request list return value
 */
export type ExamListGetResultModel = BasicFetchResult<ExamListItem>;
