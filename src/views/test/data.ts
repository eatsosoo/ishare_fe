import {
  ExtendOptionAnswerType,
  GroupQuestionType,
  NewPartItem,
  OptionAnswerType,
  SelectQuestionType,
} from './types/question';

export enum SelectQuestionTypeX {
  SingleChoice = 'choice',
  MultipleChoice = 'multiple_choice',
  FillIn = 'matching',
  TrueFalseNotGiven = 'true_false_not_given',
  YesNoNotGiven = 'yes_no_not_given',
}

export const SKILL_OPTIONS = [
  { label: 'Reading', value: 'Reading' },
  { label: 'Listening', value: 'Listening' },
  { label: 'Writing', value: 'Writing' },
  { label: 'Speaking', value: 'Speaking' },
];

export const trueFalseNotGivenOptions = [
  {
    value: 'true',
    label: 'TRUE',
  },
  {
    value: 'false',
    label: 'FALSE',
  },
  {
    value: 'not_given',
    label: 'NOT GIVEN',
  },
];

export const yesNoNotGivenOptions = [
  {
    value: 'yes',
    label: 'YES',
  },
  {
    value: 'no',
    label: 'NO',
  },
  {
    value: 'not_given',
    label: 'NOT GIVEN',
  },
];

export const READING_PART_DEF: NewPartItem = {
  id: null,
  subject: 'Context of part',
  duration: 0,
  question_groups: [],
};

export const WRITING_DEF: NewPartItem = {
  id: null,
  subject: 'subject_writing_task_def',
  duration: 0,
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
      question_duration: 0,
    },
  ],
};

export const SPEAKING_DEF: NewPartItem = {
  id: null,
  subject: 'subject_speaking_task_default',
  duration: 0,
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
      question_duration: 0,
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
    label: 'Yes/No/Not given',
    value: 'yes_no_not_given',
  },
  {
    label: 'Matching',
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
    case 'yes_no_not_given':
      genOps = yesNoNotGivenOptions;
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
