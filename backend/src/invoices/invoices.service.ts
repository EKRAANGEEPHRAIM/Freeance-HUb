import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Invoice, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import type { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly database: DatabaseService) {}

  async create(userId: string, data: CreateInvoiceDto): Promise<Invoice> {
    await this.ensureProjectOwnership(data.projectId, userId);

    try {
      return await this.database.invoice.create({ data });
    } catch (error: unknown) {
      this.handleDuplicateNumber(error);
    }
  }

  findAll(userId: string): Promise<Invoice[]> {
    return this.database.invoice.findMany({
      where: { project: { client: { userId } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Invoice> {
    const invoice = await this.database.invoice.findFirst({
      where: { id, project: { client: { userId } } },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID "${id}" not found`);
    }

    return invoice;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateInvoiceDto,
  ): Promise<Invoice> {
    await this.findOne(id, userId);

    try {
      return await this.database.invoice.update({
        where: { id },
        data,
      });
    } catch (error: unknown) {
      this.handleDuplicateNumber(error);
    }
  }

  async remove(id: string, userId: string): Promise<Invoice> {
    await this.findOne(id, userId);

    return this.database.invoice.delete({ where: { id } });
  }

  private async ensureProjectOwnership(
    projectId: string,
    userId: string,
  ): Promise<void> {
    const project = await this.database.project.findFirst({
      where: { id: projectId, client: { userId } },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found`);
    }
  }

  private handleDuplicateNumber(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('An invoice already exists for this number');
    }

    throw error;
  }
}
