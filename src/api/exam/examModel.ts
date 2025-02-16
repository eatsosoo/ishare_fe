import { QuestionItem, QuizItem } from '@/views/test/types/question';
import { BasicApiResult, BasicFetchResult } from '../model/baseModel';

export interface ExamListItem {
  id: number;
  title: string;
  teacher: string;
  deadline: string;
  part_count: number;
  student_count: number;
}

export interface ExamBasicItem {}

export type SkillType = 'Reading' | 'Listening' | 'Writing' | 'Speaking';

export interface ExamAddForm {
  title: string;
  deadline: string;
  type: 'exam' | 'homework';
}

export interface ExamPartForm {
  id: number | null;
  exam_id: number;
  type: SkillType;
  duration: number;
  media: string | null;
  subject: string;
  questions: QuestionItem[];
  questions_count?: number;
}

export interface ExamPartItem {
  id?: number;
  subject: string;
  type?: SkillType;
  questions_count: number;
  duration: number;
  media: string | null;
  questions: ExtendedQuestionItem[];
}

export interface ResponseExamPartItem {
  id: number;
  subject: string;
  type: SkillType;
  questions_count: number;
  duration: number;
  media: string | null;
  questions: QuizItem[];
}

export interface ExtendedQuestionItem extends QuestionItem {
  id?: number;
}

export interface ExamDetailItem {
  id: number;
  title: string;
  deadline: string;
  Listening: ExamPartItem[];
  Reading: ExamPartItem[];
  Writing: ExamPartItem[];
  Speaking: ExamPartItem[];
}

export interface SubmitExam {
  type: SkillType;
  answers: { question_id: number; answer: string | string[] }[];
}

/**
 * @description: Request list return value
 */
export type ExamListGetResultModel = BasicFetchResult<ExamListItem>;

/**
 * @description: Request detail return value
 */
export type ExamDetailGetResultModel = BasicApiResult<ExamDetailItem>;
