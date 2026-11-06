import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClientsService } from '../clients/services/clients.service';
import { InvoicesService } from '../invoices/services/invoices.service';
import { NotesService } from '../notes/services/notes.service';
import { ProjectsService } from '../projects/services/projects.service';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { formatMoney, toXof, type Currency } from '../../shared/utils/money';
import type { Client } from '../../shared/models/client.models';
import type { Invoice } from '../../shared/models/invoice.models';
import type { Note } from '../../shared/models/note.models';
import type { Project } from '../../shared/models/project.models';

/** Nombre de mois affichés sur le graphique des encaissements */
const CHART_MONTHS = 6;

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, MoneyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="space-y-8">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="text-sm font-semibold text-indigo-600">Vue d'ensemble</p>
          <h2 class="mt-1 text-3xl font-bold tracking-tight text-slate-950">Tableau de bord</h2>
          <p class="mt-2 text-slate-500">Pilote ton activité freelance au même endroit.</p>
        </div>
        <a
          routerLink="/projects"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
          ><svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 5v14M5 12h14" /></svg
          >Créer un projet</a
        >
      </div>
      @if (errorMessage()) {
        <div
          class="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <span>{{ errorMessage() }}</span
          ><button class="font-semibold" type="button" (click)="loadData()">Réessayer</button>
        </div>
      }
      @if (loading()) {
        <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          @for (item of [1, 2, 3, 4]; track item) {
            <div class="h-36 animate-pulse rounded-2xl bg-slate-100"></div>
          }
        </div>
      } @else {
        <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          @for (stat of stats(); track stat.label) {
            <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-start justify-between">
                <p class="text-sm font-medium text-slate-500">{{ stat.label }}</p>
                <span class="size-2.5 rounded-full" [class]="stat.dot"></span>
              </div>
              <p class="mt-5 text-2xl font-bold tracking-tight text-slate-950">{{ stat.value }}</p>
              <p class="mt-2 text-xs font-medium text-slate-500">{{ stat.description }}</p>
            </article>
          }
        </div>
      }

      @if (!loading()) {
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 class="font-bold text-slate-950">Encaissements des 6 derniers mois</h3>
              <p class="mt-1 text-sm text-slate-500">
                Factures payées, par mois d'échéance, en FCFA (euros convertis au taux fixe).
              </p>
            </div>
            <p class="text-sm font-semibold text-slate-700">
              Total : {{ chartTotal() | money: 'XOF' }}
            </p>
          </div>
          <div class="mt-6 grid h-48 grid-cols-6 items-end gap-3 border-b border-slate-200">
            @for (month of revenueByMonth(); track month.key) {
              <div class="flex h-full flex-col items-center justify-end gap-2">
                @if (month.total > 0) {
                  <span class="text-[11px] font-semibold text-slate-600">{{
                    compact(month.total)
                  }}</span>
                }
                <div
                  class="w-full max-w-14 rounded-t-lg bg-indigo-600 transition-all"
                  [style.height.%]="month.height"
                  [class.bg-slate-200]="month.total === 0"
                  [style.min-height.px]="month.total === 0 ? 4 : 8"
                  [attr.aria-label]="month.label + ' : ' + money(month.total)"
                ></div>
              </div>
            }
          </div>
          <div
            class="mt-2 grid grid-cols-6 gap-3 text-center text-xs font-medium capitalize text-slate-500"
          >
            @for (month of revenueByMonth(); track month.key) {
              <span>{{ month.label }}</span>
            }
          </div>
        </article>
      }

      <div class="grid gap-6 xl:grid-cols-5">
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-bold text-slate-950">Factures à suivre</h3>
              <p class="mt-1 text-sm text-slate-500">
                Les prochaines échéances, retards en premier.
              </p>
            </div>
            <a
              routerLink="/invoices"
              class="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >Voir tout</a
            >
          </div>
          @if (upcomingInvoices().length) {
            <div class="mt-5 divide-y divide-slate-100">
              @for (invoice of upcomingInvoices(); track invoice.id) {
                <a
                  [routerLink]="['/invoices', invoice.id]"
                  class="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 hover:opacity-80"
                  ><div>
                    <p class="font-semibold text-slate-900">
                      {{ invoice.number }}
                      @if (invoice.status === 'OVERDUE') {
                        <span
                          class="ml-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700"
                          >En retard</span
                        >
                      }
                    </p>
                    <p class="mt-1 text-sm text-slate-500">
                      {{ projectName(invoice.projectId) }} · {{ invoice.dueDate | date: 'd MMM y' }}
                    </p>
                  </div>
                  <p class="font-bold text-slate-900">
                    {{ invoice.amount | money: projectCurrency(invoice.projectId) }}
                  </p></a
                >
              }
            </div>
          } @else {
            <p class="mt-7 text-sm text-slate-500">Aucune facture à suivre pour l’instant.</p>
          }
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-bold text-slate-950">Dernières notes</h3>
              <p class="mt-1 text-sm text-slate-500">Tes notes récemment mises à jour.</p>
            </div>
            <a
              routerLink="/notes"
              class="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >Voir tout</a
            >
          </div>
          @if (recentNotes().length) {
            <div class="mt-5 space-y-4">
              @for (note of recentNotes(); track note.id) {
                <div>
                  <p class="font-semibold text-slate-900">{{ note.title }}</p>
                  <p class="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                    {{ note.content }}
                  </p>
                </div>
              }
            </div>
          } @else {
            <p class="mt-7 text-sm text-slate-500">Aucune note récente.</p>
          }
        </article>
      </div>
      @if (completedSteps() < 3) {
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h3 class="font-bold text-slate-950">Configuration de ton espace</h3>
              <p class="mt-1 text-sm text-slate-500">
                Ajoute un client, un projet puis une facture pour démarrer.
              </p>
            </div>
            <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
              >Étape {{ completedSteps() }} sur 3</span
            >
          </div>
          <div class="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              class="h-full rounded-full bg-indigo-600 transition-all"
              [style.width.%]="(completedSteps() / 3) * 100"
            ></div>
          </div>
        </article>
      }
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
  protected readonly completedSteps = computed(
    () =>
      [this.clients().length, this.projects().length, this.invoices().length].filter(Boolean)
        .length,
  );

  /** Montant d'une facture ramené en FCFA */
  private readonly invoiceXof = (invoice: Invoice): number =>
    toXof(invoice.amount, this.projectCurrency(invoice.projectId));

  protected readonly stats = computed(() => {
    const activeProjects = this.projects().filter(
      (project) => project.status === 'IN_PROGRESS',
    ).length;
    const pending = this.invoices().filter(
      (invoice) => invoice.status === 'SENT' || invoice.status === 'OVERDUE',
    );
    const overdue = pending.filter((invoice) => invoice.status === 'OVERDUE').length;
    const paid = this.invoices()
      .filter((invoice) => invoice.status === 'PAID')
      .reduce((total, invoice) => total + this.invoiceXof(invoice), 0);
    const toCollect = pending.reduce((total, invoice) => total + this.invoiceXof(invoice), 0);
    return [
      {
        label: 'Clients',
        value: this.clients().length.toString(),
        description: 'Contacts enregistrés',
        dot: 'bg-indigo-500',
      },
      {
        label: 'Projets en cours',
        value: activeProjects.toString(),
        description: 'Missions actives',
        dot: 'bg-violet-500',
      },
      {
        label: 'À encaisser',
        value: formatMoney(toCollect, 'XOF'),
        description: overdue
          ? `${pending.length} factures, dont ${overdue} en retard`
          : `${pending.length} factures envoyées`,
        dot: overdue ? 'bg-rose-500' : 'bg-amber-500',
      },
      {
        label: 'Encaissé',
        value: formatMoney(paid, 'XOF'),
        description: 'Factures payées (FCFA)',
        dot: 'bg-emerald-500',
      },
    ];
  });

  protected readonly revenueByMonth = computed(() => {
    const now = new Date();
    const months = Array.from({ length: CHART_MONTHS }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (CHART_MONTHS - 1 - index), 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleDateString('fr-FR', { month: 'short' }),
        total: 0,
        height: 0,
      };
    });
    for (const invoice of this.invoices()) {
      if (invoice.status !== 'PAID') continue;
      const due = new Date(invoice.dueDate);
      const month = months.find((m) => m.key === `${due.getFullYear()}-${due.getMonth()}`);
      if (month) month.total += this.invoiceXof(invoice);
    }
    const max = Math.max(...months.map((m) => m.total), 1);
    return months.map((m) => ({ ...m, height: (m.total / max) * 85 }));
  });

  protected readonly chartTotal = computed(() =>
    this.revenueByMonth().reduce((sum, month) => sum + month.total, 0),
  );

  protected readonly upcomingInvoices = computed(() =>
    this.invoices()
      .filter((invoice) => invoice.status === 'SENT' || invoice.status === 'OVERDUE')
      .sort(
        (left, right) =>
          Number(right.status === 'OVERDUE') - Number(left.status === 'OVERDUE') ||
          new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime(),
      )
      .slice(0, 4),
  );
  protected readonly recentNotes = computed(() =>
    [...this.notes()]
      .sort(
        (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
      )
      .slice(0, 3),
  );

  ngOnInit(): void {
    this.loadData();
  }

  protected loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    forkJoin({
      clients: this.clientsService.findAll(),
      projects: this.projectsService.findAll(),
      invoices: this.invoicesService.findAll(),
      notes: this.notesService.findAll(),
    }).subscribe({
      next: ({ clients, projects, invoices, notes }) => {
        this.clients.set(clients);
        this.projects.set(projects);
        this.invoices.set(invoices);
        this.notes.set(notes);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les données du tableau de bord.');
        this.loading.set(false);
      },
    });
  }

  protected projectName(projectId: string): string {
    return this.projects().find((project) => project.id === projectId)?.title ?? 'Projet inconnu';
  }
  protected projectCurrency(projectId: string): Currency {
    return this.projects().find((project) => project.id === projectId)?.currency ?? 'XOF';
  }

  /** 650000 → « 650k » pour les étiquettes du graphique */
  protected compact(amount: number): string {
    return new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }).format(
      amount,
    );
  }

  protected money(amount: number): string {
    return formatMoney(amount, 'XOF');
  }
}
