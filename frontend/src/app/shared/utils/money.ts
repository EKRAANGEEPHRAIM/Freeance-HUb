export type Currency = 'XOF' | 'EUR';

/** Parité fixe du franc CFA (UEMOA) : 1 € = 655,957 FCFA */
export const XOF_PER_EUR = 655.957;

export const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: 'XOF', label: 'Franc CFA (FCFA)' },
  { value: 'EUR', label: 'Euro (€)' },
];

/**
 * Le format français sépare les milliers par une espace fine insécable (U+202F),
 * absente de certaines polices (le séparateur disparaît : « 1355957 »). On la remplace
 * par une espace insécable classique (U+00A0), présente partout.
 */
const readable = (text: string): string => text.replace(/ /g, ' ');

/** 325000, 'XOF' → « 325 000 FCFA » ; 1000, 'EUR' → « 1 000,00 € » */
export function formatMoney(amount: number, currency: Currency = 'XOF'): string {
  if (currency === 'XOF') {
    const digits = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(amount);
    return readable(`${digits} FCFA`);
  }
  return readable(new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount));
}

/** Montant ramené en FCFA, pour additionner des factures dans les deux devises */
export function toXof(amount: number, currency: Currency): number {
  return currency === 'EUR' ? amount * XOF_PER_EUR : amount;
}
