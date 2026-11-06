import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div
      class="animate-pulse bg-slate-200/60"
      [class]="roundedClass()"
      [style.width]="width()"
      [style.height]="height()"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block' },
})
export class SkeletonComponent {
  readonly width = input('100%');
  readonly height = input('2.5rem');
  readonly rounded = input<'sm' | 'md' | 'lg' | 'full'>('md');

  protected readonly roundedClass = () => {
    const radii = {
      sm: 'rounded',
      md: 'rounded-lg',
      lg: 'rounded-xl',
      full: 'rounded-full',
    };
    return radii[this.rounded()];
  };
}
