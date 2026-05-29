'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import styled from 'styled-components';
import { media } from '@/styles/breakpoints';

// IMP-017: Consistent header so users can navigate without relying on the action buttons.
const Header = styled.header`
  position: fixed;
  inset: 0 0 auto 0;
  height: ${({ theme }) => theme.layout.navHeight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: ${({ theme }) => theme.zIndices.topNav};
`;

const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;

  img {
    height: 40px;
    width: auto;

    ${media.upDesktop} {
      height: 50px;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const NavLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Wrap = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `calc(${theme.layout.navHeight} + ${theme.spacing.lg})`}
    ${({ theme }) => theme.spacing.lg}
    ${({ theme }) => theme.spacing.lg};
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

/** Branded 404 with consistent site header (IMP-017). */
export default function NotFound() {
  return (
    <>
      <Header>
        <BrandLink href="/" aria-label="Supremus Angel — home">
          <Image src="/logo-full.png" alt="Supremus Angel" width={66} height={50} priority />
        </BrandLink>
        <Nav aria-label="Primary">
          <NavLink href="/">Builder</NavLink>
          <NavLink href="/forms">My forms</NavLink>
        </Nav>
      </Header>

      <Wrap>
        <Card>
          <Icon aria-hidden>
            <Compass size={28} />
          </Icon>
          <Code>Error 404</Code>
          <Title>This page wandered off</Title>
          <Text>
            The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back to
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
    </>
  );
}
