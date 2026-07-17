import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../core/services/api-url.token';
import type { Note, NotePayload } from '../../../shared/models/note.models';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  findAll() { return this.http.get<Note[]>(`${this.apiUrl}/notes`); }
  create(payload: NotePayload) { return this.http.post<Note>(`${this.apiUrl}/notes`, payload); }
  update(id: string, payload: NotePayload) { return this.http.patch<Note>(`${this.apiUrl}/notes/${id}`, payload); }
  remove(id: string) { return this.http.delete<Note>(`${this.apiUrl}/notes/${id}`); }
}
