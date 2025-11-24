import { NewPartItem, QuestionItem, ResPartItem, SkillItem } from '@/views/test/types/question';
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

export type SkillType = 'Reading' | 'Listening' | 'Writing' | 'Speaking' | 'Vocabulary';

export interface ExamAddForm {
  title: string;
  level: string;
  type: string;
  status: 'private' | 'publish';
}

export interface ExamSkillForm {
  id: number | null;
  type: SkillType;
  duration: number;
  media: string | null;
  parts: NewPartItem[];
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
  type: SkillType;
  duration: number;
  media: string | null;
  parts: ResPartItem[];
}

export interface ExtendedQuestionItem extends QuestionItem {
  id?: number;
}

export interface ExamDetailItem {
  id: number;
  title: string;
  deadline: string;
  Listening: SkillItem;
  Reading: SkillItem;
  Writing: SkillItem;
  Speaking: SkillItem;
}

export interface SubmitAnswer {
  id: number;
  question_count: number;
  question_answer: { [key: string]: string };
}

export interface SubmitExam {
  exam_skill_id: number;
  type: SkillType;
  answers: SubmitAnswer[];
}

export interface ExamGradingListItem {
  user_id: number;
  user_name: string;
  exam_id: number;
  exam_title: string;
  status: string;
  score: number;
  skill: SkillType;
  completed_at: string | null;
  score_id: number;
  times: number;
  deadline: string;
  assign_at: string;
}

/**
 * @description: Request list return value
 */
export type ExamListGetResultModel = BasicFetchResult<ExamListItem>;

/**
 * @description: Request detail return value
 */
export type ExamDetailGetResultModel = BasicApiResult<ExamDetailItem>;

/**
 * @description: Request detail return value
 */
export type ExamGradingGetResultModel = BasicApiResult<ExamGradingListItem>;
