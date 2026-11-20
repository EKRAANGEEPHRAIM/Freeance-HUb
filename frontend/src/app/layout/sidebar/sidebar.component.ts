import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { navigationItems } from '../../core/constants/navigation';
import { BrandComponent } from '../../shared/ui/brand/brand.component';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, BrandComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-300/70 bg-slate-100 px-4 py-6 shadow-xl transition-transform duration-300 lg:static lg:h-dvh lg:translate-x-0 lg:shadow-none"
      [class.-translate-x-full]="!open"
      [class.translate-x-0]="open"
    >
      <div class="flex items-center justify-between px-2">
        <a routerLink="/dashboard" aria-label="Réglo, tableau de bord" (click)="closed.emit()"><app-brand [size]="26" /></a>
        <button
          class="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          type="button"
          aria-label="Fermer le menu"
          (click)="closed.emit()"
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <p class="mt-10 px-3 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Registre</p>
      <nav class="mt-3 flex-1 space-y-0.5" aria-label="Navigation principale">
        @for (item of navigationItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="!border-violet-500 bg-white !text-slate-950 shadow-sm"
            class="group flex items-center gap-3 rounded-r-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-white/60 hover:text-slate-950"
            (click)="closed.emit()"
          >
            @switch (item.icon) {
              @case ('grid') {
                <svg
                  class="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              }
              @case ('users') {
                <svg
                  class="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
              @case ('folder') {
                <svg
                  class="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                >
                  <path
                    d="M3 6a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"
                  />
                </svg>
              }
              @case ('receipt') {
                <svg
                  class="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                >
                  <path d="M4 3v18l3-2 3 2 3-2 3 2 3-2V3l-3 2-3-2-3 2-3-2-3 2-3-2Z" />
                  <path d="M8 9h8M8 13h8" />
                </svg>
              }
              @case ('note') {
                <svg
                  class="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                  <path d="M14 2v6h6M8 13h8M8 17h6" />
                </svg>
              }
            }
            {{ item.label }}
          </a>
        }
      </nav>

      <div class="border-t border-slate-300 px-3 pt-5">
        <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">Taux fixe</p>
        <p class="mt-1.5 font-mono text-sm text-slate-800">1 € = 655,957 FCFA</p>
        <p class="mt-1 text-xs leading-5 text-slate-500">Chaque projet garde sa devise ; les totaux sont convertis.</p>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  @Input() open = false;
  @Output() readonly closed = new EventEmitter<void>();

  protected readonly navigationItems = navigationItems;
}
