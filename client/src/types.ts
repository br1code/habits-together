import { z } from 'zod';

// Schemas

export const loginDataSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const loginResultSchema = z.object({
  accessToken: z.string(),
});

export const signupDataSchema = z.object({
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
  isOwner: z.boolean(),
  photoUrl: z.string(),
  createdAt: z.string(),
  validatedBy: z.array(habitLogValidationSchema),
});

export const habitLogsSchema = z.array(habitLogSchema);

// Types

export type LoginData = z.infer<typeof loginDataSchema>;
export type LoginResult = z.infer<typeof loginResultSchema>;
export type SignupData = z.infer<typeof signupDataSchema>;
export type Habit = z.infer<typeof habitSchema>;
export type HabitLog = z.infer<typeof habitLogSchema>;
