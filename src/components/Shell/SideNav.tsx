'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, Wrench } from 'lucide-react';
import styled from 'styled-components';
import { media } from '@/styles/breakpoints';

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
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: ${({ theme, $active }) => ($active ? theme.colors.onPrimary : theme.colors.textMuted)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  border-radius: ${({ theme }) => theme.radii.md};
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

const NAV = [
  { key: 'builder', label: 'Builder', href: '/', Icon: Wrench },
  { key: 'forms', label: 'My forms', href: '/forms', Icon: ClipboardList },
];

/** Left icon rail (desktop) — the two real destinations. */
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
            <Icon size={20} aria-hidden />
          </RailLink>
        );
      })}
    </Rail>
  );
}
