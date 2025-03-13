import { SkillType } from '../exam/examModel';
import { BasicFetchResult } from '../model/baseModel';

export interface TeacherListItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  status: number;
}

export interface AssignmentForm {
  title: string;
  class_id: number;
  exam_id: number;
  date: string;
}

export interface AssignClassToTeacher {
  user_id: number;
  classes: { id: number }[];
}

export interface AssignmentLisItem {
  id: number;
  title: string;
  description: null;
  deadline: string;
  teacher: string;
  class_name: string;
  exam_title: string;
}

export interface GradingForm {
  user_id: number; // student
  score_id: number;
  exam_id: number;
  times: number;
  type: SkillType;
  score: number;
  answers: [
    { question_id: number; is_correct: true; explanation: string | null; question_count: number },
  ];
}

/**
 * @description: Request list return value
 */
export type TeacherListGetResultModel = BasicFetchResult<TeacherListItem>;

/**
 * @description: Request list return value
 */
export type AssignmentListGetResultModel = BasicFetchResult<AssignmentLisItem>;
