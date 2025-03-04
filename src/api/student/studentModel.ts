import { GroupQuestionItem, NewPartItem } from '@/views/test/types/question';
import { SkillType } from '../exam/examModel';
import { BasicFetchResult } from '../model/baseModel';

export interface StudentListItem {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
}

export interface TakeExamStudentItem {
  id: number;
  type: SkillType;
  duration: number;
  media: string | null;
  parts: NewPartItem[];
}

export interface TakeExerciseStudentItem {
  id: number;
  book_name: string;
  skill: SkillType;
  homework_name: string;
  deadline: string;
  assign_at: string;
  media: string | null;
  subject: string;
  duration: number;
  question_groups: GroupQuestionItem[];
}

/**
 * @description: Request list return value
 */
export type StudentListGetResultModel = BasicFetchResult<StudentListItem>;
