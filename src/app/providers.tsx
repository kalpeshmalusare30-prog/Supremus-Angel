'use client';

import React from 'react';
import { ThemeProvider } from 'styled-components';
import StyledComponentsRegistry from '@/lib/registry';
import { theme } from '@/styles/theme';

/**
 * Client boundary that wires up the styled-components SSR registry and the
 * theme provider so every component can read `props.theme`.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledComponentsRegistry>
  );
}
