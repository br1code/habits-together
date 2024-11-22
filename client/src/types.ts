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

// Types

export type LoginData = z.infer<typeof loginDataSchema>;
export type LoginResult = z.infer<typeof loginResultSchema>;
export type SignupData = z.infer<typeof signupDataSchema>;
