import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import type { Client, ClientPayload } from '../../shared/models/client.models';
import { ClientFormComponent } from './components/client-form.component';
import { ClientsService } from './services/clients.service';

@Component({
  selector: 'app-clients',
  imports: [ClientFormComponent, DatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="space-y-7">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="text-sm font-semibold text-indigo-600">Relations</p>
          <h2 class="mt-1 text-3xl font-bold tracking-tight text-slate-950">Clients</h2>
          <p class="mt-2 text-slate-500">Gère tous tes contacts au même endroit.</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
          (click)="openCreate()"
        >
          <svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nouveau client
        </button>
      </div>

      @if (errorMessage()) {
        <div
          class="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <span>{{ errorMessage() }}</span>
          <button type="button" class="font-semibold" (click)="loadClients()">Réessayer</button>
        </div>
      }

      <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div
          class="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="relative max-w-sm flex-1">
            <svg
              class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              class="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              type="search"
              placeholder="Rechercher un client..."
              [value]="query()"
              (input)="query.set($any($event.target).value)"
            />
          </div>
          <p class="text-sm text-slate-500">
            {{ filteredClients().length }} client
            @if (filteredClients().length !== 1) {
              s
            }
          </p>
        </div>

        @if (loading()) {
          <div class="space-y-4 p-5">
            @for (item of [1, 2, 3]; track item) {
              <div class="h-16 animate-pulse rounded-xl bg-slate-100"></div>
            }
          </div>
        } @else if (filteredClients().length) {
          <div class="overflow-x-auto">
            <table class="w-full min-w-[720px] text-left text-sm">
              <thead
                class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                <tr>
                  <th class="px-6 py-4">Client</th>
                  <th class="px-6 py-4">Entreprise</th>
                  <th class="px-6 py-4">Contact</th>
                  <th class="px-6 py-4">Ajouté le</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (client of filteredClients(); track client.id) {
                  <tr class="group transition hover:bg-slate-50/80">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <span
                          class="grid size-10 place-items-center rounded-xl bg-indigo-100 font-bold text-indigo-700"
                          >{{ initials(client.name) }}</span
                        >
                        <div>
                          <p class="font-semibold text-slate-900">{{ client.name }}</p>
                          <p class="mt-0.5 text-xs text-slate-500">{{ client.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-slate-600">{{ client.company || '—' }}</td>
                    <td class="px-6 py-4 text-slate-600">{{ client.phone || '—' }}</td>
                    <td class="px-6 py-4 text-slate-500">
                      {{ client.createdAt | date: 'd MMM y' }}
                    </td>
                    <td class="px-6 py-4">
                      <div
                        class="flex justify-end gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <button
                          class="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
                          type="button"
                          aria-label="Modifier"
                          (click)="openEdit(client)"
                        >
                          <svg
                            class="size-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg></button
                        ><button
                          class="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                          type="button"
                          aria-label="Supprimer"
                          (click)="clientToDelete.set(client)"
                        >
                          <svg
                            class="size-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path d="M4 7h16M10 11v6M14 11v6M9 7V4h6v3M6 7l1 14h10l1-14" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="grid min-h-80 place-items-center p-8 text-center">
            <div>
              <span
                class="grid mx-auto size-14 place-items-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600"
                >♙</span
              >
              <h3 class="mt-5 text-lg font-bold text-slate-950">
                {{ query() ? 'Aucun résultat' : 'Aucun client pour l’instant' }}
              </h3>
              <p class="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {{
                  query()
                    ? 'Essaie une autre recherche.'
                    : 'Ajoute ton premier client pour commencer à organiser ton activité.'
                }}
              </p>
              @if (!query()) {
                <button
                  type="button"
                  class="mt-5 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
                  (click)="openCreate()"
                >
                  Ajouter un client
                </button>
              }
            </div>
          </div>
        }
      </div>
    </section>

    @if (formOpen()) {
      <div class="fixed inset-0 z-50 grid place-items-center p-4">
        <button
          class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          type="button"
          aria-label="Fermer"
          (click)="closeForm()"
        ></button>
        <div class="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
          <div class="mb-6 flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-indigo-600">
                {{ selectedClient() ? 'Modifier le contact' : 'Nouveau contact' }}
              </p>
              <h3 class="mt-1 text-2xl font-bold text-slate-950">
                {{ selectedClient() ? 'Modifier le client' : 'Ajouter un client' }}
              </h3>
            </div>
            <button
              class="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
              type="button"
              aria-label="Fermer"
              (click)="closeForm()"
            >
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <app-client-form
            [client]="selectedClient()"
            [saving]="saving()"
            (cancelled)="closeForm()"
            (submitted)="saveClient($event)"
          />
        </div>
      </div>
    }

    @if (clientToDelete(); as client) {
      <div class="fixed inset-0 z-50 grid place-items-center p-4">
        <button
          class="absolute inset-0 bg-slate-950/40"
          type="button"
          aria-label="Annuler"
          (click)="clientToDelete.set(null)"
        ></button>
        <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <span class="grid size-11 place-items-center rounded-xl bg-rose-100 text-rose-700"
            ><svg
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M4 7h16M10 11v6M14 11v6M9 7V4h6v3M6 7l1 14h10l1-14" /></svg
          ></span>
          <h3 class="mt-5 text-xl font-bold text-slate-950">Supprimer {{ client.name }} ?</h3>
          <p class="mt-2 text-sm leading-6 text-slate-500">
            Cette action supprimera définitivement ce client et les éléments qui lui sont associés.
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <button
              class="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              type="button"
              (click)="clientToDelete.set(null)"
            >
              Annuler</button
            ><button
              class="rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              type="button"
              [disabled]="saving()"
              (click)="deleteClient(client)"
            >
              @if (saving()) {
                Suppression...
              } @else {
                Supprimer
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ClientsComponent implements OnInit {
  private readonly clientsService = inject(ClientsService);

  protected readonly clients = signal<Client[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly query = signal('');
  protected readonly formOpen = signal(false);
  protected readonly selectedClient = signal<Client | null>(null);
  protected readonly clientToDelete = signal<Client | null>(null);
  protected readonly filteredClients = computed(() => {
    const term = this.query().trim().toLocaleLowerCase();
    if (!term) return this.clients();
    return this.clients().filter((client) =>
      [client.name, client.email, client.company, client.phone].some((value) =>
        value?.toLocaleLowerCase().includes(term),
      ),
    );
  });

  ngOnInit(): void {
    this.loadClients();
  }

  protected loadClients(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.clientsService.findAll().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Impossible de charger tes clients. Vérifie ta connexion puis réessaie.',
        );
        this.loading.set(false);
      },
    });
  }

  protected openCreate(): void {
    this.selectedClient.set(null);
    this.formOpen.set(true);
  }

  protected openEdit(client: Client): void {
    this.selectedClient.set(client);
    this.formOpen.set(true);
  }

  protected closeForm(): void {
    if (!this.saving()) this.formOpen.set(false);
  }

  protected saveClient(payload: ClientPayload): void {
    const selectedClient = this.selectedClient();
    const request = selectedClient
      ? this.clientsService.update(selectedClient.id, payload)
      : this.clientsService.create(payload);

    this.saving.set(true);
    request.subscribe({
      next: (client) => {
        this.clients.update((clients) =>
          selectedClient
            ? clients.map((currentClient) =>
                currentClient.id === client.id ? client : currentClient,
              )
            : [client, ...clients],
        );
        this.saving.set(false);
        this.formOpen.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getErrorMessage(error, 'Impossible d’enregistrer ce client.'));
        this.saving.set(false);
      },
    });
  }

  protected deleteClient(client: Client): void {
    this.saving.set(true);
    this.clientsService.remove(client.id).subscribe({
      next: () => {
        this.clients.update((clients) =>
          clients.filter((currentClient) => currentClient.id !== client.id),
        );
        this.clientToDelete.set(null);
        this.saving.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getErrorMessage(error, 'Impossible de supprimer ce client.'));
        this.saving.set(false);
      },
    });
  }

  protected initials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
    return typeof error.error?.message === 'string' ? error.error.message : fallback;
  }
}
