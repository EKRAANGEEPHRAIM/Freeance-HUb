import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Invoice } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import type { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly database: DatabaseService) {}

  async create(userId: string, data: CreateInvoiceDto): Promise<Invoice> {
    await this.ensureProjectOwnership(data.projectId, userId);
    await this.ensureNumberAvailable(userId, data.number);

    return this.database.invoice.create({ data });
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
    if (data.number !== undefined) {
      await this.ensureNumberAvailable(userId, data.number, id);
    }

    return this.database.invoice.update({
      where: { id },
      data,
    });
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

  /** Un numéro de facture est unique parmi les factures d'une même freelance, pas dans toute l'application */
  private async ensureNumberAvailable(
    userId: string,
    number: string,
    excludeId?: string,
  ): Promise<void> {
    const duplicate = await this.database.invoice.findFirst({
      where: {
        number,
        project: { client: { userId } },
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (duplicate) {
      throw new ConflictException('Vous avez déjà une facture avec ce numéro');
    }
  }
}
