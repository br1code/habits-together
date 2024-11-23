import { fetchData, postData } from './http';
import {
  createdEntityIdSchema,
  Habit,
  habitsSchema,
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

export const fetchHabits = (): Promise<Habit[]> => {
  return fetchData('habits', habitsSchema);
};
