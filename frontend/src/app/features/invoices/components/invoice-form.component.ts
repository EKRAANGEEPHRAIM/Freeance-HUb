import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Project } from '../../../shared/models/project.models';
import type { CreateInvoicePayload, Invoice, InvoiceStatus, UpdateInvoicePayload } from '../../../shared/models/invoice.models';

@Component({
  selector: 'app-invoice-form',
  imports: [ReactiveFormsModule],
  template: `
    <form class="space-y-4" [formGroup]="form" (ngSubmit)="submit()">
      @if (!invoice) { <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Projet associé</span><select class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="hasError('projectId')" [class.border-slate-200]="!hasError('projectId')" formControlName="projectId"><option value="">Sélectionne un projet</option>@for (project of projects; track project.id) { <option [value]="project.id">{{ project.title }}</option> }</select>@if (hasError('projectId')) { <span class="mt-1 block text-xs text-rose-600">Sélectionne un projet.</span> }</label> }
      <div class="grid gap-4 sm:grid-cols-2"><label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Numéro de facture</span><input class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="hasError('number')" [class.border-slate-200]="!hasError('number')" formControlName="number" placeholder="FAC-2026-001" />@if (hasError('number')) { <span class="mt-1 block text-xs text-rose-600">Le numéro est requis.</span> }</label><label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Montant (€)</span><input class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="hasError('amount')" [class.border-slate-200]="!hasError('amount')" type="number" min="0.01" step="0.01" formControlName="amount" placeholder="1500" />@if (hasError('amount')) { <span class="mt-1 block text-xs text-rose-600">Indique un montant positif.</span> }</label></div>
      <div class="grid gap-4 sm:grid-cols-2"><label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Échéance</span><input class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="hasError('dueDate')" [class.border-slate-200]="!hasError('dueDate')" type="date" formControlName="dueDate" />@if (hasError('dueDate')) { <span class="mt-1 block text-xs text-rose-600">L’échéance est requise.</span> }</label><label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Statut</span><select class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" formControlName="status">@for (status of statuses; track status.value) { <option [value]="status.value">{{ status.label }}</option> }</select></label></div>
      <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">URL du PDF <span class="font-normal text-slate-400">(optionnel)</span></span><input class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="hasError('pdfUrl')" [class.border-slate-200]="!hasError('pdfUrl')" type="url" formControlName="pdfUrl" placeholder="https://exemple.com/facture.pdf" />@if (hasError('pdfUrl')) { <span class="mt-1 block text-xs text-rose-600">Saisis une URL valide.</span> }</label>
      <div class="flex justify-end gap-3 border-t border-slate-100 pt-5"><button class="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100" type="button" (click)="cancelled.emit()">Annuler</button><button class="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-60" type="submit" [disabled]="saving">@if (saving) { Enregistrement... } @else { {{ invoice ? 'Enregistrer' : 'Créer la facture' }} }</button></div>
    </form>
  `,
})
export class InvoiceFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private _invoice: Invoice | null = null;
  @Input() projects: Project[] = [];
  @Input() saving = false;
  @Output() readonly cancelled = new EventEmitter<void>();
  @Output() readonly submitted = new EventEmitter<CreateInvoicePayload | UpdateInvoicePayload>();
  @Input() set invoice(value: Invoice | null) { this._invoice = value; this.form.reset({ projectId: value?.projectId ?? '', number: value?.number ?? '', amount: value?.amount?.toString() ?? '', dueDate: this.toDateInput(value?.dueDate), status: value?.status ?? 'DRAFT', pdfUrl: value?.pdfUrl ?? '' }); }
  get invoice(): Invoice | null { return this._invoice; }
  protected readonly statuses: { value: InvoiceStatus; label: string }[] = [{ value: 'DRAFT', label: 'Brouillon' }, { value: 'SENT', label: 'Envoyée' }, { value: 'PAID', label: 'Payée' }, { value: 'OVERDUE', label: 'En retard' }];
  protected readonly form = this.formBuilder.nonNullable.group({ projectId: ['', Validators.required], number: ['', [Validators.required, Validators.maxLength(100)]], amount: ['', [Validators.required, Validators.min(0.01)]], dueDate: ['', Validators.required], status: ['DRAFT' as InvoiceStatus], pdfUrl: ['', Validators.pattern(/^https?:\/\/.+/)] });
  protected hasError(control: 'projectId' | 'number' | 'amount' | 'dueDate' | 'pdfUrl'): boolean { const field = this.form.controls[control]; return field.invalid && (field.touched || field.dirty); }
  protected submit(): void { if (this.form.invalid) { this.form.markAllAsTouched(); return; } const value = this.form.getRawValue(); const payload = { number: value.number.trim(), amount: Number(value.amount), dueDate: value.dueDate, status: value.status, pdfUrl: this.toNullable(value.pdfUrl) }; this.submitted.emit(this.invoice ? payload : { ...payload, projectId: value.projectId }); }
  private toNullable(value: string): string | null { const trimmed = value.trim(); return trimmed || null; }
  private toDateInput(value: string | undefined): string { return value ? value.slice(0, 10) : ''; }
}
