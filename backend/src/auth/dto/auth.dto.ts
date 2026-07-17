import { z } from 'zod';

export const registerSchema = z.object({
  
  email: z.email().trim().max(255), 
  password: z.string().min(8).max(72),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
});

export const loginSchema = z.object({
  
  email: z.email().trim().max(255), 
  password: z.string().min(1).max(72),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
