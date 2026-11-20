import { Component, inject, input, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BrandComponent } from '../../../shared/ui/brand/brand.component';
import { InvoiceSheetComponent } from '../../../shared/ui/invoice-sheet/invoice-sheet.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, BrandComponent, InvoiceSheetComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <main class="grid min-h-dvh lg:grid-cols-2">
      <section class="flex items-center justify-center bg-slate-50 px-5 py-12 sm:px-8">
        <div class="w-full max-w-md">
          <a routerLink="/" class="mb-14 inline-block" aria-label="Réglo, accueil"><app-brand [size]="28" /></a>

          <div>
            <p class="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">Connexion</p>
            <h1 class="mt-4 text-4xl font-medium text-slate-950">
              Bon retour dans votre registre.
            </h1>
            <p class="mt-3 text-sm leading-6 text-slate-500">
              Vos clients, projets et factures vous attendent.
            </p>
          </div>

          @if (errorMessage()) {
            <div
              class="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {{ errorMessage() }}
            </div>
          }

          <form class="mt-8 space-y-5" [formGroup]="form" (ngSubmit)="submit()">
            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-slate-700">Adresse e-mail</span>
              <input
                class="w-full rounded-xl border bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-4"
                [class.border-rose-400]="showError('email')"
                [class.border-slate-200]="!showError('email')"
                [class.focus:border-indigo-500]="!showError('email')"
                [class.focus:ring-indigo-100]="!showError('email')"
                type="email"
                autocomplete="email"
                placeholder="vous@exemple.com"
                formControlName="email"
              />
              @if (showError('email')) {
                <span class="mt-1.5 block text-xs font-medium text-rose-600"
                  >Saisissez une adresse e-mail valide.</span
                >
              }
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-slate-700">Mot de passe</span>
              <div class="relative">
                <input
                  class="w-full rounded-xl border bg-white px-4 py-3 pr-11 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  [class.border-rose-400]="showError('password')"
                  [class.border-slate-200]="!showError('password')"
                  [type]="showPassword() ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Votre mot de passe"
                  formControlName="password"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  (click)="togglePassword()"
                  [attr.aria-label]="
                    showPassword() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                  "
                >
                  @if (showPassword()) {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  } @else {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  }
                </button>
              </div>
              @if (showError('password')) {
                <span class="mt-1.5 block text-xs font-medium text-rose-600"
                  >Le mot de passe est requis.</span
                >
              }
            </label>

            <button
              class="flex w-full items-center justify-center rounded-md bg-indigo-800 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-indigo-900 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              [disabled]="isSubmitting()"
            >
              @if (isSubmitting()) {
                Connexion en cours...
              } @else {
                Se connecter
              }
            </button>
          </form>

          <div
            class="mt-8 border-t border-slate-300 pt-6 text-sm text-slate-700"
          >
            <p class="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Vous visitez la démo ?</p>
            <p class="mt-2 text-slate-600">
              Un compte rempli de clients, projets et factures fictifs vous attend.
            </p>
            <button
              type="button"
              class="mt-3 font-medium text-slate-950 underline decoration-slate-400 underline-offset-[6px] hover:decoration-slate-950"
              (click)="fillDemo()"
            >
              Utiliser le compte de démonstration
            </button>
          </div>

          <p class="mt-8 text-center text-sm text-slate-500">
            Pas encore de compte ?
            <a
              routerLink="/auth/register"
              class="font-medium text-slate-950 underline decoration-slate-400 underline-offset-4 hover:decoration-slate-950"
              >Créer un compte</a
            >
          </p>
        </div>
      </section>

      <section class="relative hidden border-l border-slate-300/70 bg-slate-100/70 px-12 py-14 lg:flex lg:flex-col lg:justify-center">
        <div class="mx-auto w-full max-w-md">
          <app-invoice-sheet />
          <p class="mt-14 font-display text-2xl leading-snug text-slate-900">
            « Une facture claire, c'est déjà <em class="text-violet-600">la moitié du paiement</em>. »
          </p>
          <p class="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Exemple · facture réglée par Wave</p>
        </div>
      </section>
    </main>
  `,
})
export class LoginComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly showPassword = signal(false);
  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  /** ?demo=1 (bouton « Essayer la démo » de la page d'accueil) : connexion directe au compte démo */
  readonly demo = input<string>();

  ngOnInit(): void {
    if (this.demo()) this.fillDemo();
  }

  /** Compte public créé par le seed du backend (prisma/seed.ts) */
  protected fillDemo(): void {
    this.form.setValue({ email: 'demo@reglo.app', password: 'Demo2026!' });
    this.submit();
  }

  protected togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

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
      : 'La connexion a échoué. Vérifiez vos identifiants.';
  }
}
