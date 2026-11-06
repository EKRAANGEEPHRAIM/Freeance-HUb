import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <article class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      @if (title() || icon()) {
        <header
          class="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6"
        >
          <div class="flex items-center gap-3">
            @if (icon()) {
              <span
                class="grid size-9 place-items-center rounded-xl"
                [class]="iconContainerClass()"
              >
                <ng-content select="[card-icon]" />
              </span>
            }
            <div>
              @if (title()) {
                <h3 class="font-bold text-slate-950">{{ title() }}</h3>
              }
              @if (subtitle()) {
                <p class="mt-0.5 text-sm text-slate-500">{{ subtitle() }}</p>
              }
            </div>
          </div>
          <ng-content select="[card-actions]" />
        </header>
      }
      <div class="p-5 sm:p-6">
        <ng-content />
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    class: 'block',
  },
})
export class CardComponent {
  readonly title = input('');
  readonly subtitle = input('');
  readonly icon = input(false);
  readonly iconContainerClass = input('bg-indigo-50 text-indigo-600');
}
