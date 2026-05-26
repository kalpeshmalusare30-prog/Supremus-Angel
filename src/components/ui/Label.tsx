'use client';

import styled from 'styled-components';

/** Mono, uppercase micro-label in the "Understated Tech" register (Stitch label-code). */
export const Label = styled.label`
  display: block;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: ${({ theme }) => theme.letterSpacings.label};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSubtle};
`;
