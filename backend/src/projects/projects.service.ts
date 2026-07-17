import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import type { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly database: DatabaseService) {}

  async create(userId: string, data: CreateProjectDto): Promise<Project> {
    await this.ensureClientOwnership(data.clientId, userId);

    return this.database.project.create({ data });
  }

  findAll(userId: string): Promise<Project[]> {
    return this.database.project.findMany({
      where: { client: { userId } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.database.project.findFirst({
      where: { id, client: { userId } },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    return project;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateProjectDto,
  ): Promise<Project> {
    await this.findOne(id, userId);

    return this.database.project.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string): Promise<Project> {
    await this.findOne(id, userId);

    return this.database.project.delete({ where: { id } });
  }

  private async ensureClientOwnership(clientId: string, userId: string): Promise<void> {
    const client = await this.database.client.findFirst({
      where: { id: clientId, userId },
      select: { id: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID "${clientId}" not found`);
    }
  }
}
