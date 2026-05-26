'use client';

import styled from 'styled-components';
import { media } from '@/styles/breakpoints';

export const Shell = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

export const Main = styled.main`
  padding-top: ${({ theme }) => theme.layout.navHeight};

  ${media.upDesktop} {
    /* Clear the fixed side rail. */
    padding-left: ${({ theme }) => theme.layout.sideNavWidth};
  }
`;

export const Content = styled.div`
  max-width: ${({ theme }) => theme.layout.containerMax};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};

  ${media.upDesktop} {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;
