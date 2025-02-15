import { ExamPartItem } from '@/api/exam/examModel';
import { QuestionType } from './types/question';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

export enum SelectQuestionType {
  SingleChoice = 'choice',
  MultipleChoice = 'multiple_choice',
  FillIn = 'matching',
  TrueFalseNotGiven = 'true_false_not_given',
  YesNoNotGiven = 'yes_no_not_given',
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
    label: 'Đúng/Sai/Không được đề cập',
  },
  {
    value: SelectQuestionType.YesNoNotGiven,
    label: 'Có/Không/Không được đề cập',
  },
];

export const SKILL_OPTIONS = [
  { label: 'Reading', value: 'reading' },
  { label: 'Listening', value: 'listening' },
  { label: 'Writing', value: 'writing' },
  { label: 'Speaking', value: 'speaking' },
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

export const yesNoNotGivenOptions = [
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

const defaultOptions = Array.from({ length: 2 }, (_, i) => ({
  id: String.fromCharCode(65 + i),
  text: String.fromCharCode(65 + i),
}));

export const READING_DEFAULT: ExamPartItem[] = [
  {
    subject: 'Reading Part 1',
    question_count: 1,
    duration: 20,
    questions: Array.from({ length: 1 }, (_, i) => ({
      question_no: i + 1,
      content: '',
      type: 'choice',
      options: defaultOptions,
      answer: null,
    })),
    media: null,
  },
];

export const LISTENING_DEFAULT: ExamPartItem[] = [
  {
    subject: 'Listening Section 1',
    question_count: 1,
    duration: 10,
    questions: Array.from({ length: 1 }, (_, i) => ({
      question_no: i + 1,
      content: '',
      type: 'choice',
      options: defaultOptions,
      answer: null,
    })),
    media: null,
  },
];

export const WRITING_DEFAULT: ExamPartItem[] = [
  {
    subject: '',
    question_count: 1,
    duration: 60,
    questions: Array.from({ length: 1 }, (_, i) => ({
      question_no: i + 1,
      content: 'Writing ... about this subject',
      type: 'writing_task_1_academic',
      options: defaultOptions,
      answer: 'custom_answer',
    })),
    media: null,
  },
];

export const SPEAKING_DEFAULT: ExamPartItem[] = [
  {
    subject: '',
    question_count: 1,
    duration: 15,
    questions: Array.from({ length: 1 }, (_, i) => ({
      question_no: i + 1,
      content: 'Speaking ... about this subject',
      type: 'speaking_part_1',
      options: defaultOptions,
      answer: 'custom_answer',
    })),
    media: null,
  },
];

export const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
