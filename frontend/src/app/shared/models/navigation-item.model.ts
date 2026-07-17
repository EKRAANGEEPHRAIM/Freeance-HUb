export type NavigationIcon = 'grid' | 'users' | 'folder' | 'receipt' | 'note';

export type NavigationItem = {
  label: string;
  route: string;
  icon: NavigationIcon;
};
