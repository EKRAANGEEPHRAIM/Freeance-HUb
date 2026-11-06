import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { Currency, InvoiceStatus, PrismaClient, ProjectStatus } from '@prisma/client';

// Compte de démonstration public (affiché sur la page de connexion et dans le README).
// Relancer le seed remet les données de démo à zéro, sans toucher aux autres comptes.
const DEMO_EMAIL = 'demo@freelancehub.app';
const DEMO_PASSWORD = 'Demo2026!';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const daysFromNow = (days: number): Date => new Date(Date.now() + days * 86_400_000);

async function main(): Promise<void> {
  const password = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { password, firstName: 'Ange', lastName: 'Démo' },
    create: { email: DEMO_EMAIL, password, firstName: 'Ange', lastName: 'Démo' },
  });

  // Les projets, factures sont supprimés en cascade avec les clients
  await prisma.client.deleteMany({ where: { userId: user.id } });
  await prisma.note.deleteMany({ where: { userId: user.id } });

  const boulangerie = await prisma.client.create({
    data: { userId: user.id, name: 'Mariam Traoré', email: 'contact@boulangerie-doree.demo', phone: '+225 07 11 22 33 44', company: 'Boulangerie Dorée' },
  });
  const agence = await prisma.client.create({
    data: { userId: user.id, name: 'Julien Martin', email: 'julien@agence-pixel.demo', company: 'Agence Pixel (Lyon)' },
  });
  const ecole = await prisma.client.create({
    data: { userId: user.id, name: 'Kouadio N’Guessan', email: 'direction@ecole-horizon.demo', phone: '+225 05 44 55 66 77', company: 'École Horizon' },
  });

  const site = await prisma.project.create({
    data: {
      clientId: boulangerie.id,
      title: 'Site vitrine et commande en ligne',
      description: 'Catalogue des produits, commande pour retrait en boutique.',
      status: ProjectStatus.COMPLETED,
      startDate: daysFromNow(-75),
      endDate: daysFromNow(-30),
      budget: 650000,
      currency: Currency.XOF,
    },
  });
  const dashboard = await prisma.project.create({
    data: {
      clientId: agence.id,
      title: 'Tableau de bord client (Angular)',
      description: 'Intégration des maquettes Figma et connexion à leur API.',
      status: ProjectStatus.IN_PROGRESS,
      startDate: daysFromNow(-20),
      endDate: daysFromNow(15),
      budget: 2500,
      currency: Currency.EUR,
    },
  });
  const api = await prisma.project.create({
    data: {
      clientId: agence.id,
      title: 'API NestJS de prise de rendez-vous',
      status: ProjectStatus.PENDING,
      startDate: daysFromNow(20),
      budget: 1800,
      currency: Currency.EUR,
    },
  });
  const appMobile = await prisma.project.create({
    data: {
      clientId: agence.id,
      title: 'Application mobile de réservation (Ionic)',
      description: 'Livrée et en production chez leur client.',
      status: ProjectStatus.COMPLETED,
      startDate: daysFromNow(-170),
      endDate: daysFromNow(-95),
      budget: 3200,
      currency: Currency.EUR,
    },
  });
  const inscriptions = await prisma.project.create({
    data: {
      clientId: ecole.id,
      title: 'Plateforme d’inscriptions en ligne',
      description: 'Formulaire, paiement des frais et suivi des dossiers.',
      status: ProjectStatus.IN_PROGRESS,
      startDate: daysFromNow(-10),
      endDate: daysFromNow(40),
      budget: 1800000,
      currency: Currency.XOF,
    },
  });

  // Préfixe DEMO : le numéro de facture est unique sur toute la base, il ne doit pas
  // bloquer un visiteur qui crée sa propre facture INV-…
  const year = new Date().getFullYear();
  await prisma.invoice.createMany({
    data: [
      { projectId: site.id, number: `DEMO-${year}-001`, amount: 325000, dueDate: daysFromNow(-60), status: InvoiceStatus.PAID },
      { projectId: site.id, number: `DEMO-${year}-002`, amount: 325000, dueDate: daysFromNow(-25), status: InvoiceStatus.PAID },
      { projectId: dashboard.id, number: `DEMO-${year}-003`, amount: 1000, dueDate: daysFromNow(-5), status: InvoiceStatus.OVERDUE },
      { projectId: inscriptions.id, number: `DEMO-${year}-004`, amount: 700000, dueDate: daysFromNow(10), status: InvoiceStatus.SENT },
      { projectId: appMobile.id, number: `DEMO-${year}-006`, amount: 1600, dueDate: daysFromNow(-140), status: InvoiceStatus.PAID },
      { projectId: appMobile.id, number: `DEMO-${year}-007`, amount: 1600, dueDate: daysFromNow(-100), status: InvoiceStatus.PAID },
      { projectId: api.id, number: `DEMO-${year}-005`, amount: 540, dueDate: daysFromNow(30), status: InvoiceStatus.DRAFT },
    ].map((invoice) => ({
      ...invoice,
      // Émise 30 jours avant l'échéance, comme une vraie facture
      createdAt: new Date(invoice.dueDate.getTime() - 30 * 86_400_000),
    })),
  });

  await prisma.note.createMany({
    data: [
      { userId: user.id, title: 'Relance Agence Pixel', content: 'Facture DEMO-003 en retard : relancer Julien par e-mail lundi.' },
      { userId: user.id, title: 'Idées pour l’école', content: 'Proposer un module de paiement mobile money pour les frais d’inscription.' },
      { userId: user.id, title: 'Tarifs 2026', content: 'Clients d’Abidjan : forfait site vitrine dès 450 000 FCFA. Clients en Europe : TJM 250 €.' },
    ],
  });

  console.log(`Seed terminé : ${DEMO_EMAIL} avec 3 clients, 5 projets, 7 factures et 3 notes`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
