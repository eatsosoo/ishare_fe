import { QuestionType, ReadingPart } from './types/question';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

export enum SelectQuestionType {
  SingleChoice = 'choice',
  MultipleChoice = 'multiple_choice',
  FillIn = 'fill_in',
  TrueFalseNotGiven = 'true_false_not_given',
}

export const questionTypes: QuestionType[] = [
  {
    value: SelectQuestionType.SingleChoice,
    label: 'Chọn đáp án đúng',
  },
  {
    value: SelectQuestionType.MultipleChoice,
    label: 'Chọn các đáp án đúng',
  },
  {
    value: SelectQuestionType.FillIn,
    label: 'Điền đáp án đúng',
  },
  {
    value: SelectQuestionType.TrueFalseNotGiven,
    label: 'Đúng/Sai/Không có thông tin',
  },
];

export const trueFalseNotGivenOptions = [
  {
    value: 'true',
    label: t('common.true'),
  },
  {
    value: 'false',
    label: t('common.false'),
  },
  {
    value: 'not_given',
    label: t('common.notGiven'),
  },
];

const defaultOptions = Array.from({ length: 4 }, (_, i) => ({
  id: String.fromCharCode(65 + i),
  text: 'text' + String.fromCharCode(65 + i),
}));

export const readingParts: ReadingPart[] = [
  {
    key: 'tabs1',
    tab: 'Passage 1',
    subject: 'Reading Passage 1',
    questions: Array.from({ length: 13 }, (_, i) => ({
      no: i + 1,
      content: `Question ${i + 1} ?`,
      type: 'choice',
      options: defaultOptions,
      answer: null,
    })),
  },
  {
    key: 'tabs2',
    tab: 'Passage 2',
    subject: 'Reading Passage 2',
    questions: Array.from({ length: 13 }, (_, i) => ({
      no: i + 13,
      content: `Question ${i + 13} ?`,
      type: 'choice',
      options: defaultOptions,
      answer: null,
    })),
  },
  {
    key: 'tabs3',
    tab: 'Passage 3',
    subject: 'Reading Passage 3',
    questions: Array.from({ length: 13 }, (_, i) => ({
      no: i + 26,
      content: `Question ${i + 26} ?`,
      type: 'choice',
      options: defaultOptions,
      answer: null,
    })),
  },
];

export const listeningParts: ReadingPart[] = [
  {
    key: 'tabs1',
    tab: 'Section 1',
    subject: 'Listening Section 1',
    questions: Array.from({ length: 10 }, (_, i) => ({
      no: i + 1,
      content: `Question ${i + 1} ?`,
      type: 'choice',
      options: defaultOptions,
      answer: null,
    })),
  },
  {
    key: 'tabs2',
    tab: 'Section 2',
    subject: 'Listening Section 2',
    questions: Array.from({ length: 10 }, (_, i) => ({
      no: i + 11,
      content: `Question ${i + 11} ?`,
      type: 'choice',
      options: defaultOptions,
      answer: null,
    })),
  },
  {
    key: 'tabs3',
    tab: 'Section 3',
    subject: 'Listening Section 3',
    questions: Array.from({ length: 10 }, (_, i) => ({
      no: i + 21,
      content: `Question ${i + 21} ?`,
      type: 'choice',
      options: defaultOptions,
      answer: null,
    })),
  },
  {
    key: 'tabs4',
    tab: 'Section 4',
    subject: 'Listening Section 4',
    questions: Array.from({ length: 10 }, (_, i) => ({
      no: i + 31,
      content: `Question ${i + 31} ?`,
      type: 'choice',
      options: defaultOptions,
      answer: null,
    })),
  },
];

export const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
