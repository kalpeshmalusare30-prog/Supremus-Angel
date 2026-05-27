'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Plus, Send } from 'lucide-react';
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

// The full brand logo (symbol + wordmark + tagline) used as-is — no
// separately typed name. Whitespace-trimmed copy lives at /logo-full.png.
const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  flex: none;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.sm};

  & img {
    display: block;
    /* fluid within the bar: a touch smaller on phones */
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
    /* Icon-only on small screens to keep the bar from crowding. */
    display: none;
  }
`;

/** Top navigation: real Builder / My forms links plus a context action. */
export function TopNav({ onPublish, canPublish = false }: TopNavProps) {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
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
      </Right>
    </Bar>
  );
}
