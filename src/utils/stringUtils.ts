import { isArray } from 'lodash-es';
import { useI18n } from '@/hooks/web/useI18n';

export function convertStringToArray(commaSeparatedString: string): string[] {
  return commaSeparatedString.split(',').map((item) => item.trim());
}

export function convertArrayToString(array: string[]): string {
  return array.join(',');
}

export function getLeftValue(value: string): string {
  return value.split(' ')[0];
}

export function getRightValue(value: string): string {
  return value.split(' ')[0];
}

export function compareAnswers(
  correctAnswer: string | string[],
  studentAnswer: string,
  questionType: any,
): boolean {
  if (
    questionType === 'fill_in' &&
    typeof correctAnswer === 'string' &&
    correctAnswer.split('/').length > 0
  ) {
    const normalizedStudentAnswer = studentAnswer.toLowerCase().trim();
    const possibleAnswers = correctAnswer.split('/').map((a) => a.toLowerCase().trim());
    if (possibleAnswers.includes(normalizedStudentAnswer)) {
      return true;
    }
    return false;
  }
  if (!correctAnswer || !studentAnswer) return false;
  if (!isArray(correctAnswer)) {
    return correctAnswer.toLowerCase() === studentAnswer.toLowerCase();
  } else {
    const value2Array = studentAnswer.split(',');

    // Kiểm tra xem tất cả phần tử của value2Array có trong value1 không
    const isContained = value2Array.every((val) => correctAnswer.includes(val));
    return isContained;
  }
}

export function statusWork(completedAt: string | null, times: number, retake: number): string {
  const { t } = useI18n();
  if (times === 2 && completedAt) {
    return t('table.redone');
  } else if (times === 1 && retake === 1) {
    return t('table.redoRequired');
  } else if (times === 1 && completedAt) {
    return t('table.completed');
  } else {
    return t('table.notStarted');
  }
}

export function tagColorWork(completedAt: boolean, times: number, retake: number): string {
  if (times === 2 && completedAt) {
    return 'blue';
  } else if (times === 1 && retake === 1) {
    return 'yellow';
  } else if (times === 1 && completedAt) {
    return 'green';
  } else {
    return 'red';
  }
}
