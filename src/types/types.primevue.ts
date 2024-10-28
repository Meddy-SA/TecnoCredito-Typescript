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

type AlertSeverity = "success" | "info" | "warn" | "error";

export interface Alert {
  id: string;
  msg: string;
  severity: AlertSeverity;
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
