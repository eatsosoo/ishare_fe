import { BasicFetchResult } from '../model/baseModel';

export interface ExerciseListItem {
  id: string;
  name: string;
  type: string;
  student: string;
  status: number;
  score: number;
  created_at: string;
  deadline: string;
}

export interface HomeworkListItem {
  id: number;
  title: string;
  teacher: string;
  deadline: string;
  part_count: number;
  student_count: number;
}

/**
 * @description: Request list return value
 */
export type ExerciseListGetResultModel = BasicFetchResult<ExerciseListItem>;

/**
 * @description: Request list return value
 */
export type HomeworkListGetResultModel = BasicFetchResult<HomeworkListItem>;
