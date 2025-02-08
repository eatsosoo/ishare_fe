import { BasicFetchResult } from '../model/baseModel';

export interface StudentListItem {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
}

/**
 * @description: Request list return value
 */
export type StudentListGetResultModel = BasicFetchResult<StudentListItem>;
