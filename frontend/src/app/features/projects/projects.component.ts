import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ClientsService } from '../clients/services/clients.service';
import { ProjectFormComponent } from './components/project-form.component';
import { ProjectsService } from './services/projects.service';
import type { Client } from '../../shared/models/client.models';
import type {
  CreateProjectPayload,
  Project,
  ProjectStatus,
  UpdateProjectPayload,
} from '../../shared/models/project.models';

@Component({
  selector: 'app-projects',
  imports: [CurrencyPipe, DatePipe, ProjectFormComponent],
  template: `
    <section class="space-y-7">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p class="text-sm font-semibold text-indigo-600">Production</p><h2 class="mt-1 text-3xl font-bold tracking-tight text-slate-950">Projets</h2><p class="mt-2 text-slate-500">Suis l'avancement et le budget de tes missions.</p></div><button type="button" class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60" [disabled]="!clients().length" (click)="openCreate()"><svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>Nouveau projet</button></div>

      @if (!loading() && !clients().length) { <div class="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">Crée d'abord un client avant d'ajouter un projet.</div> }
      @if (errorMessage()) { <div class="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><span>{{ errorMessage() }}</span><button type="button" class="font-semibold" (click)="loadData()">Réessayer</button></div> }

      <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div class="relative max-w-sm flex-1"><svg class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input class="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="search" placeholder="Rechercher un projet..." [value]="query()" (input)="query.set($any($event.target).value)" /></div><p class="text-sm text-slate-500">{{ filteredProjects().length }} projet@if (filteredProjects().length !== 1) {s}</p></div>
        @if (loading()) { <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">@for (item of [1, 2, 3]; track item) { <div class="h-52 animate-pulse rounded-2xl bg-slate-100"></div> }</div> }
        @else if (filteredProjects().length) { <div class="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">@for (project of filteredProjects(); track project.id) { <article class="group rounded-2xl border border-slate-200 p-5 transition hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/5"><div class="flex items-start justify-between gap-3"><span class="rounded-full px-2.5 py-1 text-xs font-bold" [class]="statusClass(project.status)">{{ statusLabel(project.status) }}</span><div class="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"><button class="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-700" type="button" aria-label="Modifier" (click)="openEdit(project)"><svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button><button class="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-700" type="button" aria-label="Supprimer" (click)="projectToDelete.set(project)"><svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M10 11v6M14 11v6M9 7V4h6v3M6 7l1 14h10l1-14"/></svg></button></div></div><h3 class="mt-5 text-lg font-bold text-slate-950">{{ project.title }}</h3><p class="mt-1 text-sm text-slate-500">{{ clientName(project.clientId) }}</p><p class="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{{ project.description || 'Aucune description pour ce projet.' }}</p><div class="mt-5 flex items-end justify-between border-t border-slate-100 pt-4"><div><p class="text-xs font-medium text-slate-500">Budget</p><p class="mt-1 font-bold text-slate-900">{{ project.budget | currency: 'EUR' : 'symbol' : '1.0-2' : 'fr' }}</p></div><div class="text-right"><p class="text-xs font-medium text-slate-500">Échéance</p><p class="mt-1 text-sm font-semibold text-slate-700">{{ project.endDate ? (project.endDate | date: 'd MMM y') : 'Non définie' }}</p></div></div></article> }</div> }
        @else { <div class="grid min-h-80 place-items-center p-8 text-center"><div><span class="grid mx-auto size-14 place-items-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">◫</span><h3 class="mt-5 text-lg font-bold text-slate-950">{{ query() ? 'Aucun résultat' : 'Aucun projet pour l’instant' }}</h3><p class="mt-2 max-w-sm text-sm leading-6 text-slate-500">{{ query() ? 'Essaie une autre recherche.' : 'Crée ton premier projet pour planifier une mission client.' }}</p>@if (!query() && clients().length) { <button type="button" class="mt-5 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white" (click)="openCreate()">Créer un projet</button> }</div></div> }
      </div>
    </section>

    @if (formOpen()) { <div class="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4"><button class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" type="button" aria-label="Fermer" (click)="closeForm()"></button><div class="relative my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-7"><div class="mb-6 flex items-start justify-between gap-4"><div><p class="text-sm font-semibold text-indigo-600">{{ selectedProject() ? 'Modifier le projet' : 'Nouveau projet' }}</p><h3 class="mt-1 text-2xl font-bold text-slate-950">{{ selectedProject() ? selectedProject()?.title : 'Créer un projet' }}</h3></div><button class="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" type="button" aria-label="Fermer" (click)="closeForm()"><svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><app-project-form [project]="selectedProject()" [clients]="clients()" [saving]="saving()" (cancelled)="closeForm()" (submitted)="saveProject($event)" /></div></div> }
    @if (projectToDelete(); as project) { <div class="fixed inset-0 z-50 grid place-items-center p-4"><button class="absolute inset-0 bg-slate-950/40" type="button" aria-label="Annuler" (click)="projectToDelete.set(null)"></button><div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><span class="grid size-11 place-items-center rounded-xl bg-rose-100 text-rose-700"><svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M10 11v6M14 11v6M9 7V4h6v3M6 7l1 14h10l1-14"/></svg></span><h3 class="mt-5 text-xl font-bold text-slate-950">Supprimer {{ project.title }} ?</h3><p class="mt-2 text-sm leading-6 text-slate-500">Cette action est définitive et ne pourra pas être annulée.</p><div class="mt-6 flex justify-end gap-3"><button class="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100" type="button" (click)="projectToDelete.set(null)">Annuler</button><button class="rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60" type="button" [disabled]="saving()" (click)="deleteProject(project)">@if (saving()) { Suppression... } @else { Supprimer }</button></div></div></div> }
  `,
})
export class ProjectsComponent implements OnInit {
  private readonly clientsService = inject(ClientsService);
  private readonly projectsService = inject(ProjectsService);
  protected readonly clients = signal<Client[]>([]);
  protected readonly projects = signal<Project[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly query = signal('');
  protected readonly formOpen = signal(false);
  protected readonly selectedProject = signal<Project | null>(null);
  protected readonly projectToDelete = signal<Project | null>(null);
  protected readonly filteredProjects = computed(() => {
    const term = this.query().trim().toLocaleLowerCase();
    if (!term) return this.projects();
    return this.projects().filter((project) => [project.title, project.description, this.clientName(project.clientId)].some((value) => value?.toLocaleLowerCase().includes(term)));
  });

  ngOnInit(): void { this.loadData(); }
  protected loadData(): void {
    this.loading.set(true); this.errorMessage.set('');
    forkJoin({ clients: this.clientsService.findAll(), projects: this.projectsService.findAll() }).subscribe({
      next: ({ clients, projects }) => { this.clients.set(clients); this.projects.set(projects); this.loading.set(false); },
      error: () => { this.errorMessage.set('Impossible de charger tes projets. Vérifie ta connexion puis réessaie.'); this.loading.set(false); },
    });
  }
  protected openCreate(): void { this.selectedProject.set(null); this.formOpen.set(true); }
  protected openEdit(project: Project): void { this.selectedProject.set(project); this.formOpen.set(true); }
  protected closeForm(): void { if (!this.saving()) this.formOpen.set(false); }
  protected saveProject(payload: CreateProjectPayload | UpdateProjectPayload): void {
    const selected = this.selectedProject();
    const request = selected ? this.projectsService.update(selected.id, payload as UpdateProjectPayload) : this.projectsService.create(payload as CreateProjectPayload);
    this.saving.set(true);
    request.subscribe({ next: (project) => { this.projects.update((projects) => selected ? projects.map((current) => current.id === project.id ? project : current) : [project, ...projects]); this.saving.set(false); this.formOpen.set(false); }, error: (error: HttpErrorResponse) => { this.errorMessage.set(this.getError(error, 'Impossible d’enregistrer ce projet.')); this.saving.set(false); } });
  }
  protected deleteProject(project: Project): void {
    this.saving.set(true);
    this.projectsService.remove(project.id).subscribe({ next: () => { this.projects.update((projects) => projects.filter((current) => current.id !== project.id)); this.projectToDelete.set(null); this.saving.set(false); }, error: (error: HttpErrorResponse) => { this.errorMessage.set(this.getError(error, 'Impossible de supprimer ce projet.')); this.saving.set(false); } });
  }
  protected clientName(clientId: string): string { return this.clients().find((client) => client.id === clientId)?.name ?? 'Client inconnu'; }
  protected statusLabel(status: ProjectStatus): string { return { PENDING: 'En attente', IN_PROGRESS: 'En cours', COMPLETED: 'Terminé', CANCELLED: 'Annulé' }[status]; }
  protected statusClass(status: ProjectStatus): string { return { PENDING: 'bg-amber-100 text-amber-700', IN_PROGRESS: 'bg-indigo-100 text-indigo-700', COMPLETED: 'bg-emerald-100 text-emerald-700', CANCELLED: 'bg-slate-100 text-slate-600' }[status]; }
  private getError(error: HttpErrorResponse, fallback: string): string { return typeof error.error?.message === 'string' ? error.error.message : fallback; }
}
