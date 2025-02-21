import { ExamPartItem } from '@/api/exam/examModel';
import {
  ExtendOptionAnswerType,
  GroupQuestionType,
  NewPartItem,
  OptionAnswerType,
  QuestionType,
  SelectQuestionType,
} from './types/question';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

export enum SelectQuestionTypeX {
  SingleChoice = 'choice',
  MultipleChoice = 'multiple_choice',
  FillIn = 'matching',
  TrueFalseNotGiven = 'true_false_not_given',
  YesNoNotGiven = 'yes_no_not_given',
}

export const questionTypes: QuestionType[] = [
  {
    value: SelectQuestionTypeX.SingleChoice,
    label: 'Chọn đáp án đúng',
  },
  {
    value: SelectQuestionTypeX.MultipleChoice,
    label: 'Chọn các đáp án đúng',
  },
  {
    value: SelectQuestionTypeX.FillIn,
    label: 'Điền đáp án đúng',
  },
  {
    value: SelectQuestionTypeX.TrueFalseNotGiven,
    label: 'Đúng/Sai/Không được đề cập',
  },
  {
    value: SelectQuestionTypeX.YesNoNotGiven,
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
    questions_count: 1,
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
    questions_count: 1,
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
    questions_count: 1,
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
    questions_count: 1,
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

export const READING_PART_DEF: NewPartItem = {
  id: null,
  subject: 'Reading Part 1',
  type: 'Reading',
  question_groups: [],
};

export const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export const toolbar = [
  'fontsizeselect lineheight bold italic underline undo redo removeformat bullist numlist preview fullscreen',
];
export const plugins = ['table'];
export const classStyle =
  'bg-white rounded-full text-center outline-red border-red border-1 p-1 shadow-md h-[32px]';

export const questionTypeOps: GroupQuestionType[] = [
  {
    label: 'Fill In',
    value: 'fill_in',
  },
  {
    label: 'True/False/Not given',
    value: 'true_false_not_given',
  },
  {
    label: 'Correct letter',
    value: 'correct_letter',
  },
  {
    label: 'Choice',
    value: 'choice',
  },
  {
    label: 'Multiple Choice',
    value: 'multiple_choice',
  },
];

export function handleAnswerOptions(type: SelectQuestionType, orders: number[]) {
  let genOps: OptionAnswerType[] | ExtendOptionAnswerType = [];
  switch (type) {
    case 'true_false_not_given':
      genOps = [
        { label: 'True', value: 'true' },
        { label: 'False', value: 'false' },
        { label: 'Not Given', value: 'not_given' },
      ];
      break;
    case 'choice':
      genOps = orders.reduce((acc, item) => {
        acc[`question_${item}`] = [
          { value: 'A', label: '' },
          { value: 'B', label: '' },
          { value: 'C', label: '' },
          { value: 'D', label: '' },
        ];
        return acc;
      }, {});
      break;
    case 'multiple_choice':
      genOps = Array.from({ length: orders.length + 1 }, (_, i) => ({
        value: String.fromCharCode(65 + i),
        label: '',
      }));
      break;
    default:
      genOps = [];
  }

  return genOps;
}
