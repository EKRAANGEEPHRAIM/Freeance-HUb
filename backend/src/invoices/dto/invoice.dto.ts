import { InvoiceStatus } from '@prisma/client';
import { z } from 'zod';

const invoiceStatuses = [
  InvoiceStatus.DRAFT,
  InvoiceStatus.SENT,
  InvoiceStatus.PAID,
  InvoiceStatus.OVERDUE,
] as const;

const optionalPdfUrl = z.url().max(2048).optional().nullable();

export const createInvoiceSchema = z.object({
  number: z.string().trim().min(1).max(100),
  amount: z.coerce.number().positive(),
  dueDate: z.coerce.date(),
  status: z.enum(invoiceStatuses).optional(),
  pdfUrl: optionalPdfUrl,
  projectId: z.uuid(),
});

export const updateInvoiceSchema = z
  .object({
    number: z.string().trim().min(1).max(100).optional(),
    amount: z.coerce.number().positive().optional(),
    dueDate: z.coerce.date().optional(),
    status: z.enum(invoiceStatuses).optional(),
    pdfUrl: optionalPdfUrl,
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided',
  });

export type CreateInvoiceDto = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceDto = z.infer<typeof updateInvoiceSchema>;
