'use client';

import Link from 'next/link';
import { Compass } from 'lucide-react';
import styled from 'styled-components';

const Wrap = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 440px;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Icon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radii.full};
`;

const Code = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  letter-spacing: ${({ theme }) => theme.letterSpacings.label};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.h1};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const Text = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  line-height: ${({ theme }) => theme.lineHeights.body};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ButtonLink = styled(Link)<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid
    ${({ theme, $primary }) => ($primary ? 'transparent' : theme.colors.border)};
  color: ${({ theme, $primary }) => ($primary ? theme.colors.onPrimary : theme.colors.primary)};
  background: ${({ theme, $primary }) =>
    $primary ? theme.colors.primary : theme.colors.surface};
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme, $primary }) =>
      $primary ? theme.colors.primaryHover : theme.colors.primarySoft};
  }
`;

/** Branded 404 — replaces Next.js's raw default (QA BUG-010). */
export default function NotFound() {
  return (
    <Wrap>
      <Card>
        <Icon aria-hidden>
          <Compass size={28} />
        </Icon>
        <Code>Error 404</Code>
        <Title>This page wandered off</Title>
        <Text>
          The page you’re looking for doesn’t exist or may have moved. Let’s get you back to
          building.
        </Text>
        <Links>
          <ButtonLink href="/" $primary>
            Go to the builder
          </ButtonLink>
          <ButtonLink href="/forms">My forms</ButtonLink>
        </Links>
      </Card>
    </Wrap>
  );
}
