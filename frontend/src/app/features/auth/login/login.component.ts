import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="grid min-h-dvh lg:grid-cols-2">
      <section class="flex items-center justify-center bg-slate-50 px-5 py-12 sm:px-8">
        <div class="w-full max-w-md">
          <a routerLink="/auth/login" class="mb-12 inline-flex items-center gap-3">
            <span class="grid size-10 place-items-center rounded-xl bg-indigo-600 text-lg font-black text-white">F</span>
            <span class="text-xl font-bold tracking-tight text-slate-950">FreelanceHub</span>
          </a>

          <div>
            <p class="text-sm font-semibold text-indigo-600">Content de te revoir</p>
            <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-950">Connecte-toi à ton espace</h1>
            <p class="mt-3 text-sm leading-6 text-slate-500">Retrouve tes clients, projets et factures en quelques secondes.</p>
          </div>

          @if (errorMessage()) {
            <div class="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{{ errorMessage() }}</div>
          }

          <form class="mt-8 space-y-5" [formGroup]="form" (ngSubmit)="submit()">
            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-slate-700">Adresse e-mail</span>
              <input class="w-full rounded-xl border bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-4" [class.border-rose-400]="showError('email')" [class.border-slate-200]="!showError('email')" [class.focus:border-indigo-500]="!showError('email')" [class.focus:ring-indigo-100]="!showError('email')" type="email" autocomplete="email" placeholder="vous@exemple.com" formControlName="email" />
              @if (showError('email')) { <span class="mt-1.5 block text-xs font-medium text-rose-600">Saisis une adresse e-mail valide.</span> }
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-slate-700">Mot de passe</span>
              <input class="w-full rounded-xl border bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" [class.border-rose-400]="showError('password')" [class.border-slate-200]="!showError('password')" type="password" autocomplete="current-password" placeholder="Votre mot de passe" formControlName="password" />
              @if (showError('password')) { <span class="mt-1.5 block text-xs font-medium text-rose-600">Le mot de passe est requis.</span> }
            </label>

            <button class="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60" type="submit" [disabled]="isSubmitting()">
              @if (isSubmitting()) { Connexion en cours... } @else { Se connecter }
            </button>
          </form>

          <p class="mt-8 text-center text-sm text-slate-500">Pas encore de compte ? <a routerLink="/auth/register" class="font-semibold text-indigo-600 hover:text-indigo-700">Créer un compte</a></p>
        </div>
      </section>

      <section class="relative hidden overflow-hidden bg-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">
        <div class="absolute -right-20 -top-20 size-96 rounded-full bg-indigo-600/30 blur-3xl"></div>
        <div class="absolute -bottom-28 left-10 size-80 rounded-full bg-violet-600/20 blur-3xl"></div>
        <div class="relative max-w-md">
          <span class="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-200">L'outil des indépendants organisés</span>
          <h2 class="mt-7 text-5xl font-bold tracking-tight text-white">Garde le contrôle sur ton activité.</h2>
          <p class="mt-6 text-lg leading-8 text-slate-300">Centralise les relations clients, les projets et tes factures dans un espace clair.</p>
        </div>
        <div class="relative rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <p class="text-sm leading-6 text-slate-200">“FreelanceHub m’aide à visualiser en un instant ce qui reste à faire et ce qui arrive à échéance.”</p>
          <p class="mt-4 text-sm font-bold text-white">Sofia Martin</p>
          <p class="mt-1 text-xs text-slate-400">Designer indépendante</p>
        </div>
      </section>
    </main>
  `,
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected showError(controlName: 'email' | 'password'): boolean {
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
    this.authService.login(this.form.getRawValue()).subscribe({
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
      : 'La connexion a échoué. Vérifie tes identifiants.';
  }
}
