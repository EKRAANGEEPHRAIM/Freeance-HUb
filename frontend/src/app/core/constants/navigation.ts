import type { NavigationItem } from '../../shared/models/navigation-item.model';

export const navigationItems: NavigationItem[] = [
  { label: 'Tableau de bord', route: '/dashboard', icon: 'grid' },
  { label: 'Clients', route: '/clients', icon: 'users' },
  { label: 'Projets', route: '/projects', icon: 'folder' },
  { label: 'Factures', route: '/invoices', icon: 'receipt' },
  { label: 'Notes', route: '/notes', icon: 'note' },
];
