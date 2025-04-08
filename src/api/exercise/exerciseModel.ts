import { GroupQuestionItem, GroupQuestionWithAnswer } from '@/views/test/types/question';
import { SkillType, SubmitAnswer } from '../exam/examModel';
import { BasicFetchResult } from '../model/baseModel';

export interface ExerciseListItem {
  id: string;
  name: string;
  type: string;
  student: string;
  status: number;
  score: number;
  created_at: string;
  deadline: string;
}

export interface HomeworkListItem {
  id: number;
  title: string;
  teacher: string;
  deadline: string;
  part_count: number;
  student_count: number;
}

export interface BookListItem {
  id: number;
  title: string;
  type: string;
  level: number;
  description: null;
}

export interface AssignExerciseParams {
  book_name: string;
  skill: SkillType;
  homework_name: string;
  assign_at: 'class' | 'home';
  assignment: {
    class_id: number;
    shift_id: number;
    date: string;
  };
  question_groups: GroupQuestionItem[];
}

export interface CreateBankParams {
  book_name: string;
  skill: SkillType;
  homework_name: string;
  subject: string;
  duration: number;
  media: string | null;
  question_groups: GroupQuestionItem[];
}

export interface CopyExerciseParams {
  id: number;
  book_name: string;
  homework_name: string;
  deadline: string;
  assignments: {
    class_id: number;
    shift_id: number;
    study_date: string;
    title: string;
  };
}

export interface DetailBank {
  id: number;
  book_name: string;
  skill: SkillType;
  homework_name: string;
  subject: string;
  duration: number;
  media: string | null;
  question_groups: GroupQuestionItem[];
}

export interface SpeakingExeAnswer {
  part_id: number | null;
  part_answer: string;
}

export interface SubmitExerciseParams {
  type: SkillType;
  answers: SubmitAnswer[] | SpeakingExeAnswer[];
}

export interface ScoreExercise {
  score: number;
  result: string;
  type: SkillType;
}

export interface ExerciseResultItem {
  id: number;
  assign_at: string;
  book_name: string;
  deadline: string;
  duration: number;
  homework_name: string;
  media: string | null;
  part_answer: null | string[];
  skill: SkillType;
  subject: string;
  question_groups: GroupQuestionWithAnswer[];
}

/**
 * @description: Request list return value
 */
export type ExerciseListGetResultModel = BasicFetchResult<ExerciseListItem>;

/**
 * @description: Request list return value
 */
export type HomeworkListGetResultModel = BasicFetchResult<HomeworkListItem>;

/**
 * @description: Request list return value
 */
export type BookListGetResultModel = BasicFetchResult<BookListItem>;
