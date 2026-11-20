import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BrandComponent } from '../../../shared/ui/brand/brand.component';
import { InvoiceSheetComponent } from '../../../shared/ui/invoice-sheet/invoice-sheet.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, BrandComponent, InvoiceSheetComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <main class="grid min-h-dvh lg:grid-cols-2">
      <section class="flex items-center justify-center bg-slate-50 px-5 py-12 sm:px-8">
        <div class="w-full max-w-md">
          <a routerLink="/" class="mb-14 inline-block" aria-label="Réglo, accueil"><app-brand [size]="28" /></a>

          <div>
            <p class="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">Inscription · gratuite</p>
            <h1 class="mt-4 text-4xl font-medium text-slate-950">
              Ouvrez votre registre.
            </h1>
            <p class="mt-3 text-sm leading-6 text-slate-500">
              Quelques secondes, et votre première facture est prête.
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
                  placeholder="Aya"
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
                  placeholder="Kouassi"
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
                  >Saisissez une adresse e-mail valide.</span
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
              class="flex w-full items-center justify-center rounded-md bg-indigo-800 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-indigo-900 disabled:cursor-not-allowed disabled:opacity-60"
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
            <a routerLink="/auth/login" class="font-medium text-slate-950 underline decoration-slate-400 underline-offset-4 hover:decoration-slate-950"
              >Se connecter</a
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
          <p class="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Ce que vos clients recevront</p>
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
