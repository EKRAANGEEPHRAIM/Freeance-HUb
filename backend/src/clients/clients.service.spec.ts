import { NotFoundException } from '@nestjs/common';
import type { Client } from '@prisma/client';
import { ClientsService } from './clients.service';
import { DatabaseService } from '../database/database.service';

const userId = '6502f79b-4c80-4f6b-9658-b14a35c45575';
const clientId = 'a29a1e19-6f39-4fd1-adf9-dbf561f8eb00';
const client: Client = {
  id: clientId,
  userId,
  name: 'Acme Corp',
  email: 'contact@acme.test',
  phone: null,
  company: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('ClientsService', () => {
  const database = {
    client: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  const service = new ClientsService(database as unknown as DatabaseService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('assigns a new client to the authenticated user', async () => {
    database.client.create.mockResolvedValue(client);

    await expect(
      service.create(userId, {
        name: client.name,
        email: client.email,
        phone: null,
        company: null,
      }),
    ).resolves.toEqual(client);
    expect(database.client.create).toHaveBeenCalledWith({
      data: {
        userId,
        name: client.name,
        email: client.email,
        phone: null,
        company: null,
      },
    });
  });

  it('filters the client list by the authenticated user', async () => {
    database.client.findMany.mockResolvedValue([client]);

    await expect(service.findAll(userId)).resolves.toEqual([client]);
    expect(database.client.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('does not expose a client owned by another user', async () => {
    database.client.findFirst.mockResolvedValue(null);

    await expect(service.findOne(clientId, userId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(database.client.findFirst).toHaveBeenCalledWith({
      where: { id: clientId, userId },
    });
  });

  it('updates only a client owned by the authenticated user', async () => {
    database.client.findFirst.mockResolvedValue(client);
    database.client.update.mockResolvedValue({ ...client, name: 'Renamed Corp' });

    await expect(
      service.update(clientId, userId, { name: 'Renamed Corp' }),
    ).resolves.toMatchObject({ name: 'Renamed Corp' });
    expect(database.client.update).toHaveBeenCalledWith({
      where: { id: clientId },
      data: { name: 'Renamed Corp' },
    });
  });
});
