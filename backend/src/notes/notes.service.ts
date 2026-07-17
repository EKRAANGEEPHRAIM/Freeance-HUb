import { Injectable, NotFoundException } from '@nestjs/common';
import { Note } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import type { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly database: DatabaseService) {}

  create(userId: string, data: CreateNoteDto): Promise<Note> {
    return this.database.note.create({
      data: { ...data, userId },
    });
  }

  findAll(userId: string): Promise<Note[]> {
    return this.database.note.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.database.note.findFirst({
      where: { id, userId },
    });

    if (!note) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }

    return note;
  }

  async update(id: string, userId: string, data: UpdateNoteDto): Promise<Note> {
    await this.findOne(id, userId);

    return this.database.note.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string): Promise<Note> {
    await this.findOne(id, userId);

    return this.database.note.delete({ where: { id } });
  }
}
