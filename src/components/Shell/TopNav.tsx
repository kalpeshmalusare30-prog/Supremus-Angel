'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Plus, Send, X } from 'lucide-react';
import styled from 'styled-components';
import { media } from '@/styles/breakpoints';
import { Button } from '@/components/ui';

export interface TopNavProps {
  onPublish?: () => void;
  canPublish?: boolean;
}

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: 'Builder', href: '/' },
  { label: 'My forms', href: '/forms' },
];

const Bar = styled.header`
  position: fixed;
  inset: 0 0 auto 0;
  z-index: ${({ theme }) => theme.zIndices.topNav};
  height: ${({ theme }) => theme.layout.navHeight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  ${media.upDesktop} {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  min-width: 0;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  flex: none;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.sm};

  & img {
    display: block;
    height: 40px;
    width: auto;
  }

  ${media.upDesktop} {
    & img {
      height: 50px;
    }
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  height: 100%;

  ${media.upDesktop} {
    display: flex;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  height: 100%;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textMuted)};
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: none;
    color: ${({ theme }) => theme.colors.primary};
    box-shadow: inset 0 -2px 0 ${({ theme }) => theme.colors.primary};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PublishLabel = styled.span`
  ${media.mobile} {
    display: none;
  }
`;

// IMP-001: Hamburger button — visible only on mobile/tablet, hidden on desktop.
const HamBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainer};
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  ${media.upDesktop} {
    display: none;
  }
`;

// IMP-001: Mobile slide-down drawer.
const Drawer = styled.nav`
  position: fixed;
  top: ${({ theme }) => theme.layout.navHeight};
  left: 0;
  right: 0;
  z-index: 49;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: 2px;

  ${media.upDesktop} {
    display: none;
  }
`;

const DrawerLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.body};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textMuted)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primarySoft : 'transparent')};
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  transition: background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainer};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

/** Top navigation: logo, nav links (desktop), publish action, and mobile hamburger (IMP-001). */
export function TopNav({ onPublish, canPublish = false }: TopNavProps) {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // Close drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <Bar>
        <Left>
          <Brand href="/" aria-label="Supremus Angel — home">
            <Image src="/logo-full.png" alt="Supremus Angel" width={66} height={50} priority />
          </Brand>
          <Nav aria-label="Primary">
            {NAV_ITEMS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <NavLink
                  key={href}
                  href={href}
                  $active={active}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                </NavLink>
              );
            })}
          </Nav>
        </Left>

        <Right>
          {onPublish ? (
            <Button
              onClick={onPublish}
              disabled={!canPublish}
              aria-label="Publish form"
              title="Publish the form and open it in a new tab"
            >
              <Send size={16} aria-hidden />
              <PublishLabel>Publish form</PublishLabel>
            </Button>
          ) : (
            <Button onClick={() => router.push('/')} aria-label="Create a new form">
              <Plus size={16} aria-hidden />
              <PublishLabel>New form</PublishLabel>
            </Button>
          )}

          {/* IMP-001: Hamburger — hidden on desktop via CSS */}
          <HamBtn
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </HamBtn>
        </Right>
      </Bar>

      {/* IMP-001: Mobile navigation drawer */}
      {mobileOpen && (
        <Drawer id="mobile-nav-drawer" aria-label="Mobile navigation">
          {NAV_ITEMS.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <DrawerLink
                key={href}
                href={href}
                $active={active}
                aria-current={active ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </DrawerLink>
            );
          })}
        </Drawer>
      )}
    </>
  );
}
