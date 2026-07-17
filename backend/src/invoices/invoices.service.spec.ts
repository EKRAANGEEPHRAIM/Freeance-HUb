import { NotFoundException } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import type { Invoice } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { InvoicesService } from './invoices.service';

const userId = '6502f79b-4c80-4f6b-9658-b14a35c45575';
const projectId = 'ff42baf7-1c23-4cb8-9e24-4742c478e1c6';
const invoiceId = '9bc20a68-608d-47e4-bec3-e4120e73d734';
const invoice: Invoice = {
  id: invoiceId,
  projectId,
  number: 'INV-2026-001',
  amount: 2500,
  dueDate: new Date('2026-02-01'),
  status: InvoiceStatus.DRAFT,
  pdfUrl: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('InvoicesService', () => {
  const database = {
    project: { findFirst: jest.fn() },
    invoice: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  const service = new InvoicesService(database as unknown as DatabaseService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates an invoice only for a project owned by the authenticated user', async () => {
    database.project.findFirst.mockResolvedValue({ id: projectId });
    database.invoice.create.mockResolvedValue(invoice);
    const data = {
      projectId,
      number: invoice.number,
      amount: invoice.amount,
      dueDate: invoice.dueDate,
      pdfUrl: null,
    };

    await expect(service.create(userId, data)).resolves.toEqual(invoice);
    expect(database.project.findFirst).toHaveBeenCalledWith({
      where: { id: projectId, client: { userId } },
      select: { id: true },
    });
    expect(database.invoice.create).toHaveBeenCalledWith({ data });
  });

  it('rejects invoice creation for a project owned by another user', async () => {
    database.project.findFirst.mockResolvedValue(null);

    await expect(
      service.create(userId, {
        projectId,
        number: invoice.number,
        amount: invoice.amount,
        dueDate: invoice.dueDate,
        pdfUrl: null,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(database.invoice.create).not.toHaveBeenCalled();
  });

  it('filters invoices through project and client ownership', async () => {
    database.invoice.findMany.mockResolvedValue([invoice]);

    await expect(service.findAll(userId)).resolves.toEqual([invoice]);
    expect(database.invoice.findMany).toHaveBeenCalledWith({
      where: { project: { client: { userId } } },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('does not expose an invoice owned by another user', async () => {
    database.invoice.findFirst.mockResolvedValue(null);

    await expect(service.findOne(invoiceId, userId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(database.invoice.findFirst).toHaveBeenCalledWith({
      where: { id: invoiceId, project: { client: { userId } } },
    });
  });

  it('updates an invoice only after ownership is verified', async () => {
    database.invoice.findFirst.mockResolvedValue(invoice);
    database.invoice.update.mockResolvedValue({ ...invoice, status: InvoiceStatus.SENT });

    await expect(
      service.update(invoiceId, userId, { status: InvoiceStatus.SENT }),
    ).resolves.toMatchObject({ status: InvoiceStatus.SENT });
    expect(database.invoice.update).toHaveBeenCalledWith({
      where: { id: invoiceId },
      data: { status: InvoiceStatus.SENT },
    });
  });
});
