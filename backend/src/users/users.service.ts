import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import {
  authenticatedUserSelect,
  AuthenticatedUser,
  CreateUserData,
} from './users.types';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.database.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<AuthenticatedUser | null> {
    return this.database.user.findUnique({
      where: { id },
      select: authenticatedUserSelect,
    });
  }

  async create(data: CreateUserData): Promise<AuthenticatedUser> {
    try {
      return await this.database.user.create({
        data,
        // authenticatedUserSelect allows us to select only the fields we need
        select: authenticatedUserSelect,
      });
    } catch (error: unknown) {
      if (
        // PrismaClientKnownRequestError is a class that represents a known request error
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // P2002 is the error code for unique constraint violation
        throw new ConflictException('An account already exists for this email');
      }

      throw error;
    }
  }
}
