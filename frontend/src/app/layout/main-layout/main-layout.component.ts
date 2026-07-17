import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [HeaderComponent, RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-dvh bg-slate-50 lg:flex">
      @if (sidebarOpen()) {
        <button class="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" type="button" aria-label="Fermer le menu" (click)="sidebarOpen.set(false)"></button>
      }
      <app-sidebar [open]="sidebarOpen()" (closed)="sidebarOpen.set(false)" />
      <div class="min-w-0 flex-1">
        <app-header (menuRequested)="sidebarOpen.set(true)" />
        <main class="mx-auto w-full max-w-7xl p-5 sm:p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class MainLayoutComponent {
  protected readonly sidebarOpen = signal(false);
}
