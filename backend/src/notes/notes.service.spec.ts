import { NotFoundException } from '@nestjs/common';
import type { Note } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { NotesService } from './notes.service';

const userId = '6502f79b-4c80-4f6b-9658-b14a35c45575';
const noteId = 'fcd9b27d-3b35-4a80-940e-83eec6a72b20';
const note: Note = {
  id: noteId,
  userId,
  title: 'Client follow-up',
  content: 'Send the project proposal.',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('NotesService', () => {
  const database = {
    note: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  const service = new NotesService(database as unknown as DatabaseService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('assigns a new note to the authenticated user', async () => {
    database.note.create.mockResolvedValue(note);
    const data = { title: note.title, content: note.content };

    await expect(service.create(userId, data)).resolves.toEqual(note);
    expect(database.note.create).toHaveBeenCalledWith({
      data: { ...data, userId },
    });
  });

  it('filters notes by the authenticated user', async () => {
    database.note.findMany.mockResolvedValue([note]);

    await expect(service.findAll(userId)).resolves.toEqual([note]);
    expect(database.note.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  });

  it('does not expose a note owned by another user', async () => {
    database.note.findFirst.mockResolvedValue(null);

    await expect(service.findOne(noteId, userId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(database.note.findFirst).toHaveBeenCalledWith({
      where: { id: noteId, userId },
    });
  });

  it('updates a note only after ownership is verified', async () => {
    database.note.findFirst.mockResolvedValue(note);
    database.note.update.mockResolvedValue({ ...note, title: 'Updated follow-up' });

    await expect(
      service.update(noteId, userId, { title: 'Updated follow-up' }),
    ).resolves.toMatchObject({ title: 'Updated follow-up' });
    expect(database.note.update).toHaveBeenCalledWith({
      where: { id: noteId },
      data: { title: 'Updated follow-up' },
    });
  });
});
