import { theme } from '@styles/default.theme';
import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { PushNotificationsProvider } from './useNotifications';

interface Props {
  children: React.ReactNode;
}

const AppProvider: React.FC<Props> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <PushNotificationsProvider>
      {children}
    </PushNotificationsProvider>
  </ThemeProvider>
);

export default AppProvider;
