import { QuestionType } from './types/question';

export const questionTypes: QuestionType[] = [
  {
    value: 'multiple_choice',
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
