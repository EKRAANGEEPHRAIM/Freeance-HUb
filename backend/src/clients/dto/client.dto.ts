import { z } from 'zod';

const optionalText = z.string().trim().min(1).max(255).optional().nullable();

export const createClientSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: z.email().trim().max(255),
  phone: optionalText,
  company: optionalText,
});

export const updateClientSchema = z
  .object({
    name: z.string().trim().min(1).max(255).optional(),
    email: z.email().trim().max(255).optional(),
    phone: optionalText,
    company: optionalText,
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided',
  });

export type CreateClientDto = z.infer<typeof createClientSchema>;
export type UpdateClientDto = z.infer<typeof updateClientSchema>;
