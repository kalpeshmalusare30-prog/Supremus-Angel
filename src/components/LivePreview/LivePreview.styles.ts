'use client';

import styled, { keyframes } from 'styled-components';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  position: sticky;
  top: ${({ theme }) => theme.spacing.lg};
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
`;

export const Dot = styled.span`
  width: 8px;
  height: 8px;
  flex: none;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primary};
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

/** A "paper" frame that makes the preview read as the real, rendered form. */
export const FormFrame = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const FormTitle = styled.h3<{ $placeholder?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.h2};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
  color: ${({ theme, $placeholder }) =>
    $placeholder ? theme.colors.textSubtle : theme.colors.text};
  font-style: ${({ $placeholder }) => ($placeholder ? 'italic' : 'normal')};
  /* Long, unbroken titles must wrap, not overflow the preview (BUG-008). */
  overflow-wrap: anywhere;
  word-break: break-word;
`;
