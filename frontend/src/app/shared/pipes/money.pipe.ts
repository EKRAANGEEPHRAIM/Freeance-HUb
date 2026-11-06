import { Pipe, PipeTransform } from '@angular/core';
import { Currency, formatMoney } from '../utils/money';

/** {{ 325000 | money: 'XOF' }} → « 325 000 FCFA » */
@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(amount: number | null | undefined, currency: Currency | undefined = 'XOF'): string {
    return amount == null ? '' : formatMoney(amount, currency);
  }
}
