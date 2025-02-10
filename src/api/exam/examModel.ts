import { BasicFetchResult } from '../model/baseModel';

export interface ExamListItem {
  id: number;
  title: string;
  teacher: string;
  score: number;
  deadline: string;
}

export interface ExamBasicItem {}

export interface ExamAddForm {
  title: string;
  deadline: string;
}

/**
 * @description: Request list return value
 */
export type ExamListGetResultModel = BasicFetchResult<ExamListItem>;
