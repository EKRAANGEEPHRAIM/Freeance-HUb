import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../core/services/api-url.token';
import type {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload,
} from '../../../shared/models/project.models';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  findAll() {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  create(payload: CreateProjectPayload) {
    return this.http.post<Project>(`${this.apiUrl}/projects`, payload);
  }

  update(id: string, payload: UpdateProjectPayload) {
    return this.http.patch<Project>(`${this.apiUrl}/projects/${id}`, payload);
  }

  remove(id: string) {
    return this.http.delete<Project>(`${this.apiUrl}/projects/${id}`);
  }
}
