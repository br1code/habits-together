import { z } from 'zod';

// Schemas

export const loginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const loginResultSchema = z.object({
  accessToken: z.string(),
});

export const signupRequestSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const createdEntityIdSchema = z.string().uuid();

export const habitSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  wasLoggedToday: z.boolean(),
  wasValidatedToday: z.boolean(),
});

export const habitsSchema = z.array(habitSchema);

export const habitDetailsSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  rules: z.string(),
  wasLoggedToday: z.boolean(),
  wasValidatedToday: z.boolean(),
  currentStreak: z.number(),
  highestStreak: z.number(),
});

export const habitLogValidationSchema = z.object({
  userId: z.string().uuid(),
  username: z.string(),
});

export const habitLogSchema = z.object({
  id: z.string().uuid(),
  habitId: z.string().uuid(),
  habitName: z.string(),
  userId: z.string().uuid(),
  username: z.string(),
  userProfilePictureUrl: z.string().nullable(),
  isOwner: z.boolean(),
  photoUrl: z.string(),
  createdAt: z.string(),
  validatedBy: z.array(habitLogValidationSchema),
});

export const habitLogsSchema = z.array(habitLogSchema);

export const createHabitRequest = z.object({
  name: z.string(),
  rules: z.string(),
});

export const updateHabitRequest = z.object({
  name: z.string(),
  rules: z.string(),
});

export const userProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  profilePictureUrl: z.string().nullable(),
  level: z.number(),
  currentExperiencePoints: z.number(),
  requiredExperiencePoints: z.number(),
});

// Types

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResult = z.infer<typeof loginResultSchema>;
export type SignupRequest = z.infer<typeof signupRequestSchema>;
export type Habit = z.infer<typeof habitSchema>;
export type HabitDetails = z.infer<typeof habitDetailsSchema>;
export type HabitLog = z.infer<typeof habitLogSchema>;
export type CreateHabitRequest = z.infer<typeof createHabitRequest>;
export type UpdateHabitRequest = z.infer<typeof updateHabitRequest>;
export type UserProfile = z.infer<typeof userProfileSchema>;
