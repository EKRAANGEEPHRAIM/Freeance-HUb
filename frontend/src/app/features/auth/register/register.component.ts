import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <main class="grid min-h-dvh lg:grid-cols-2">
      <section class="flex items-center justify-center bg-slate-50 px-5 py-12 sm:px-8">
        <div class="w-full max-w-md">
          <a routerLink="/auth/login" class="mb-10 inline-flex items-center gap-3">
            <span
              class="relative grid size-10 place-items-center rounded-xl bg-indigo-700 font-display text-lg font-extrabold text-white"
              >F<span
                class="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-violet-500 ring-2 ring-slate-50"
              ></span
            ></span>
            <span class="font-display text-xl font-extrabold tracking-tight text-slate-950"
              >FreelanceHub</span
            >
          </a>

          <div>
            <p class="text-sm font-semibold text-indigo-600">Première étape</p>
            <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Crée ton espace freelance
            </h1>
            <p class="mt-3 text-sm leading-6 text-slate-500">
              Commence à organiser ton activité gratuitement, dès maintenant.
            </p>
          </div>

          @if (errorMessage()) {
            <div
              class="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {{ errorMessage() }}
            </div>
          }

          <form class="mt-7 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block"
                ><span class="mb-2 block text-sm font-semibold text-slate-700">Prénom</span
                ><input
                  class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  [class.border-rose-400]="showError('firstName')"
                  [class.border-slate-200]="!showError('firstName')"
                  autocomplete="given-name"
                  formControlName="firstName"
                  placeholder="Ada"
                />
                @if (showError('firstName')) {
                  <span class="mt-1 block text-xs text-rose-600">Prénom requis.</span>
                }
              </label>
              <label class="block"
                ><span class="mb-2 block text-sm font-semibold text-slate-700">Nom</span
                ><input
                  class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  [class.border-rose-400]="showError('lastName')"
                  [class.border-slate-200]="!showError('lastName')"
                  autocomplete="family-name"
                  formControlName="lastName"
                  placeholder="Lovelace"
                />
                @if (showError('lastName')) {
                  <span class="mt-1 block text-xs text-rose-600">Nom requis.</span>
                }
              </label>
            </div>
            <label class="block"
              ><span class="mb-2 block text-sm font-semibold text-slate-700">Adresse e-mail</span
              ><input
                class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                [class.border-rose-400]="showError('email')"
                [class.border-slate-200]="!showError('email')"
                type="email"
                autocomplete="email"
                formControlName="email"
                placeholder="vous@exemple.com"
              />
              @if (showError('email')) {
                <span class="mt-1 block text-xs text-rose-600"
                  >Saisis une adresse e-mail valide.</span
                >
              }
            </label>
            <label class="block"
              ><span class="mb-2 block text-sm font-semibold text-slate-700">Mot de passe</span
              ><input
                class="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                [class.border-rose-400]="showError('password')"
                [class.border-slate-200]="!showError('password')"
                type="password"
                autocomplete="new-password"
                formControlName="password"
                placeholder="8 caractères minimum"
              />
              @if (showError('password')) {
                <span class="mt-1 block text-xs text-rose-600">8 caractères minimum.</span>
              }
            </label>
            <button
              class="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              [disabled]="isSubmitting()"
            >
              @if (isSubmitting()) {
                Création en cours...
              } @else {
                Créer mon compte
              }
            </button>
          </form>
          <p class="mt-7 text-center text-sm text-slate-500">
            Déjà inscrit ?
            <a routerLink="/auth/login" class="font-semibold text-indigo-600 hover:text-indigo-700"
              >Se connecter</a
            >
          </p>
        </div>
      </section>

      <section
        class="relative hidden overflow-hidden bg-indigo-700 p-12 lg:flex lg:flex-col lg:justify-between"
      >
        <div class="absolute -left-24 top-10 size-96 rounded-full bg-violet-400/30 blur-3xl"></div>
        <div class="absolute bottom-0 right-0 size-80 rounded-full bg-indigo-950/40 blur-3xl"></div>
        <div class="relative max-w-md">
          <span
            class="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100"
            >Conçu pour les indépendants</span
          >
          <h2 class="mt-7 text-5xl font-bold tracking-tight text-white">
            Plus de clarté, moins d'administratif.
          </h2>
          <p class="mt-6 text-lg leading-8 text-indigo-100">
            Un espace simple pour développer ton activité sans perdre le fil.
          </p>
        </div>
        <div class="relative grid grid-cols-3 gap-3">
          <div class="rounded-2xl bg-white/15 p-4 text-white backdrop-blur">
            <p class="text-2xl font-bold">Clients</p>
            <p class="mt-2 text-sm text-indigo-100">Tous centralisés</p>
          </div>
          <div class="rounded-2xl bg-white/15 p-4 text-white backdrop-blur">
            <p class="text-2xl font-bold">Projets</p>
            <p class="mt-2 text-sm text-indigo-100">Toujours visibles</p>
          </div>
          <div class="rounded-2xl bg-white/15 p-4 text-white backdrop-blur">
            <p class="text-2xl font-bold">Factures</p>
            <p class="mt-2 text-sm text-indigo-100">À portée de main</p>
          </div>
        </div>
      </section>
    </main>
  `,
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected showError(controlName: 'firstName' | 'lastName' | 'email' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => void this.router.navigate(['/dashboard']),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getErrorMessage(error));
        this.isSubmitting.set(false);
      },
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return typeof error.error?.message === 'string'
      ? error.error.message
      : 'La création du compte a échoué. Réessaie dans un instant.';
  }
}
