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
  className: string;
  classCode: string;
  teacher: string;
  studentNum: number;
  openingDay: string;
  status: number;
}

export interface StudentListItem {
  id: string;
  name: string;
  reading: number;
  listening: number;
  speaking: number;
  total: number;
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
