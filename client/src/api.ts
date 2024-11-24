import { fetchData, postData } from './http';
import {
  createdEntityIdSchema,
  CreateHabitRequest,
  Habit,
  HabitLog,
  habitLogsSchema,
  habitsSchema,
  LoginRequest,
  LoginResult,
  loginResultSchema,
  SignupRequest,
} from './types';

export const login = (data: LoginRequest): Promise<LoginResult> => {
  return postData('auth/login', loginResultSchema, data);
};

export const signup = (data: SignupRequest): Promise<string> => {
  return postData('auth/signup', createdEntityIdSchema, data);
};

export const fetchHabits = (): Promise<Habit[]> => {
  return fetchData('habits', habitsSchema);
};

export const fetchHabitLogs = (params: {
  habitId?: string | null;
  pageNumber?: number | null;
  pageSize?: number | null;
}): Promise<HabitLog[]> => {
  const { habitId, pageNumber, pageSize } = params;

  const searchParams = new URLSearchParams();

  if (habitId) {
    searchParams.append('habitId', habitId);
  }
  if (pageNumber) {
    searchParams.append('pageNumber', pageNumber.toString());
  }
  if (pageSize) {
    searchParams.append('pageSize', pageSize.toString());
  }

  const searchParamsValue = searchParams.toString();
  const searchQuery = searchParamsValue ? `?${searchParamsValue}` : '';

  return fetchData(`logs${searchQuery}`, habitLogsSchema);
};

export const createHabitLog = (formData: FormData): Promise<string> => {
  return postData('logs', createdEntityIdSchema, formData);
};

export const createHabit = (data: CreateHabitRequest): Promise<string> => {
  return postData('habits', createdEntityIdSchema, data);
};
