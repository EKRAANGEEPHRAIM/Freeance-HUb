import { ProjectStatus } from '@prisma/client';
import { z } from 'zod';

const projectStatuses = [
  ProjectStatus.PENDING,
  ProjectStatus.IN_PROGRESS,
  ProjectStatus.COMPLETED,
  ProjectStatus.CANCELLED,
] as const;

const optionalDescription = z.string().trim().min(1).max(5000).optional().nullable();

const projectFields = {
  title: z.string().trim().min(1).max(255),
  description: optionalDescription,
  status: z.enum(projectStatuses).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional().nullable(),
  budget: z.coerce.number().positive(),
};

export const createProjectSchema = z
  .object({
    ...projectFields,
    clientId: z.string().uuid(),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate.getTime() > data.startDate.getTime(),
    { message: 'endDate must be after startDate', path: ['endDate'] },
  );

export const updateProjectSchema = z
  .object({
    title: projectFields.title.optional(),
    description: optionalDescription,
    status: z.enum(projectStatuses).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional().nullable(),
    budget: z.coerce.number().positive().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided',
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate.getTime() > data.startDate.getTime(),
    { message: 'endDate must be after startDate', path: ['endDate'] },
  );

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
