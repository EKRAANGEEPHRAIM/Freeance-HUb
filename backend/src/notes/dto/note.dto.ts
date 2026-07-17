import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().trim().min(1).max(255),
  content: z.string().trim().min(1).max(10000),
});

export const updateNoteSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    content: z.string().trim().min(1).max(10000).optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided',
  });

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
