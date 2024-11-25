import { fetchData, postData, putData } from './http';
import {
  createdEntityIdSchema,
  CreateHabitRequest,
  Habit,
  HabitDetails,
  habitDetailsSchema,
  HabitLog,
  habitLogsSchema,
  habitsSchema,
  LoginRequest,
  LoginResult,
  loginResultSchema,
  SignupRequest,
  UpdateHabitRequest,
  UserProfile,
  userProfileSchema,
} from './types';

export const login = (data: LoginRequest): Promise<LoginResult> => {
  return postData('auth/login', loginResultSchema, data);
};

export const signup = (data: SignupRequest): Promise<string> => {
  return postData('auth/signup', createdEntityIdSchema, data);
};

export const fetchUserProfile = (): Promise<UserProfile> => {
  return fetchData('users/profile', userProfileSchema);
};

export const fetchHabits = (): Promise<Habit[]> => {
  return fetchData('habits', habitsSchema);
};

export const fetchHabit = (habitId: string): Promise<HabitDetails> => {
  return fetchData(`habits/${habitId}`, habitDetailsSchema);
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

export const updateHabit = (habitId: string, data: UpdateHabitRequest) => {
  return putData(`habits/${habitId}`, null, data);
};

export const updateUserAvatar = (formData: FormData) => {
  return putData('users/avatar', null, formData);
};
