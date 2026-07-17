import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Client } from '../../../shared/models/client.models';
import type {
  CreateProjectPayload,
  Project,
  ProjectStatus,
  UpdateProjectPayload,
} from '../../../shared/models/project.models';

@Component({
  selector: 'app-project-form',
  imports: [ReactiveFormsModule],
  template: `
    <form class="space-y-4" [formGroup]="form" (ngSubmit)="submit()">
      @if (!project) {
        <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Client</span><select class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="hasError('clientId')" [class.border-slate-200]="!hasError('clientId')" formControlName="clientId"><option value="">Sélectionne un client</option>@for (client of clients; track client.id) { <option [value]="client.id">{{ client.name }}@if (client.company) { — {{ client.company }} }</option> }</select>@if (hasError('clientId')) { <span class="mt-1 block text-xs text-rose-600">Sélectionne un client.</span> }</label>
      }
      <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Nom du projet</span><input class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="hasError('title')" [class.border-slate-200]="!hasError('title')" formControlName="title" placeholder="Refonte du site vitrine" />@if (hasError('title')) { <span class="mt-1 block text-xs text-rose-600">Le nom du projet est requis.</span> }</label>
      <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Description</span><textarea class="min-h-24 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" formControlName="description" placeholder="Décris brièvement le périmètre du projet."></textarea></label>
      <div class="grid gap-4 sm:grid-cols-2"><label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Statut</span><select class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" formControlName="status">@for (status of statuses; track status.value) { <option [value]="status.value">{{ status.label }}</option> }</select></label><label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Budget (€)</span><input class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="hasError('budget')" [class.border-slate-200]="!hasError('budget')" type="number" min="0.01" step="0.01" formControlName="budget" placeholder="2500" />@if (hasError('budget')) { <span class="mt-1 block text-xs text-rose-600">Indique un budget positif.</span> }</label></div>
      <div class="grid gap-4 sm:grid-cols-2"><label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Date de début</span><input class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="date" formControlName="startDate" /></label><label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Date de fin</span><input class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="form.errors?.['endDate']" [class.border-slate-200]="!form.errors?.['endDate']" type="date" formControlName="endDate" />@if (form.errors?.['endDate']) { <span class="mt-1 block text-xs text-rose-600">La date de fin doit être postérieure à celle de début.</span> }</label></div>
      <div class="flex justify-end gap-3 border-t border-slate-100 pt-5"><button class="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100" type="button" (click)="cancelled.emit()">Annuler</button><button class="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-60" type="submit" [disabled]="saving">@if (saving) { Enregistrement... } @else { {{ project ? 'Enregistrer' : 'Créer le projet' }} }</button></div>
    </form>
  `,
})
export class ProjectFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private _project: Project | null = null;

  @Input() clients: Client[] = [];
  @Input() saving = false;
  @Output() readonly cancelled = new EventEmitter<void>();
  @Output() readonly submitted = new EventEmitter<CreateProjectPayload | UpdateProjectPayload>();
  @Input() set project(value: Project | null) {
    this._project = value;
    this.form.reset({
      clientId: value?.clientId ?? '',
      title: value?.title ?? '',
      description: value?.description ?? '',
      status: value?.status ?? 'PENDING',
      startDate: this.toDateInput(value?.startDate),
      endDate: this.toDateInput(value?.endDate),
      budget: value?.budget?.toString() ?? '',
    });
  }

  get project(): Project | null { return this._project; }

  protected readonly statuses: { value: ProjectStatus; label: string }[] = [
    { value: 'PENDING', label: 'En attente' },
    { value: 'IN_PROGRESS', label: 'En cours' },
    { value: 'COMPLETED', label: 'Terminé' },
    { value: 'CANCELLED', label: 'Annulé' },
  ];
  protected readonly form = this.formBuilder.nonNullable.group({
    clientId: ['', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.maxLength(5000)],
    status: ['PENDING' as ProjectStatus],
    startDate: [''],
    endDate: [''],
    budget: ['', [Validators.required, Validators.min(0.01)]],
  }, { validators: (control) => {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;
    return startDate && endDate && endDate <= startDate ? { endDate: true } : null;
  }});

  protected hasError(controlName: 'clientId' | 'title' | 'budget'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    const startDate = this.toNullable(value.startDate);
    const payload = {
      title: value.title.trim(),
      description: this.toNullable(value.description),
      status: value.status,
      ...(startDate ? { startDate } : {}),
      endDate: this.toNullable(value.endDate),
      budget: Number(value.budget),
    };
    this.submitted.emit(this.project ? payload : { ...payload, clientId: value.clientId });
  }

  private toNullable(value: string): string | null { const trimmed = value.trim(); return trimmed || null; }
  private toDateInput(value: string | null | undefined): string { return value ? value.slice(0, 10) : ''; }
}
