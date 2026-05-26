'use client';

import { BarChart3, Bell, HelpCircle, Send } from 'lucide-react';
import styled from 'styled-components';
import { media } from '@/styles/breakpoints';
import { Button, IconButton } from '@/components/ui';

export interface TopNavProps {
  onPublish: () => void;
  canPublish: boolean;
}

const NAV_ITEMS = ['Dashboard', 'Templates', 'Library', 'Settings'];

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

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Logomark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex: none;
  color: ${({ theme }) => theme.colors.onPrimary};
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const Wordmark = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;
`;

const Name = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.body};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
`;

const Tagline = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSubtle};
  white-space: nowrap;

  ${media.mobile} {
    display: none;
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

const NavLink = styled.button<{ $active?: boolean }>`
  height: 100%;
  display: inline-flex;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
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

const QuietActions = styled.div`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  ${media.upTablet} {
    display: flex;
  }
`;

const PublishLabel = styled.span`
  ${media.mobile} {
    /* Icon-only on small screens to keep the bar from crowding. */
    display: none;
  }
`;

const Avatar = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex: none;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radii.full};
`;

/** Presentational top navigation. Nav links are chrome (out of scope per PRD). */
export function TopNav({ onPublish, canPublish }: TopNavProps) {
  return (
    <Bar>
      <Left>
        <Brand>
          <Logomark aria-hidden>
            <BarChart3 size={18} />
          </Logomark>
          <Wordmark>
            <Name>Supremus Angel</Name>
            <Tagline>Unlock the Power of Pre-IPO</Tagline>
          </Wordmark>
        </Brand>
        <Nav aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item} $active={item === 'Dashboard'} type="button">
              {item}
            </NavLink>
          ))}
        </Nav>
      </Left>

      <Right>
        <QuietActions>
          <IconButton aria-label="Notifications">
            <Bell size={20} aria-hidden />
          </IconButton>
          <IconButton aria-label="Help">
            <HelpCircle size={20} aria-hidden />
          </IconButton>
        </QuietActions>
        <Button
          onClick={onPublish}
          disabled={!canPublish}
          aria-label="Publish form"
          title="Commit the current data"
        >
          <Send size={16} aria-hidden />
          <PublishLabel>Publish form</PublishLabel>
        </Button>
        <Avatar aria-hidden>SA</Avatar>
      </Right>
    </Bar>
  );
}
