import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-modal
      [open]="open()"
      [maxWidth]="'sm'"
      [showHeader]="false"
      [showFooter]="false"
      [dismissible]="!loading()"
      (closed)="onCancel()"
    >
      <div class="flex gap-4">
        <span
          class="grid size-11 shrink-0 place-items-center rounded-xl"
          [class]="iconContainerClass()"
        >
          <ng-content select="[confirm-icon]" />
        </span>
        <div>
          <h3 class="text-xl font-bold text-slate-950">{{ title() }}</h3>
          @if (message()) {
            <p class="mt-2 text-sm leading-6 text-slate-500">{{ message() }}</p>
          }
          <ng-content />
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          [disabled]="loading()"
          (click)="onCancel()"
        >
          {{ cancelLabel() }}
        </button>
        <button
          type="button"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60"
          [class]="confirmButtonClass()"
          [disabled]="loading()"
          (click)="onConfirm()"
        >
          <span
            class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            [class.invisible]="!loading()"
          ></span>
          {{ loading() ? loadingLabel() : confirmLabel() }}
        </button>
      </div>
    </app-modal>
  `,
})
export class ConfirmDialogComponent {
  readonly open = input(false);
  readonly title = input('Confirmer');
  readonly message = input('');
  readonly cancelLabel = input('Annuler');
  readonly confirmLabel = input('Confirmer');
  readonly loadingLabel = input('Chargement...');
  readonly loading = input(false);
  readonly danger = input(true);
  readonly iconContainerClass = input('bg-rose-100 text-rose-700');
  readonly confirmButtonClass = input('bg-rose-600 hover:bg-rose-700');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    if (!this.loading()) {
      this.confirmed.emit();
    }
  }

  onCancel(): void {
    if (!this.loading()) {
      this.cancelled.emit();
    }
  }
}
