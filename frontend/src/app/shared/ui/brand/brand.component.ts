import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logotype Réglo : le nom en Fraunces, suivi d'un point vermillon comme un coup de tampon */
@Component({
  selector: 'app-brand',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex items-baseline' },
  template: `
    <span
      class="font-display font-semibold tracking-tight"
      [class]="tone() === 'light' ? 'text-slate-50' : 'text-slate-950'"
      [style.font-size.px]="size()"
      >Réglo</span
    ><span
      class="ml-0.5 inline-block rounded-full bg-violet-500"
      [style.width.px]="size() * 0.22"
      [style.height.px]="size() * 0.22"
    ></span>
  `,
})
export class BrandComponent {
  readonly size = input(24);
  readonly tone = input<'dark' | 'light'>('dark');
}
