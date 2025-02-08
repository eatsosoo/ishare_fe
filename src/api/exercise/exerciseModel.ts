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

/**
 * @description: Request list return value
 */
export type ExerciseListGetResultModel = BasicFetchResult<ExerciseListItem>;
