import { QuestionType, ReadingPart } from './types/question';

export const questionTypes: QuestionType[] = [
  {
    value: 'choice',
    label: 'Đa lựa chọn',
  },
  {
    value: 'write',
    label: 'Nhập đáp án đúng',
  },
  {
    value: 'true_false',
    label: 'Câu hỏi đúng sai',
  },
];

export const readingParts: ReadingPart[] = [
  {
    key: 'tabs1',
    tab: 'Part 1',
    questions: Array.from({ length: 13 }, (_, i) => ({
      no: i + 1,
      content: `Question ${i + 1}`,
      type: 'choice',
      options: [],
      answer: null,
    })),
  },
  {
    key: 'tabs2',
    tab: 'Part 2',
    questions: Array.from({ length: 13 }, (_, i) => ({
      no: i + 13,
      content: `Question ${i + 13}`,
      type: 'choice',
      options: [],
      answer: null,
    })),
  },
  {
    key: 'tabs3',
    tab: 'Part 3',
    questions: Array.from({ length: 13 }, (_, i) => ({
      no: i + 26,
      content: `Question ${i + 26}`,
      type: 'choice',
      options: [],
      answer: null,
    })),
  },
];
