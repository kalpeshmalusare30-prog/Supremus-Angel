'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/breakpoints';

export const Row = styled(motion.div)`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: box-shadow ${({ theme }) => theme.transitions.base};

  &:focus-within {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  ${media.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const Cell = styled.div<{ $grow?: number; $basis?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: ${({ $grow = 1 }) => $grow} 1 ${({ $basis = '0' }) => $basis};
  min-width: 0;
`;

export const RemoveWrap = styled.div`
  flex: none;
  align-self: flex-end;

  ${media.mobile} {
    /* Float the remove control to the top-right of the stacked card. */
    order: -1;
    margin-bottom: calc(-1 * ${({ theme }) => theme.spacing.xs});
  }
`;

export const ErrorText = styled.p`
  flex-basis: 100%;
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.danger};
`;
