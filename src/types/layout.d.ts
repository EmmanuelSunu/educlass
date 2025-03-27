import { ReactNode } from 'react';

export interface DashboardLayoutProps {
  title: string;
  buttonTitle?: string;
  showAddHeadbarButton?: boolean;
  onAddHeadbarButton?: () => void;
  children: ReactNode;
}

declare module '../../user/s/layout/index' {
  const DashboardLayout: React.FC<DashboardLayoutProps>;
  export default DashboardLayout;
}

declare module '../../user/l/layout/index' {
  const DashboardLayout: React.FC<DashboardLayoutProps>;
  export default DashboardLayout;
} 