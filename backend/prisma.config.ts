import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Neon ne fournit que DATABASE_URL (poolée) : la CLI Prisma utilise l'URL directe,
// obtenue en retirant "-pooler" de l'hôte. DIRECT_URL reste prise en compte si elle existe.
const directUrl =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL?.replace('-pooler.', '.');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: directUrl,
  },
});
