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
  { label: 'Reading', value: 'Reading' },
  { label: 'Listening', value: 'Listening' },
  { label: 'Writing', value: 'Writing' },
  { label: 'Speaking', value: 'Speaking' },
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

export const READING_PART_DEF: NewPartItem = {
  id: null,
  subject: 'Context of part',
  question_groups: [],
};

export const WRITING_DEF: NewPartItem = {
  id: null,
  subject: 'subject_writing_task_def',
  question_groups: [
    {
      id: null,
      question_type: 'writing_task',
      question_text: '',
      question_no: [1],
      group_no: 1,
      question_options: [],
      question_answer: {
        question_1: 'no_answer',
      },
      question_count: 1,
    },
  ],
};

export const SPEAKING_DEF: NewPartItem = {
  id: null,
  subject: 'subject_speaking_task_default',
  question_groups: [
    {
      id: null,
      question_type: 'speaking_task',
      question_text: '',
      question_no: [1],
      group_no: 1,
      question_options: [],
      question_answer: {
        question_1: 'no_answer',
      },
      question_count: 1,
    },
  ],
};

export const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export const toolbar = [
  'fontsizeselect lineheight bold italic underline undo redo removeformat bullist numlist preview fullscreen',
];
export const plugins = ['table'];

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
      genOps = trueFalseNotGivenOptions;
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
