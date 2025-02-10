import { QuestionItem } from '@/views/test/types/question';
import { BasicFetchResult } from '../model/baseModel';

export interface ExamListItem {
  id: number;
  title: string;
  teacher: string;
  deadline: string;
}

export interface ExamBasicItem {}

export interface ExamAddForm {
  title: string;
  deadline: string;
}

export interface ExamPartForm {
  exam_id: number;
  type: 'reading' | 'listening' | 'writing' | 'speaking';
  duration: number;
  media: string | null;
  subject: string;
  questions: QuestionItem[];
}

export interface ExamPartItem {
  id: number;
  subject: string;
  type: 'reading' | 'listening' | 'writing' | 'speaking';
  question_count: number;
  duration: number;
  questions: ExtendedQuestionItem[];
}

export interface ExtendedQuestionItem extends QuestionItem {
  id: number;
}

/**
 * @description: Request list return value
 */
export type ExamListGetResultModel = BasicFetchResult<ExamListItem>;
