'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, Wrench } from 'lucide-react';
import styled from 'styled-components';
import { media } from '@/styles/breakpoints';

// IMP-009: Rail is slightly wider so labels fit below icons.
const Rail = styled.aside`
  display: none;

  ${media.upDesktop} {
    position: fixed;
    top: ${({ theme }) => theme.layout.navHeight};
    left: 0;
    bottom: 0;
    z-index: ${({ theme }) => theme.zIndices.sideNav};
    width: ${({ theme }) => theme.layout.sideNavWidth};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md} 0;
    background: ${({ theme }) => theme.colors.background};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const RailLink = styled(Link)<{ $active?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 52px;
  padding: 8px 4px 6px;
  color: ${({ theme, $active }) => ($active ? theme.colors.onPrimary : theme.colors.textMuted)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.surfaceContainer};
    color: ${({ theme, $active }) => ($active ? theme.colors.onPrimary : theme.colors.text)};
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px ${({ theme }) => theme.colors.background},
      0 0 0 4px ${({ theme }) => theme.colors.primary};
  }
`;

const NavLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 9px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1;
`;

const NAV = [
  { key: 'builder', label: 'Builder', href: '/', Icon: Wrench },
  { key: 'forms', label: 'Forms', href: '/forms', Icon: ClipboardList },
];

/** Left icon rail (desktop) — icons with text labels for clarity (IMP-009). */
export function SideNav() {
  const pathname = usePathname() ?? '/';
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Rail aria-label="Sections">
      {NAV.map(({ key, label, href, Icon }) => {
        const active = isActive(href);
        return (
          <RailLink
            key={key}
            href={href}
            $active={active}
            aria-label={label}
            title={label}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={18} aria-hidden />
            <NavLabel>{label}</NavLabel>
          </RailLink>
        );
      })}
    </Rail>
  );
}
