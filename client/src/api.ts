import { deleteData, fetchData, postData, putData } from './http';
import {
  createdEntityIdSchema,
  CreateHabitLogCommentRequest,
  CreateHabitRequest,
  Habit,
  HabitDetails,
  habitDetailsSchema,
  HabitLog,
  HabitLogDetails,
  habitLogDetailsSchema,
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

export const updateUserAvatar = (formData: FormData) => {
  return putData('users/avatar', null, formData);
};

export const fetchHabits = (): Promise<Habit[]> => {
  return fetchData('habits', habitsSchema);
};

export const fetchHabit = (habitId: string): Promise<HabitDetails> => {
  return fetchData(`habits/${habitId}`, habitDetailsSchema);
};

export const createHabit = (data: CreateHabitRequest): Promise<string> => {
  return postData('habits', createdEntityIdSchema, data);
};

export const updateHabit = (habitId: string, data: UpdateHabitRequest) => {
  return putData(`habits/${habitId}`, null, data);
};

export const deleteHabit = (habitId: string) => {
  return deleteData(`habits/${habitId}`);
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

export const fetchHabitLog = (habitLogId: string): Promise<HabitLogDetails> => {
  return fetchData(`logs/${habitLogId}`, habitLogDetailsSchema);
};

export const createHabitLog = (formData: FormData): Promise<string> => {
  return postData('logs', createdEntityIdSchema, formData);
};

export const createHabitLogComment = (
  habitLogId: string,
  data: CreateHabitLogCommentRequest
) => {
  return postData(`logs/${habitLogId}/comments`, createdEntityIdSchema, data);
};

export const validateHabitLog = (habitLogId: string) => {
  return postData(`logs/${habitLogId}/validate`, null, null);
};

export const invalidateHabitLog = (habitLogId: string) => {
  return postData(`logs/${habitLogId}/invalidate`, null, null);
};

export const deleteHabitlog = (habitLogId: string) => {
  return deleteData(`logs/${habitLogId}`);
};
