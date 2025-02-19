import { SkillType } from '@/api/exam/examModel';

export interface QuestionType {
  value: string;
  label: string;
}

export type SelectQuestionType =
  | 'fill_in'
  | 'true_false_not_given'
  | 'correct_letter'
  | 'choice'
  | 'multiple_choice';

export interface GroupQuestionType {
  label: SelectQuestionType;
  value: string;
}

export interface OptionAnswerType {
  label: string;
  value: string;
}

export interface QuestionOptionItem {
  id: string;
  text: string;
}
export interface QuestionItem {
  id?: number;
  question_no: number;
  content: string;
  type: SelectQuestionType;
  options: QuestionOptionItem[];
  answer: any;
}

export interface QuizItem {
  id: number;
  question_no: number;
  content: string;
  type: SelectQuestionType;
  options: QuestionOptionItem[];
  answer: any;
  student_answer: any;
}

export interface ReadingPart {
  key: string | number;
  tab: string;
  subject: string;
  questions: QuestionItem[];
}

export interface ListeningPart {
  key: string;
  tab: string;
  subject: string;
  questions: QuestionItem[];
}

// NEW TYPE
export interface GroupQuestionItem {
  id: number | null;
  question_type: SelectQuestionType;
  question_text: string;
  question_answer: { [key: string]: string };
  group_no: number;
  question_options: OptionAnswerType[] | null;
  question_no: number[];
  question_count: number;
}

export interface NewPartItem {
  id: number | null;
  subject: string;
  type: SkillType;
  duration: number;
  question_groups: GroupQuestionItem[];
}
