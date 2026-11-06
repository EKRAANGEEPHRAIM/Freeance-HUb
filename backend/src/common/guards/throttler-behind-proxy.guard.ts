import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Limite les requêtes par adresse IP réelle du client derrière un proxy inverse
 * (Render, Vercel, nginx). L'IP vient de `req.ip`, résolue par Express grâce à
 * `trust proxy` (voir main.ts) : on ne lit pas `x-forwarded-for` à la main, car
 * le client peut y écrire n'importe quoi pour contourner la limite.
 */
@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/require-await
  protected override async getTracker(req: Record<string, any>): Promise<string> {
    return (req['ip'] as string | undefined) ?? 'unknown';
  }
}
