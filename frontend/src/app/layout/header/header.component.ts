import { Component, EventEmitter, inject, Output, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <header
      class="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8"
    >
      <div class="flex items-center gap-3">
        <button
          class="grid size-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
          type="button"
          aria-label="Ouvrir le menu"
          (click)="menuRequested.emit()"
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <p class="text-xs font-medium text-slate-500">Bienvenue</p>
          <h1 class="text-lg font-bold text-slate-950">{{ userName }}</h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-3 rounded-xl p-1.5 pr-3 transition hover:bg-slate-50"
          type="button"
          (click)="logout()"
        >
          <span
            class="grid size-9 place-items-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700"
            >{{ initials }}</span
          >
          <span class="hidden text-left sm:block">
            <span class="block text-sm font-semibold text-slate-800">{{ userName }}</span>
            <span class="block text-xs text-slate-500">Déconnexion</span>
          </span>
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  @Output() readonly menuRequested = new EventEmitter<void>();

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  get userName(): string {
    const user = this.authService.user();
    return user ? `${user.firstName} ${user.lastName}` : 'Freelance';
  }

  get initials(): string {
    return this.userName
      .split(' ')
      .map((name) => name.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/auth/login']);
  }
}
