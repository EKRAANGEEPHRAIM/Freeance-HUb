import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BrandComponent } from '../../shared/ui/brand/brand.component';
import { InvoiceSheetComponent } from '../../shared/ui/invoice-sheet/invoice-sheet.component';

/** Page publique de présentation de Réglo, avant la connexion */
@Component({
  selector: 'app-landing',
  imports: [RouterLink, BrandComponent, InvoiceSheetComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="min-h-dvh bg-slate-50 text-slate-900">
      <!-- Navigation -->
      <header class="border-b border-slate-300/70">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <a routerLink="/" aria-label="Réglo, accueil"><app-brand [size]="26" /></a>
          <nav class="flex items-center gap-1 text-sm sm:gap-2">
            <a href="#pourquoi" class="hidden px-3 py-2 text-slate-600 hover:text-slate-950 md:block"
              >Pourquoi Réglo</a
            >
            <a href="#releve" class="hidden px-3 py-2 text-slate-600 hover:text-slate-950 md:block"
              >Tableau de bord</a
            >
            @if (auth.isAuthenticated()) {
              <a
                routerLink="/dashboard"
                class="ml-2 rounded-md bg-indigo-800 px-4 py-2.5 font-medium text-white hover:bg-indigo-900"
                >Mon espace</a
              >
            } @else {
              <a routerLink="/auth/login" class="px-3 py-2 text-slate-600 hover:text-slate-950"
                >Connexion</a
              >
              <a
                routerLink="/auth/register"
                class="ml-1 rounded-md bg-indigo-800 px-4 py-2.5 font-medium text-white hover:bg-indigo-900"
                >Créer un compte</a
              >
            }
          </nav>
        </div>
      </header>

      <!-- Accroche -->
      <section class="mx-auto grid max-w-6xl gap-16 px-5 pb-20 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
        <div class="lg:pt-6">
          <p class="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
            Facturation · FCFA &amp; euros · Afrique francophone
          </p>
          <h1
            class="mt-7 text-[2.75rem] font-medium leading-[1.02] text-slate-950 sm:text-7xl"
          >
            Facturez ce soir.<br />
            <em class="font-normal text-violet-600">Encaissez</em> cette semaine.
          </h1>
          <p class="mt-8 max-w-xl text-lg leading-8 text-slate-600">
            Réglo tient le registre des indépendants : vos clients, vos projets et des factures
            propres en FCFA ou en euros, envoyées par WhatsApp et payables par Mobile Money. Quand
            un paiement traîne, la relance est déjà écrite.
          </p>
          <div class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              routerLink="/auth/login"
              [queryParams]="{ demo: 1 }"
              class="rounded-md bg-indigo-800 px-6 py-3.5 text-sm font-medium text-white hover:bg-indigo-900"
              >Ouvrir la démo &rarr;</a
            >
            <a
              routerLink="/auth/register"
              class="text-sm font-medium text-slate-900 underline decoration-slate-400 underline-offset-[6px] hover:decoration-slate-900"
              >Créer mon compte gratuitement</a
            >
          </div>
          <p class="mt-6 font-mono text-xs text-slate-500">
            Compte de démonstration rempli · aucune inscription
          </p>
        </div>

        <div class="mx-auto w-full max-w-md lg:mt-4">
          <app-invoice-sheet />
          <p class="mt-10 text-center font-mono text-xs text-slate-500">
            Envoyée par WhatsApp le 12.11 · réglée par Wave le 18.11
          </p>
        </div>
      </section>

      <!-- Moyens de paiement -->
      <div class="border-y border-slate-300/70 bg-slate-100/60">
        <div
          class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-5 py-5 font-mono text-xs uppercase tracking-[0.18em] text-slate-600"
        >
          <span class="text-slate-400">Vos clients règlent par</span>
          @for (method of methods; track method) {
            <span>{{ method }}</span>
          }
        </div>
      </div>

      <!-- Pourquoi Réglo -->
      <section id="pourquoi" class="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <div class="lg:sticky lg:top-10 lg:self-start">
          <p class="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">Pourquoi Réglo</p>
          <h2 class="mt-5 text-4xl font-medium leading-tight text-slate-950">
            Pensé pour la façon dont on vous paie <em class="font-normal">vraiment</em>.
          </h2>
          <p class="mt-5 max-w-sm leading-7 text-slate-600">
            Les logiciels de facturation européens ignorent le FCFA, WhatsApp et le Mobile Money.
            C'est pourtant votre quotidien.
          </p>
        </div>

        <ol class="border-t border-slate-950">
          @for (reason of reasons; track reason.title; let i = $index) {
            <li class="grid gap-3 border-b border-slate-300 py-8 sm:grid-cols-[4rem_1fr]">
              <span class="font-mono text-sm text-violet-600">{{ letters[i] }}.</span>
              <div>
                <h3 class="text-2xl font-medium text-slate-950">{{ reason.title }}</h3>
                <p class="mt-3 max-w-xl leading-7 text-slate-600">{{ reason.text }}</p>
              </div>
            </li>
          }
        </ol>
      </section>

      <!-- Relevé : le tableau de bord -->
      <section id="releve" class="border-t border-slate-300/70 bg-white">
        <div class="mx-auto max-w-6xl px-5 py-24">
          <div class="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p class="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                Relevé · novembre 2026
              </p>
              <h2 class="mt-5 max-w-2xl text-4xl font-medium leading-tight text-slate-950">
                Votre mois, lu comme un relevé de compte.
              </h2>
            </div>
            <p class="max-w-sm leading-7 text-slate-600">
              Ce qui est encaissé, ce qui reste à venir, ce qui est en retard. Les montants en euros
              sont convertis au taux fixe 1&nbsp;€ = 655,957&nbsp;FCFA.
            </p>
          </div>

          <dl class="mt-14 grid border-t border-slate-950 sm:grid-cols-3">
            @for (figure of figures; track figure.label) {
              <div class="border-b border-slate-300 py-7 sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0">
                <dt class="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                  {{ figure.label }}
                </dt>
                <dd class="mt-4 font-mono text-3xl font-medium" [class]="figure.tone">
                  {{ figure.value }}
                </dd>
                <dd class="mt-2 text-sm text-slate-500">{{ figure.note }}</dd>
              </div>
            }
          </dl>
        </div>
      </section>

      <!-- Conclusion -->
      <section class="border-t border-slate-300/70">
        <div class="mx-auto max-w-4xl px-5 py-24 text-center">
          <h2 class="text-4xl font-medium leading-tight text-slate-950 sm:text-5xl">
            Une facture claire, c'est déjà<br class="hidden sm:block" />
            <em class="font-normal text-violet-600">la moitié du paiement</em>.
          </h2>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <a
              routerLink="/auth/login"
              [queryParams]="{ demo: 1 }"
              class="rounded-md bg-indigo-800 px-6 py-3.5 text-sm font-medium text-white hover:bg-indigo-900"
              >Ouvrir la démo &rarr;</a
            >
            <a
              routerLink="/auth/register"
              class="text-sm font-medium text-slate-900 underline decoration-slate-400 underline-offset-[6px] hover:decoration-slate-900"
              >Créer mon compte</a
            >
          </div>
        </div>
      </section>

      <footer class="border-t border-slate-300/70">
        <div
          class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-slate-500"
        >
          <app-brand [size]="18" />
          <p>
            Projet de démonstration conçu et développé par Ange Ephraïm Ekra · Angular, NestJS,
            PostgreSQL
          </p>
        </div>
      </footer>
    </div>
  `,
})
export class LandingComponent {
  protected readonly auth = inject(AuthService);

  protected readonly methods = ['Orange Money', 'MTN MoMo', 'Wave', 'Virement', 'Espèces'];

  protected readonly letters = ['A', 'B', 'C', 'D'];

  protected readonly reasons = [
    {
      title: 'Le FCFA et l’euro, côte à côte',
      text: 'Chaque projet garde sa devise : un client à Abidjan en FCFA, un autre à Paris en euros. Vos totaux restent justes, sans tableur à côté.',
    },
    {
      title: 'La facture part sur WhatsApp',
      text: 'Un message poli et la facture sont prêts. Un clic, et votre client la reçoit là où il lit vraiment ses messages.',
    },
    {
      title: 'Le Mobile Money sur la facture',
      text: 'Orange Money, MTN MoMo, Wave ou virement : vos coordonnées de paiement apparaissent sur le document. Votre client n’a plus d’excuse.',
    },
    {
      title: 'Des relances sans gêne',
      text: 'Les factures en retard remontent en premier, avec une relance courtoise déjà rédigée. Vous restez professionnel, et vous êtes payé.',
    },
  ];

  protected readonly figures = [
    {
      label: 'Encaissé',
      value: '1 850 000',
      note: 'FCFA · 4 factures réglées',
      tone: 'text-slate-950',
    },
    {
      label: 'À encaisser',
      value: '1 200,00 €',
      note: '≈ 787 148 FCFA · Studio Lumière, Paris',
      tone: 'text-indigo-700',
    },
    {
      label: 'En retard',
      value: '450 000',
      note: 'FCFA · Boutique Adjoua, échue le 2.11',
      tone: 'text-violet-600',
    },
  ];
}
