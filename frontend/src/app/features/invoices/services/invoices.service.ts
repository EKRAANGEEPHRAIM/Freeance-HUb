import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../core/services/api-url.token';
import type {
  CreateInvoicePayload,
  Invoice,
  UpdateInvoicePayload,
} from '../../../shared/models/invoice.models';

@Injectable({ providedIn: 'root' })
export class InvoicesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  findAll() { return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`); }
  create(payload: CreateInvoicePayload) { return this.http.post<Invoice>(`${this.apiUrl}/invoices`, payload); }
  update(id: string, payload: UpdateInvoicePayload) { return this.http.patch<Invoice>(`${this.apiUrl}/invoices/${id}`, payload); }
  remove(id: string) { return this.http.delete<Invoice>(`${this.apiUrl}/invoices/${id}`); }
}
