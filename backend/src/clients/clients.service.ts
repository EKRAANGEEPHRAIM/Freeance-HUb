import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly database: DatabaseService) {}

  create(userId: string, data: CreateClientDto): Promise<Client> {
    return this.database.client.create({
      data: { ...data, userId },
    });
  }

  findAll(userId: string): Promise<Client[]> {
    return this.database.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Client> {
    const client = await this.database.client.findFirst({
      where: { id, userId },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }

    return client;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateClientDto,
  ): Promise<Client> {
    await this.findOne(id, userId);

    return this.database.client.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string): Promise<Client> {
    await this.findOne(id, userId);

    return this.database.client.delete({ where: { id } });
  }
}
