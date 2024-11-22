import { postData } from './http';
import {
  createdEntityIdSchema,
  LoginData,
  LoginResult,
  loginResultSchema,
  SignupData,
} from './types';

export const login = (data: LoginData): Promise<LoginResult> => {
  return postData('auth/login', loginResultSchema, data);
};

export const signup = (data: SignupData): Promise<string> => {
  return postData('auth/signup', createdEntityIdSchema, data);
};
