export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';

export type Invoice = {
  id: string;
  projectId: string;
  number: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateInvoicePayload = {
  projectId: string;
  number: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  pdfUrl: string | null;
};

export type UpdateInvoicePayload = Omit<CreateInvoicePayload, 'projectId'>;
