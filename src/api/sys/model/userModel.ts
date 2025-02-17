import { BasicFetchResult } from '@/api/model/baseModel';
import { RoleEnum } from '@/enums/roleEnum';

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface ChangePasswordParams {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ChangeRoleParams {
  user_id: number;
  role_id: number;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  items: {
    user_id: string | number;
    token: string;
    token_type: string;
    expired_time: string;
  };
  // roles: RoleInfo[];
}

export interface RegisterResultModel {
  token: string;
  user: {
    username: string;
    name: string;
    email: string;
    phone_number: string;
    id: string;
  };
}

export interface UserListItem {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
  user_name: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  id: number;
  name: string;
  username: string;
  email: string;
  role_name: RoleEnum;
  date_of_birth: string;
  phone_number: string;
  home_path: string;
  avatar: string;
}

/**
 * @description: Request list return value
 */
export type UserListGetResultModel = BasicFetchResult<UserListItem>;
