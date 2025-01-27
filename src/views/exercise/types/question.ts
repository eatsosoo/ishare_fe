export interface QuestionType {
  value: string;
  label: string;
}

export type SelectQuestionType = 'choice' | 'write' | 'true_false';

export interface QuestionItem {
  no: number;
  content: string;
  type: SelectQuestionType;
  options: string[];
  answer: string | null;
}

export interface ReadingPart {
  key: string;
  tab: string;
  questions: QuestionItem[];
}
