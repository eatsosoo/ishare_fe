import { QuestionItem } from '@/views/test/types/question';
import { BasicApiResult, BasicFetchResult } from '../model/baseModel';

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
  id?: number;
  subject: string;
  type?: 'reading' | 'listening' | 'writing' | 'speaking';
  question_count: number;
  duration: number;
  audio_url?: string | null;
  questions: ExtendedQuestionItem[];
}

export interface ExtendedQuestionItem extends QuestionItem {
  id?: number;
}

export interface ExamDetailItem {
  id: number;
  title: string;
  deadline: string;
  listening: ExamPartItem[];
  reading: ExamPartItem[];
  writing: any;
  speaking: any;
}

/**
 * @description: Request list return value
 */
export type ExamListGetResultModel = BasicFetchResult<ExamListItem>;

/**
 * @description: Request detail return value
 */
export type ExamDetailGetResultModel = BasicApiResult<ExamDetailItem>;
