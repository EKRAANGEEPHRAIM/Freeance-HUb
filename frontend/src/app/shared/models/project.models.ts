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
};

export type UpdateProjectPayload = Omit<CreateProjectPayload, 'clientId'>;
