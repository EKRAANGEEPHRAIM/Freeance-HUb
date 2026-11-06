import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feature-placeholder',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="grid min-h-[60vh] place-items-center">
      <div class="max-w-md text-center">
        <span
          class="grid mx-auto size-14 place-items-center rounded-2xl bg-indigo-100 text-2xl text-indigo-600"
          >✦</span
        >
        <p class="mt-6 text-sm font-semibold text-indigo-600">Bientôt disponible</p>
        <h2 class="mt-2 text-3xl font-bold tracking-tight text-slate-950">{{ title }}</h2>
        <p class="mt-3 leading-7 text-slate-500">{{ description }}</p>
      </div>
    </section>
  `,
})
export class FeaturePlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  get title(): string {
    return this.route.snapshot.data['title'] as string;
  }

  get description(): string {
    return this.route.snapshot.data['description'] as string;
  }
}
