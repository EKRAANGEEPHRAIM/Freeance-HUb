export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientPayload = {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
};
