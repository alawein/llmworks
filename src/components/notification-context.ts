import { createContext, useContext } from 'react';
import type { ComponentType } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'achievement' | 'battle' | 'xp';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ComponentType<{ className?: string }>;
}

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
