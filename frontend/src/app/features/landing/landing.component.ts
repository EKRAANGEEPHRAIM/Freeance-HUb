import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/** Page publique de présentation du produit, avant la connexion */
@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="min-h-dvh bg-white text-slate-900">
      <!-- Navigation -->
      <header class="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a routerLink="/" class="flex items-center gap-2.5">
            <span
              class="relative grid size-9 place-items-center rounded-xl bg-indigo-700 font-display text-base font-extrabold text-white"
              >F<span
                class="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-violet-500 ring-2 ring-white"
              ></span
            ></span>
            <span class="font-display text-lg font-extrabold tracking-tight">FreelanceHub</span>
          </a>
          <nav class="flex items-center gap-2 text-sm font-semibold">
            <a
              href="#fonctionnalites"
              class="hidden rounded-lg px-3 py-2 text-slate-600 hover:text-slate-950 sm:block"
              >Fonctionnalités</a
            >
            @if (auth.isAuthenticated()) {
              <a
                routerLink="/dashboard"
                class="rounded-xl bg-indigo-700 px-4 py-2.5 text-white hover:bg-indigo-800"
                >Mon espace</a
              >
            } @else {
              <a
                routerLink="/auth/login"
                class="rounded-lg px-3 py-2 text-slate-600 hover:text-slate-950"
                >Connexion</a
              >
              <a
                routerLink="/auth/register"
                class="rounded-xl bg-indigo-700 px-4 py-2.5 text-white hover:bg-indigo-800"
                >Créer un compte</a
              >
            }
          </nav>
        </div>
      </header>

      <!-- Accroche -->
      <section class="relative overflow-hidden">
        <div
          class="absolute -right-32 -top-32 size-[28rem] rounded-full bg-violet-100 blur-3xl"
        ></div>
        <div
          class="absolute -bottom-40 -left-24 size-[26rem] rounded-full bg-indigo-100 blur-3xl"
        ></div>
        <div
          class="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24"
        >
          <div>
            <span
              class="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800"
            >
              <span class="size-1.5 rounded-full bg-violet-500"></span> Pour les freelances
              d'Afrique francophone
            </span>
            <h1
              class="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl"
            >
              Vos factures payées,<br />
              <span class="text-indigo-700">en FCFA</span> comme
              <span class="text-violet-600">en euros</span>.
            </h1>
            <p class="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              Clients, projets et factures au même endroit. Envoyez une facture par WhatsApp en un
              clic, faites-vous payer par Orange Money ou Wave, et relancez sans gêne quand ça
              traîne.
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a
                routerLink="/auth/login"
                [queryParams]="{ demo: 1 }"
                class="rounded-xl bg-indigo-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-700/25 hover:bg-indigo-800"
                >Essayer la démo</a
              >
              <a
                routerLink="/auth/register"
                class="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50"
                >Créer un compte gratuit</a
              >
            </div>
            <p class="mt-4 text-sm text-slate-500">
              Démo prête : clients, projets et factures fictifs, sans inscription.
            </p>
          </div>

          <!-- Aperçu du produit -->
          <div class="relative">
            <div
              class="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10"
            >
              <div class="flex items-center justify-between">
                <p class="text-sm font-bold text-slate-950">Factures à suivre</p>
                <span
                  class="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-700"
                  >1 en retard</span
                >
              </div>
              <div class="mt-4 space-y-3">
                <div
                  class="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
                >
                  <div>
                    <p class="text-sm font-bold">FAC-2026-014</p>
                    <p class="text-xs text-slate-500">Boutique Adjoua · échue le 2 nov.</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-extrabold">450 000 FCFA</p>
                    <p class="text-xs font-semibold text-violet-700">Relancer ›</p>
                  </div>
                </div>
                <div
                  class="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
                >
                  <div>
                    <p class="text-sm font-bold">FAC-2026-015</p>
                    <p class="text-xs text-slate-500">Studio Lumière (Paris) · 20 nov.</p>
                  </div>
                  <p class="text-sm font-extrabold">1 200,00 €</p>
                </div>
                <div
                  class="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
                >
                  <div>
                    <p class="text-sm font-bold">FAC-2026-013</p>
                    <p class="text-xs text-slate-500">École Les Palmiers · payée</p>
                  </div>
                  <p class="text-sm font-extrabold text-indigo-700">700 000 FCFA ✓</p>
                </div>
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                @for (method of methods; track method) {
                  <span
                    class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                    >{{ method }}</span
                  >
                }
              </div>
            </div>
            <div
              class="absolute -bottom-6 -left-4 hidden rounded-2xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-xl sm:block"
            >
              Facture envoyée sur WhatsApp ✓
            </div>
          </div>
        </div>
      </section>

      <!-- Fonctionnalités -->
      <section id="fonctionnalites" class="bg-slate-50 py-20">
        <div class="mx-auto max-w-6xl px-5">
          <div class="max-w-2xl">
            <p class="text-sm font-bold uppercase tracking-widest text-indigo-700">
              Pensé pour votre réalité
            </p>
            <h2
              class="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
            >
              Ce que les outils européens ne font pas
            </h2>
          </div>
          <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            @for (feature of features; track feature.title) {
              <article class="rounded-2xl border border-slate-200 bg-white p-6">
                <span
                  class="grid size-11 place-items-center rounded-xl text-lg font-extrabold"
                  [class]="feature.badge"
                  >{{ feature.icon }}</span
                >
                <h3 class="mt-5 font-bold text-slate-950">{{ feature.title }}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ feature.text }}</p>
              </article>
            }
          </div>
        </div>
      </section>

      <!-- Étapes -->
      <section class="py-20">
        <div class="mx-auto max-w-6xl px-5">
          <h2
            class="text-center font-display text-3xl font-extrabold tracking-tight text-slate-950"
          >
            De la mission au paiement, en 3 étapes
          </h2>
          <ol class="mt-12 grid gap-8 md:grid-cols-3">
            @for (step of steps; track step.title; let i = $index) {
              <li class="relative rounded-2xl border border-slate-200 p-6">
                <span class="font-display text-5xl font-extrabold text-indigo-100"
                  >0{{ i + 1 }}</span
                >
                <h3 class="mt-2 font-bold text-slate-950">{{ step.title }}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ step.text }}</p>
              </li>
            }
          </ol>
        </div>
      </section>

      <!-- Appel à l'action -->
      <section class="px-5 pb-20">
        <div
          class="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-indigo-950 px-8 py-14 text-center text-white sm:px-16"
        >
          <h2 class="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Arrêtez de courir après vos paiements.
          </h2>
          <p class="mx-auto mt-4 max-w-xl text-indigo-200">
            Testez avec le compte de démonstration : tout est déjà rempli, rien à installer.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <a
              routerLink="/auth/login"
              [queryParams]="{ demo: 1 }"
              class="rounded-xl bg-violet-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-violet-600"
              >Essayer la démo</a
            >
            <a
              routerLink="/auth/register"
              class="rounded-xl border border-white/30 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10"
              >Créer mon compte</a
            >
          </div>
        </div>
      </section>

      <footer class="border-t border-slate-100 py-8 text-center text-sm text-slate-500">
        FreelanceHub — projet de démonstration développé par Ange Ephraïm Ekra · Angular, NestJS,
        PostgreSQL
      </footer>
    </div>
  `,
})
export class LandingComponent {
  protected readonly auth = inject(AuthService);

  protected readonly methods = ['Orange Money', 'MTN MoMo', 'Wave', 'Virement'];

  protected readonly features = [
    {
      icon: 'CFA',
      badge: 'bg-indigo-100 text-indigo-800 text-xs',
      title: 'FCFA et euros',
      text: 'Chaque projet a sa devise. Vos totaux sont convertis au taux fixe 1 € = 655,957 FCFA.',
    },
    {
      icon: '✆',
      badge: 'bg-[#25D366]/15 text-[#128C4B]',
      title: 'Envoi par WhatsApp',
      text: 'La facture et un message propre sont prêts : un clic et elle part chez votre client.',
    },
    {
      icon: '₣',
      badge: 'bg-violet-100 text-violet-700',
      title: 'Mobile Money',
      text: 'Orange Money, MTN MoMo, Wave ou virement apparaissent directement sur la facture.',
    },
    {
      icon: '!',
      badge: 'bg-rose-100 text-rose-700',
      title: 'Relances sans gêne',
      text: 'Les retards remontent en premier, avec un message de relance poli déjà rédigé.',
    },
  ];

  protected readonly steps = [
    {
      title: 'Ajoutez vos clients et projets',
      text: 'Un projet = un client, un budget et une devise. Tout reste relié.',
    },
    {
      title: 'Émettez la facture',
      text: 'Imprimez-la en PDF ou envoyez-la par WhatsApp et e-mail en un clic.',
    },
    {
      title: 'Suivez les paiements',
      text: 'Le tableau de bord montre ce qui est encaissé, ce qui reste dû et ce qui est en retard.',
    },
  ];
}
