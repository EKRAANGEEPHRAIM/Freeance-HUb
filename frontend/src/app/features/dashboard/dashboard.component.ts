import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClientsService } from '../clients/services/clients.service';
import { InvoicesService } from '../invoices/services/invoices.service';
import { NotesService } from '../notes/services/notes.service';
import { ProjectsService } from '../projects/services/projects.service';
import type { Client } from '../../shared/models/client.models';
import type { Invoice } from '../../shared/models/invoice.models';
import type { Note } from '../../shared/models/note.models';
import type { Project } from '../../shared/models/project.models';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  template: `
    <section class="space-y-8">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p class="text-sm font-semibold text-indigo-600">Vue d'ensemble</p><h2 class="mt-1 text-3xl font-bold tracking-tight text-slate-950">Tableau de bord</h2><p class="mt-2 text-slate-500">Pilote ton activité freelance au même endroit.</p></div><a routerLink="/projects" class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"><svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>Créer un projet</a></div>
      @if (errorMessage()) { <div class="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><span>{{ errorMessage() }}</span><button class="font-semibold" type="button" (click)="loadData()">Réessayer</button></div> }
      @if (loading()) { <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">@for (item of [1, 2, 3, 4]; track item) { <div class="h-36 animate-pulse rounded-2xl bg-slate-100"></div> }</div> }
      @else { <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">@for (stat of stats(); track stat.label) { <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div class="flex items-start justify-between"><p class="text-sm font-medium text-slate-500">{{ stat.label }}</p><span class="grid size-9 place-items-center rounded-xl" [class]="stat.color">{{ stat.icon }}</span></div><p class="mt-5 text-3xl font-bold tracking-tight text-slate-950">{{ stat.value }}</p><p class="mt-2 text-xs font-medium text-slate-500">{{ stat.description }}</p></article> }</div> }
      <div class="grid gap-6 xl:grid-cols-5">
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3"><div class="flex items-center justify-between"><div><h3 class="font-bold text-slate-950">Factures à échéance</h3><p class="mt-1 text-sm text-slate-500">Les prochaines factures à suivre.</p></div><a routerLink="/invoices" class="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Voir tout</a></div>@if (upcomingInvoices().length) { <div class="mt-5 divide-y divide-slate-100">@for (invoice of upcomingInvoices(); track invoice.id) { <div class="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><div><p class="font-semibold text-slate-900">{{ invoice.number }}</p><p class="mt-1 text-sm text-slate-500">{{ projectName(invoice.projectId) }} · {{ invoice.dueDate | date: 'd MMM y' }}</p></div><p class="font-bold text-slate-900">{{ invoice.amount | currency: 'EUR' : 'symbol' : '1.0-2' : 'fr' }}</p></div> }</div> } @else { <p class="mt-7 text-sm text-slate-500">Aucune facture à suivre pour l’instant.</p> }</article>
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2"><div class="flex items-center justify-between"><div><h3 class="font-bold text-slate-950">Dernières notes</h3><p class="mt-1 text-sm text-slate-500">Tes notes récemment mises à jour.</p></div><a routerLink="/notes" class="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Voir tout</a></div>@if (recentNotes().length) { <div class="mt-5 space-y-4">@for (note of recentNotes(); track note.id) { <div><p class="font-semibold text-slate-900">{{ note.title }}</p><p class="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">{{ note.content }}</p></div> }</div> } @else { <p class="mt-7 text-sm text-slate-500">Aucune note récente.</p> }</article>
      </div>
      <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div class="flex items-center justify-between gap-4"><div><h3 class="font-bold text-slate-950">Configuration de ton espace</h3><p class="mt-1 text-sm text-slate-500">{{ completedSteps() === 3 ? 'Ton espace est prêt à être utilisé.' : 'Complète ces étapes pour démarrer.' }}</p></div><span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Étape {{ completedSteps() }} sur 3</span></div><div class="mt-6 h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-indigo-600 transition-all" [style.width.%]="completedSteps() / 3 * 100"></div></div></article>
    </section>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly clientsService = inject(ClientsService);
  private readonly projectsService = inject(ProjectsService);
  private readonly invoicesService = inject(InvoicesService);
  private readonly notesService = inject(NotesService);

  protected readonly clients = signal<Client[]>([]);
  protected readonly projects = signal<Project[]>([]);
  protected readonly invoices = signal<Invoice[]>([]);
  protected readonly notes = signal<Note[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly completedSteps = computed(() => [this.clients().length, this.projects().length, this.invoices().length].filter(Boolean).length);
  protected readonly stats = computed(() => {
    const activeProjects = this.projects().filter((project) => project.status === 'IN_PROGRESS').length;
    const invoicesToTrack = this.invoices().filter((invoice) => invoice.status === 'SENT' || invoice.status === 'OVERDUE').length;
    const paidRevenue = this.invoices().filter((invoice) => invoice.status === 'PAID').reduce((total, invoice) => total + invoice.amount, 0);
    return [
      { label: 'Clients actifs', value: this.clients().length.toString(), description: 'Contacts enregistrés', icon: '↗', color: 'bg-indigo-50 text-indigo-600' },
      { label: 'Projets en cours', value: activeProjects.toString(), description: 'Missions actives', icon: '◫', color: 'bg-violet-50 text-violet-600' },
      { label: 'Factures à suivre', value: invoicesToTrack.toString(), description: 'Envoyées ou en retard', icon: '€', color: 'bg-amber-50 text-amber-600' },
      { label: 'Chiffre d’affaires', value: `${paidRevenue.toLocaleString('fr-FR')} €`, description: 'Factures payées', icon: '↗', color: 'bg-emerald-50 text-emerald-600' },
    ];
  });
  protected readonly upcomingInvoices = computed(() => this.invoices().filter((invoice) => invoice.status !== 'PAID').sort((left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime()).slice(0, 4));
  protected readonly recentNotes = computed(() => [...this.notes()].sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()).slice(0, 3));

  ngOnInit(): void { this.loadData(); }

  protected loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    forkJoin({ clients: this.clientsService.findAll(), projects: this.projectsService.findAll(), invoices: this.invoicesService.findAll(), notes: this.notesService.findAll() }).subscribe({
      next: ({ clients, projects, invoices, notes }) => { this.clients.set(clients); this.projects.set(projects); this.invoices.set(invoices); this.notes.set(notes); this.loading.set(false); },
      error: () => { this.errorMessage.set('Impossible de charger les données du tableau de bord.'); this.loading.set(false); },
    });
  }

  protected projectName(projectId: string): string { return this.projects().find((project) => project.id === projectId)?.title ?? 'Projet inconnu'; }
}
