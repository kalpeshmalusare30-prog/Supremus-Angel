'use client';

import { BarChart3, BookOpen, Palette, Workflow, Wrench } from 'lucide-react';
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

const RailButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  cursor: pointer;
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

const TOOLS = [
  { key: 'build', label: 'Builder', Icon: Wrench, active: true },
  { key: 'flow', label: 'Logic', Icon: Workflow, active: false },
  { key: 'theme', label: 'Theme', Icon: Palette, active: false },
  { key: 'insights', label: 'Insights', Icon: BarChart3, active: false },
];

/** Presentational left icon rail (desktop only). */
export function SideNav() {
  return (
    <Rail aria-label="Tools">
      {TOOLS.map(({ key, label, Icon, active }) => (
        <RailButton key={key} type="button" $active={active} aria-label={label} title={label}>
          <Icon size={20} aria-hidden />
        </RailButton>
      ))}
      <RailButton type="button" aria-label="Docs" title="Docs" style={{ marginTop: 'auto' }}>
        <BookOpen size={20} aria-hidden />
      </RailButton>
    </Rail>
  );
}
