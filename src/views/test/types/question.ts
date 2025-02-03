export interface QuestionType {
  value: string;
  label: string;
}

export type SelectQuestionType = 'choice' | 'fill_in' | 'true_false_not_given' | 'multiple_choice';

export interface QuestionOptionItem {
  id: string;
  text: string;
}
export interface QuestionItem {
  no: number;
  content: string;
  type: SelectQuestionType;
  options: QuestionOptionItem[];
  answer: any;
}

export interface ReadingPart {
  key: string;
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

export type SkillType = 'Reading' | 'Listening' | 'Writing' | 'Speaking';
