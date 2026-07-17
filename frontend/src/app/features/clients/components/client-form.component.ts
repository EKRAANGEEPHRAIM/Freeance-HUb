import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Client, ClientPayload } from '../../../shared/models/client.models';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule],
  template: `
    <form class="space-y-5" [formGroup]="form" (ngSubmit)="submit()">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Nom complet</span><input class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="hasError('name')" [class.border-slate-200]="!hasError('name')" formControlName="name" placeholder="Sofia Martin" />@if (hasError('name')) { <span class="mt-1 block text-xs text-rose-600">Le nom est requis.</span> }</label>
        <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Entreprise</span><input class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" formControlName="company" placeholder="Studio Martin" /></label>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Adresse e-mail</span><input class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="hasError('email')" [class.border-slate-200]="!hasError('email')" type="email" formControlName="email" placeholder="sofia@exemple.com" />@if (hasError('email')) { <span class="mt-1 block text-xs text-rose-600">Saisis une adresse e-mail valide.</span> }</label>
        <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Téléphone</span><input class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="tel" formControlName="phone" placeholder="+33 6 12 34 56 78" /></label>
      </div>
      <div class="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button class="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100" type="button" (click)="cancelled.emit()">Annuler</button>
        <button class="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60" type="submit" [disabled]="saving">@if (saving) { Enregistrement... } @else { {{ client ? 'Enregistrer' : 'Créer le client' }} }</button>
      </div>
    </form>
  `,
})
export class ClientFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Input() saving = false;
  @Output() readonly cancelled = new EventEmitter<void>();
  @Output() readonly submitted = new EventEmitter<ClientPayload>();

  @Input() set client(value: Client | null) {
    this._client = value;
    this.form.reset({
      name: value?.name ?? '',
      email: value?.email ?? '',
      phone: value?.phone ?? '',
      company: value?.company ?? '',
    });
  }

  get client(): Client | null {
    return this._client;
  }

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    phone: ['', [Validators.maxLength(255)]],
    company: ['', [Validators.maxLength(255)]],
  });
  private _client: Client | null = null;

  protected hasError(controlName: 'name' | 'email'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.submitted.emit({
      name: value.name.trim(),
      email: value.email.trim(),
      phone: this.toNullable(value.phone),
      company: this.toNullable(value.company),
    });
  }

  private toNullable(value: string): string | null {
    const trimmed = value.trim();
    return trimmed || null;
  }
}
