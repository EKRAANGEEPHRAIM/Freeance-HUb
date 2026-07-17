import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../core/services/api-url.token';
import type { Client, ClientPayload } from '../../../shared/models/client.models';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  findAll() {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`);
  }

  create(payload: ClientPayload) {
    return this.http.post<Client>(`${this.apiUrl}/clients`, payload);
  }

  update(id: string, payload: ClientPayload) {
    return this.http.patch<Client>(`${this.apiUrl}/clients/${id}`, payload);
  }

  remove(id: string) {
    return this.http.delete<Client>(`${this.apiUrl}/clients/${id}`);
  }
}
