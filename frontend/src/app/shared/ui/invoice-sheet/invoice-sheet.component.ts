import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Aperçu d'une facture réglée (données fictives), utilisé comme illustration
 * sur l'accueil, la connexion et l'inscription. C'est le produit lui-même qui
 * sert d'image : une facture propre, en FCFA, tamponnée « payée ».
 */
@Component({
  selector: 'app-invoice-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="relative">
      <!-- Feuille du dessous, pour l'effet de liasse -->
      <div
        class="absolute inset-0 translate-x-3 translate-y-3 rotate-[2.5deg] border border-slate-200 bg-[#fbf8f2]"
        aria-hidden="true"
      ></div>

      <article
        class="relative border border-slate-200 bg-white px-7 py-8 text-slate-800 shadow-2xl sm:px-9"
        [class.-rotate-1]="tilted()"
        aria-label="Exemple de facture réglée"
      >
        <header class="flex items-start justify-between gap-6">
          <div>
            <p class="font-display text-lg font-semibold text-slate-950">Studio Kouamé</p>
            <p class="mt-1 text-xs leading-5 text-slate-500">
              Design &amp; développement web<br />Cocody, Abidjan
            </p>
          </div>
          <div class="text-right">
            <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Facture</p>
            <p class="mt-1 font-mono text-sm font-medium text-slate-950">FAC-2026-013</p>
            <p class="font-mono text-xs text-slate-500">12.11.2026</p>
          </div>
        </header>

        <div class="mt-7 border-t border-slate-200 pt-4">
          <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Facturé à</p>
          <p class="mt-1 text-sm font-semibold text-slate-950">Boutique Adjoua</p>
          <p class="text-xs text-slate-500">Riviera 2, Abidjan</p>
        </div>

        <table class="mt-6 w-full text-sm">
          <thead>
            <tr class="border-b border-slate-950 text-left">
              <th class="pb-2 font-mono text-[11px] font-normal uppercase tracking-[0.15em] text-slate-500">
                Désignation
              </th>
              <th class="pb-2 text-right font-mono text-[11px] font-normal uppercase tracking-[0.15em] text-slate-500">
                Montant
              </th>
            </tr>
          </thead>
          <tbody>
            @for (line of lines; track line.label) {
              <tr class="border-b border-dashed border-slate-200">
                <td class="py-2.5 pr-4">{{ line.label }}</td>
                <td class="py-2.5 text-right font-mono">{{ line.amount }}</td>
              </tr>
            }
          </tbody>
        </table>

        <div class="mt-5 flex items-baseline justify-between">
          <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Total</p>
          <p class="font-mono text-xl font-medium text-slate-950">700&#8239;000 FCFA</p>
        </div>

        <p class="mt-6 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
          Règlement par Orange Money, Wave, MTN MoMo ou virement.
        </p>

        <!-- Tampon -->
        <div
          class="stamp absolute right-7 top-[8.5rem] -rotate-[9deg] px-4 py-2 text-center text-violet-600 sm:right-9"
          aria-label="Facture payée le 18 novembre 2026"
        >
          <p class="font-display text-2xl font-bold uppercase leading-none tracking-[0.12em]">Payée</p>
          <p class="mt-1 font-mono text-[11px] tracking-[0.2em]">18.11.2026 · WAVE</p>
        </div>
      </article>
    </div>
  `,
})
export class InvoiceSheetComponent {
  /** Légère inclinaison, comme une feuille posée sur le bureau */
  readonly tilted = input(true);

  protected readonly lines = [
    { label: 'Site vitrine, 5 pages', amount: '450 000' },
    { label: 'Module boutique en ligne', amount: '200 000' },
    { label: 'Maintenance · 2 mois', amount: '50 000' },
  ];
}
