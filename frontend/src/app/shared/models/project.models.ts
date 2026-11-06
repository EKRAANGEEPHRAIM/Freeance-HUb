import type { Currency } from '../utils/money';

export type ProjectStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type Project = {
  id: string;
  clientId: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  budget: number;
  /** Devise du budget et des factures du projet */
  currency: Currency;
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectPayload = {
  clientId: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string | null;
  budget: number;
  currency: Currency;
};

export type UpdateProjectPayload = Omit<CreateProjectPayload, 'clientId'>;
