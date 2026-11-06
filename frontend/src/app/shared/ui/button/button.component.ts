import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

@Component({
  selector: '[app-button]',
  standalone: true,
  template: ` <ng-content /> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly loading = input(false);
  readonly rounded = input<'sm' | 'md' | 'lg' | 'full'>('md');

  protected readonly hostClasses = computed(() => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold transition-colors ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
      'disabled:pointer-events-none disabled:opacity-60 cursor-pointer border border-transparent';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 focus-visible:ring-indigo-500',
      secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:ring-slate-400',
      ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500',
      outline:
        'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      icon: 'size-10',
    };

    const radius: Record<string, string> = {
      sm: 'rounded-lg',
      md: 'rounded-xl',
      lg: 'rounded-2xl',
      full: 'rounded-full',
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]} ${radius[this.rounded()]}`;
  });
}
