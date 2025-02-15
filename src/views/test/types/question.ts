export interface QuestionType {
  value: string;
  label: string;
}

export type SelectQuestionType =
  | 'choice'
  | 'matching'
  | 'true_false_not_given'
  | 'yes_no_not_given'
  | 'multiple_choice'
  | 'writing_task_1_academic'
  | 'speaking_part_1';

export interface QuestionOptionItem {
  id: string;
  text: string;
}
export interface QuestionItem {
  question_no: number;
  content: string;
  type: SelectQuestionType;
  options: QuestionOptionItem[];
  answer: any;
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
