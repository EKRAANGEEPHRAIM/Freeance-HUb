import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import type { InvoiceStatus } from '../../models/invoice.models';
import type { ProjectStatus } from '../../models/project.models';

export type BadgeTone = 'neutral' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' | 'violet';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
      <ng-content />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('neutral');

  protected readonly hostClasses = computed(() => {
    const tones: Record<BadgeTone, string> = {
      neutral: 'bg-slate-100 text-slate-700',
      indigo: 'bg-indigo-100 text-indigo-700',
      emerald: 'bg-emerald-100 text-emerald-700',
      amber: 'bg-amber-100 text-amber-700',
      rose: 'bg-rose-100 text-rose-700',
      slate: 'bg-slate-100 text-slate-600',
      violet: 'bg-violet-100 text-violet-700',
    };
    return tones[this.tone()];
  });
}

// ------------------ Helpers de mapping des statuts ------------------

export const projectStatusTone: Record<ProjectStatus, BadgeTone> = {
  PENDING: 'amber',
  IN_PROGRESS: 'indigo',
  COMPLETED: 'emerald',
  CANCELLED: 'slate',
};

export const projectStatusLabel: Record<ProjectStatus, string> = {
  PENDING: 'En attente',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé',
};

export const invoiceStatusTone: Record<InvoiceStatus, BadgeTone> = {
  DRAFT: 'slate',
  SENT: 'indigo',
  PAID: 'emerald',
  OVERDUE: 'rose',
};

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  DRAFT: 'Brouillon',
  SENT: 'Envoyée',
  PAID: 'Payée',
  OVERDUE: 'En retard',
};
