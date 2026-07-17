import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { navigationItems } from '../../core/constants/navigation';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-xl shadow-slate-900/5 transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none"
      [class.-translate-x-full]="!open"
      [class.translate-x-0]="open"
    >
      <div class="flex items-center justify-between px-2">
        <a routerLink="/dashboard" class="flex items-center gap-3" (click)="closed.emit()">
          <span class="grid size-10 place-items-center rounded-xl bg-indigo-600 text-lg font-black text-white">F</span>
          <span class="text-xl font-bold tracking-tight text-slate-950">FreelanceHub</span>
        </a>
        <button class="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden" type="button" aria-label="Fermer le menu" (click)="closed.emit()">
          <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <nav class="mt-10 flex-1 space-y-1" aria-label="Navigation principale">
        @for (item of navigationItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-indigo-50 text-indigo-700"
            class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            (click)="closed.emit()"
          >
            @switch (item.icon) {
              @case ('grid') { <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> }
              @case ('users') { <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
              @case ('folder') { <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"/></svg> }
              @case ('receipt') { <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 3v18l3-2 3 2 3-2 3 2 3-2V3l-3 2-3-2-3 2-3-2-3 2-3-2Z"/><path d="M8 9h8M8 13h8"/></svg> }
              @case ('note') { <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg> }
            }
            {{ item.label }}
          </a>
        }
      </nav>

      <div class="rounded-2xl bg-slate-950 p-4 text-white">
        <p class="text-sm font-semibold">Besoin d'aide ?</p>
        <p class="mt-1 text-xs leading-5 text-slate-300">Retrouve tes réponses et guides dans notre centre d'aide.</p>
        <button type="button" class="mt-3 text-xs font-semibold text-indigo-300 transition hover:text-white">Consulter le guide</button>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  @Input() open = false;
  @Output() readonly closed = new EventEmitter<void>();

  protected readonly navigationItems = navigationItems;
}
