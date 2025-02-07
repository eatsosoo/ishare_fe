import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';
/**
 * @description: Request list interface parameters
 */
export type DemoParams = Partial<BasicPageParams>;

export interface DemoListItem {
  id: string;
  beginTime: string;
  endTime: string;
  address: string;
  name: string;
  no: number;
  status: number;
}

export interface ClassListItem {
  id: string;
  title: string;
  classCode: string;
  teacher: string;
  students_count: number;
  start_date: string;
  end_date: string;
  status: number;
}

export interface StudentListItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  reading: number;
  listening: number;
  speaking: number;
  total: number;
}

export interface TeacherListItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  status: number;
}

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

export interface ExamListItem {
  id: string;
  name: string;
  type: string;
  student: string;
  status: number;
  score: number;
  created_at: string;
}

/**
 * @description: Request list return value
 */
export type DemoListGetResultModel = BasicFetchResult<DemoListItem>;

/**
 * @description: Request list return value
 */
export type ClassListGetResultModel = BasicFetchResult<ClassListItem>;

/**
 * @description: Request list return value
 */
export type StudentListGetResultModel = BasicFetchResult<StudentListItem>;

/**
 * @description: Request list return value
 */
export type TeacherListGetResultModel = BasicFetchResult<TeacherListItem>;

/**
 * @description: Request list return value
 */
export type ExerciseListGetResultModel = BasicFetchResult<ExerciseListItem>;

/**
 * @description: Request list return value
 */
export type ExamListGetResultModel = BasicFetchResult<ExamListItem>;
