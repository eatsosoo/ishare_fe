export interface QuestionType {
  value: string;
  label: string;
}

export type SelectQuestionType = 'choice' | 'fill_in' | 'true_false_not_given' | 'multiple_choice';

export interface QuestionItem {
  no: number;
  content: string;
  type: SelectQuestionType;
  options: string[];
  answer: string | null | string[];
}

export interface ReadingPart {
  key: string;
  tab: string;
  subject: string;
  questions: QuestionItem[];
}

export interface Listening {
  key: string;
  tab: string;
  subject: string;
  questions: QuestionItem[];
}
