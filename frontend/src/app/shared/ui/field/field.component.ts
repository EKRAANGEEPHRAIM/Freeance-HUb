import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-field',
  standalone: true,
  template: `
    <label class="block">
      @if (label()) {
        <span class="mb-2 block text-sm font-semibold text-slate-700">
          {{ label() }}
          @if (hint()) {
            <span class="font-normal text-slate-400">({{ hint() }})</span>
          }
        </span>
      }
      <ng-content />
      @if (error()) {
        <span class="mt-1 block text-xs text-rose-600">{{ error() }}</span>
      }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block' },
})
export class FieldComponent {
  readonly label = input('');
  readonly hint = input('');
  readonly error = input('');
}
