import type { Prisma } from '@prisma/client';

export const authenticatedUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type AuthenticatedUser = Prisma.UserGetPayload<{
  select: typeof authenticatedUserSelect;
}>;

export type CreateUserData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
