'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/breakpoints';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const Item = styled(motion.div)<{ $full: boolean; $dim: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
  grid-column: ${({ $full }) => ($full ? '1 / -1' : 'auto')};
  opacity: ${({ $dim }) => ($dim ? 0.55 : 1)};

  ${media.mobile} {
    grid-column: 1 / -1;
  }
`;

export const FieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const FieldLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

export const Req = styled.span`
  color: ${({ theme }) => theme.colors.danger};
`;

export const HiddenTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  padding: 1px 8px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.full};

  svg {
    flex: none;
  }
`;

export const FieldError = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.caption};
  color: ${({ theme }) => theme.colors.danger};
`;

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSubtle};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};

  p {
    font-size: ${({ theme }) => theme.fontSizes.bodySm};
    max-width: 28ch;
  }

  svg {
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.6;
  }
`;
