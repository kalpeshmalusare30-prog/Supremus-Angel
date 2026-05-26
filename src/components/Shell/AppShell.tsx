'use client';

import React from 'react';
import { TopNav } from './TopNav';
import { SideNav } from './SideNav';
import { Content, Main, Shell } from './AppShell.styles';

export interface AppShellProps {
  onPublish: () => void;
  canPublish: boolean;
  children: React.ReactNode;
}

/** Dashboard chrome: fixed top nav + left rail, with the page content inside. */
export function AppShell({ onPublish, canPublish, children }: AppShellProps) {
  return (
    <Shell>
      <TopNav onPublish={onPublish} canPublish={canPublish} />
      <SideNav />
      <Main>
        <Content>{children}</Content>
      </Main>
    </Shell>
  );
}
