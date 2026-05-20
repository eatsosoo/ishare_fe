import { BasicFetchResult } from '@/api/model/baseModel';

export interface SystemSettingItem {
  id: number;
  key: string;
  value: string;
  type: string;
  group: string;
  description: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SystemSettingParams {
  key: string;
  value: string;
  type: string;
  group: string;
  description: string;
  is_public: boolean;
}

export interface SystemSettingListParams {
  keyword?: string;
  group?: string;
  is_public?: boolean | string;
  page?: number;
  per_page?: number;
  pageSize?: number;
}

export type SystemSettingListGetResultModel = BasicFetchResult<SystemSettingItem>;
