'use client';

import styled from 'styled-components';
import { media } from '@/styles/breakpoints';

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Helper = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.caption};
  line-height: ${({ theme }) => theme.lineHeights.caption};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.danger};
`;

export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const SectionLabel = styled.h3`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: ${({ theme }) => theme.letterSpacings.label};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const AddOption = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const CheckGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;
