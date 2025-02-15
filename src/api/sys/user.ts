import { defHttp, otherHttp } from '@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  RegisterParams,
  RegisterResultModel,
  ChangePasswordParams,
  UserListGetResultModel,
} from './model/userModel';

import { ErrorMessageMode } from '#/axios';
import { BasicPageParams, Result } from '../model/baseModel';
import { UserInfo } from '#/store';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/profile',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
  Register = '/register',
  ChangePassword = '/profile/change-password',
  User = '/users',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: user login api
 */
export function registerApi(params: RegisterParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<RegisterResultModel>(
    {
      url: Api.Register,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<Result<UserInfo>>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return otherHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}

export function testRetry() {
  return otherHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 0,
        waitTime: 1000,
      },
    },
  );
}

export function changePassword(params: ChangePasswordParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.put<Result<boolean>>(
    {
      url: Api.ChangePassword,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export const getAllUserListApi = () => (params: BasicPageParams) =>
  defHttp.get<UserListGetResultModel>({
    url: Api.User,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
