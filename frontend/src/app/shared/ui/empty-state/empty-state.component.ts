import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="grid min-h-72 place-items-center p-8 text-center">
      <div class="max-w-sm">
        <span
          class="mx-auto grid size-14 place-items-center rounded-2xl"
          [class]="iconContainerClass()"
        >
          <ng-content select="[empty-icon]" />
        </span>
        <h3 class="mt-5 text-lg font-bold text-slate-950">{{ title() }}</h3>
        @if (description()) {
          <p class="mt-2 text-sm leading-6 text-slate-500">{{ description() }}</p>
        }
        <div class="mt-5">
          <ng-content select="[empty-action]" />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block' },
})
export class EmptyStateComponent {
  readonly title = input('');
  readonly description = input('');
  readonly iconContainerClass = input('bg-indigo-50 text-indigo-600');
}
