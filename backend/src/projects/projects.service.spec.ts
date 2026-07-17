import { NotFoundException } from '@nestjs/common';
import { ProjectStatus } from '@prisma/client';
import type { Project } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { ProjectsService } from './projects.service';

const userId = '6502f79b-4c80-4f6b-9658-b14a35c45575';
const clientId = 'a29a1e19-6f39-4fd1-adf9-dbf561f8eb00';
const projectId = 'ff42baf7-1c23-4cb8-9e24-4742c478e1c6';
const project: Project = {
  id: projectId,
  clientId,
  title: 'Website redesign',
  description: null,
  status: ProjectStatus.PENDING,
  startDate: new Date('2026-01-01'),
  endDate: null,
  budget: 2500,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('ProjectsService', () => {
  const database = {
    client: { findFirst: jest.fn() },
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  const service = new ProjectsService(database as unknown as DatabaseService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a project only for a client owned by the authenticated user', async () => {
    database.client.findFirst.mockResolvedValue({ id: clientId });
    database.project.create.mockResolvedValue(project);
    const data = {
      clientId,
      title: project.title,
      description: null,
      budget: project.budget,
    };

    await expect(service.create(userId, data)).resolves.toEqual(project);
    expect(database.client.findFirst).toHaveBeenCalledWith({
      where: { id: clientId, userId },
      select: { id: true },
    });
    expect(database.project.create).toHaveBeenCalledWith({ data });
  });

  it('rejects project creation for a client owned by another user', async () => {
    database.client.findFirst.mockResolvedValue(null);

    await expect(
      service.create(userId, {
        clientId,
        title: project.title,
        description: null,
        budget: project.budget,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(database.project.create).not.toHaveBeenCalled();
  });

  it('filters projects through the owning client', async () => {
    database.project.findMany.mockResolvedValue([project]);

    await expect(service.findAll(userId)).resolves.toEqual([project]);
    expect(database.project.findMany).toHaveBeenCalledWith({
      where: { client: { userId } },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('does not expose a project owned by another user', async () => {
    database.project.findFirst.mockResolvedValue(null);

    await expect(service.findOne(projectId, userId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(database.project.findFirst).toHaveBeenCalledWith({
      where: { id: projectId, client: { userId } },
    });
  });

  it('updates a project only after ownership is verified', async () => {
    database.project.findFirst.mockResolvedValue(project);
    database.project.update.mockResolvedValue({ ...project, budget: 3000 });

    await expect(service.update(projectId, userId, { budget: 3000 })).resolves.toMatchObject({
      budget: 3000,
    });
    expect(database.project.update).toHaveBeenCalledWith({
      where: { id: projectId },
      data: { budget: 3000 },
    });
  });
});
