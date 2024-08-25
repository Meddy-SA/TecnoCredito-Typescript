export interface BreadcrumbItem {
  label: string;
  icon?: string;
  route?: string;
}

export interface MessageNotify {
  severity: string;
  icon?: string;
  content: string;
  description: string;
  badge?: string;
}

export interface Alert {
  id: string;
  msg: string;
  severity: 'success' | 'info' | 'warn' | 'error';
  read: boolean;
  summary: string;
  life: number;
}

export interface MenuItem {
  name: string;
  icon?: string;
  items?: MenuItem[];
  command?: string;
  style?: string;
}
