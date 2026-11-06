import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ClientsService } from '../clients/services/clients.service';
import { ProjectsService } from '../projects/services/projects.service';
import { InvoicesService } from './services/invoices.service';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { formatMoney } from '../../shared/utils/money';
import type { Client } from '../../shared/models/client.models';
import type { Invoice, InvoiceStatus } from '../../shared/models/invoice.models';
import type { Project } from '../../shared/models/project.models';

/** Moyens de paiement affichés sur la facture, selon la devise */
const PAYMENT_METHODS = {
  XOF: ['Orange Money', 'MTN MoMo', 'Wave', 'Moov Money', 'Virement bancaire'],
  EUR: ['Virement bancaire (SEPA)', 'Wave', 'Carte bancaire sur demande'],
} as const;

/**
 * Facture prête à envoyer : imprimable en PDF (Ctrl+P), partageable par WhatsApp ou
 * e-mail, avec un message de relance pour les factures envoyées ou en retard.
 */
@Component({
  selector: 'app-invoice-document',
  imports: [DatePipe, MoneyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (loading()) {
      <div class="mx-auto h-[600px] max-w-3xl animate-pulse rounded-2xl bg-slate-100"></div>
    } @else if (!invoice() || !project()) {
      <div class="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        Facture introuvable.
        <a routerLink="/invoices" class="font-semibold underline">Retour aux factures</a>
      </div>
    } @else {
      <div class="mx-auto max-w-3xl space-y-5">
        <!-- Actions (non imprimées) -->
        <div class="no-print flex flex-wrap items-center justify-between gap-3">
          <a
            routerLink="/invoices"
            class="text-sm font-semibold text-slate-500 hover:text-slate-900"
            >← Factures</a
          >
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              (click)="print()"
              class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Imprimer / PDF
            </button>
            <a
              [href]="emailLink()"
              class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Envoyer par e-mail
            </a>
            <a
              [href]="whatsappLink(sendMessage())"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95"
            >
              <svg class="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"
                />
              </svg>
              Envoyer par WhatsApp
            </a>
          </div>
        </div>

        @if (needsReminder()) {
          <div
            class="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-5 py-4"
          >
            <p class="text-sm text-violet-900">
              <span class="font-semibold">{{
                invoice()!.status === 'OVERDUE'
                  ? 'Facture en retard.'
                  : 'Facture envoyée, en attente de paiement.'
              }}</span>
              Un message de relance poli est déjà rédigé.
            </p>
            <a
              [href]="whatsappLink(reminderMessage())"
              target="_blank"
              rel="noopener"
              class="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Relancer par WhatsApp
            </a>
          </div>
        }

        <!-- La facture -->
        <article
          class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12 print:border-0 print:p-0 print:shadow-none"
        >
          <header
            class="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-8"
          >
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Facture
              </p>
              <h1 class="mt-2 text-3xl font-extrabold text-slate-950">{{ invoice()!.number }}</h1>
              <span
                class="no-print mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-bold"
                [class]="statusClass(invoice()!.status)"
                >{{ statusLabel(invoice()!.status) }}</span
              >
            </div>
            <div class="text-right text-sm text-slate-600">
              <p class="font-bold text-slate-950">{{ issuerName() }}</p>
              <p>Freelance</p>
              <p>{{ auth.user()?.email }}</p>
            </div>
          </header>

          <section class="grid gap-6 py-8 sm:grid-cols-2">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Facturé à</p>
              <p class="mt-2 font-bold text-slate-950">{{ client()?.company || client()?.name }}</p>
              @if (client()?.company) {
                <p class="text-sm text-slate-600">{{ client()?.name }}</p>
              }
              <p class="text-sm text-slate-600">{{ client()?.email }}</p>
              @if (client()?.phone) {
                <p class="text-sm text-slate-600">{{ client()?.phone }}</p>
              }
            </div>
            <dl class="grid grid-cols-2 gap-y-2 text-sm sm:text-right">
              <dt class="text-slate-400">Émise le</dt>
              <dd class="font-medium text-slate-800">
                {{ invoice()!.createdAt | date: 'd MMMM y' }}
              </dd>
              <dt class="text-slate-400">À régler avant le</dt>
              <dd class="font-medium text-slate-800">
                {{ invoice()!.dueDate | date: 'd MMMM y' }}
              </dd>
              <dt class="text-slate-400">Devise</dt>
              <dd class="font-medium text-slate-800">
                {{ project()!.currency === 'XOF' ? 'Franc CFA (XOF)' : 'Euro (EUR)' }}
              </dd>
            </dl>
          </section>

          <table class="w-full text-left text-sm">
            <thead class="border-y border-slate-200 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th class="py-3">Désignation</th>
                <th class="py-3 text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-100">
                <td class="py-4 pr-6">
                  <p class="font-semibold text-slate-900">{{ project()!.title }}</p>
                  @if (project()!.description) {
                    <p class="mt-1 text-slate-500">{{ project()!.description }}</p>
                  }
                </td>
                <td class="py-4 text-right font-semibold text-slate-900">
                  {{ invoice()!.amount | money: project()!.currency }}
                </td>
              </tr>
            </tbody>
          </table>

          <div class="mt-6 flex justify-end">
            <div
              class="w-full max-w-xs rounded-xl bg-slate-950 px-5 py-4 text-white print:bg-white print:text-slate-950 print:ring-1 print:ring-slate-300"
            >
              <p class="text-xs uppercase tracking-wide text-slate-400">Total à payer</p>
              <p class="mt-1 text-2xl font-extrabold">
                {{ invoice()!.amount | money: project()!.currency }}
              </p>
            </div>
          </div>

          <section
            class="mt-10 rounded-xl border border-indigo-100 bg-indigo-50 p-5 print:bg-white"
          >
            <p class="text-sm font-bold text-indigo-900">Moyens de paiement acceptés</p>
            <div class="mt-3 flex flex-wrap gap-2">
              @for (method of paymentMethods(); track method) {
                <span
                  class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                  >{{ method }}</span
                >
              }
            </div>
            <p class="mt-3 text-sm text-indigo-900/80">
              Merci d'indiquer la référence
              <span class="font-semibold">{{ invoice()!.number }}</span> lors du paiement.
              Coordonnées de paiement envoyées sur simple demande à {{ auth.user()?.email }}.
            </p>
          </section>

          <p class="mt-10 text-center text-xs text-slate-400">Facture établie avec FreelanceHub</p>
        </article>
      </div>
    }
  `,
})
export class InvoiceDocumentComponent implements OnInit {
  private readonly invoicesService = inject(InvoicesService);
  private readonly projectsService = inject(ProjectsService);
  private readonly clientsService = inject(ClientsService);
  protected readonly auth = inject(AuthService);

  /** Paramètre de route :id */
  readonly id = input.required<string>();

  protected readonly loading = signal(true);
  protected readonly invoice = signal<Invoice | null>(null);
  protected readonly project = signal<Project | null>(null);
  protected readonly client = signal<Client | null>(null);

  protected readonly issuerName = computed(() => {
    const user = this.auth.user();
    return user ? `${user.firstName} ${user.lastName}` : 'Freelance';
  });

  protected readonly paymentMethods = computed(
    () => PAYMENT_METHODS[this.project()?.currency ?? 'XOF'],
  );

  protected readonly needsReminder = computed(() => {
    const status = this.invoice()?.status;
    return status === 'SENT' || status === 'OVERDUE';
  });

  private readonly amountText = computed(() => {
    const invoice = this.invoice();
    return invoice ? formatMoney(invoice.amount, this.project()?.currency) : '';
  });

  private readonly dueDateText = computed(() => {
    const invoice = this.invoice();
    return invoice
      ? new Date(invoice.dueDate).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '';
  });

  protected readonly sendMessage = computed(() => {
    const invoice = this.invoice();
    if (!invoice) return '';
    return [
      `Bonjour ${this.client()?.name ?? ''},`,
      `Voici la facture ${invoice.number} pour « ${this.project()?.title} » : ${this.amountText()}, à régler avant le ${this.dueDateText()}.`,
      `Paiement possible par ${this.paymentMethods().join(', ')}.`,
      `Merci pour votre confiance !`,
      this.issuerName(),
    ].join('\n');
  });

  protected readonly reminderMessage = computed(() => {
    const invoice = this.invoice();
    if (!invoice) return '';
    const due =
      invoice.status === 'OVERDUE'
        ? `était à régler le ${this.dueDateText()}`
        : `arrive à échéance le ${this.dueDateText()}`;
    return [
      `Bonjour ${this.client()?.name ?? ''},`,
      `Petit rappel : la facture ${invoice.number} (${this.amountText()}) ${due}.`,
      `Pouvez-vous me confirmer la date de règlement ? Je reste disponible si besoin.`,
      `Merci !`,
      this.issuerName(),
    ].join('\n');
  });

  ngOnInit(): void {
    forkJoin({
      invoices: this.invoicesService.findAll(),
      projects: this.projectsService.findAll(),
      clients: this.clientsService.findAll(),
    }).subscribe({
      next: ({ invoices, projects, clients }) => {
        const invoice = invoices.find((i) => i.id === this.id()) ?? null;
        const project = projects.find((p) => p.id === invoice?.projectId) ?? null;
        this.invoice.set(invoice);
        this.project.set(project);
        this.client.set(clients.find((c) => c.id === project?.clientId) ?? null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected print(): void {
    window.print();
  }

  /** wa.me avec le numéro du client s'il est renseigné, sinon WhatsApp demande le contact */
  protected whatsappLink(message: string): string {
    const phone = (this.client()?.phone ?? '').replace(/\D/g, '');
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  protected emailLink(): string {
    const subject = `Facture ${this.invoice()?.number ?? ''}`;
    return `mailto:${this.client()?.email ?? ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(this.sendMessage())}`;
  }

  protected statusLabel(status: InvoiceStatus): string {
    return { DRAFT: 'Brouillon', SENT: 'Envoyée', PAID: 'Payée', OVERDUE: 'En retard' }[status];
  }

  protected statusClass(status: InvoiceStatus): string {
    return {
      DRAFT: 'bg-slate-100 text-slate-700',
      SENT: 'bg-indigo-100 text-indigo-700',
      PAID: 'bg-emerald-100 text-emerald-700',
      OVERDUE: 'bg-rose-100 text-rose-700',
    }[status];
  }
}
