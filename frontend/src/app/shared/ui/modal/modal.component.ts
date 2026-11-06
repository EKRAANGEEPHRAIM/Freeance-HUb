import { Component, input, output, HostListener, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
        <!-- Overlay -->
        <button
          class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
          type="button"
          aria-label="Fermer"
          [attr.data-cy]="'modal-overlay'"
          (click)="onOverlayClick()"
        ></button>

        <!-- Panel -->
        <div
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="title()"
          class="relative my-8 w-full shadow-2xl"
          [class]="panelClass()"
        >
          @if (showHeader()) {
            <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                @if (eyebrow()) {
                  <p class="text-sm font-semibold" [class]="eyebrowClass()">{{ eyebrow() }}</p>
                }
                <h3 class="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">{{ title() }}</h3>
              </div>
              <button
                type="button"
                class="grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100"
                aria-label="Fermer"
                (click)="close()"
              >
                <svg
                  class="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          }

          <div class="px-6 py-5">
            <ng-content />
          </div>

          @if (showFooter()) {
            <div class="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <ng-content select="[modal-actions]" />
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  readonly open = input(false);
  readonly title = input('');
  readonly eyebrow = input('');
  readonly eyebrowClass = input('text-indigo-600');
  readonly maxWidth = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly showHeader = input(true);
  readonly showFooter = input(false);
  readonly dismissible = input(true);

  readonly closed = output<void>();

  protected readonly panelClass = () => {
    const widths = {
      sm: 'max-w-md',
      md: 'max-w-xl',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
    };
    return `rounded-2xl bg-white ${widths[this.maxWidth()]}`;
  };

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open() && this.dismissible()) {
      this.close();
    }
  }

  protected onOverlayClick(): void {
    if (this.dismissible()) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }
}
