'use client';

import React, { cloneElement, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import styled from 'styled-components';

type Placement = 'top' | 'bottom';

interface TooltipProps {
  content: React.ReactNode;
  /** A single focusable element that triggers the tooltip. */
  children: React.ReactElement;
  placement?: Placement;
}

const Anchor = styled.span`
  position: relative;
  display: block;
`;

const Bubble = styled(motion.span)<{ $placement: Placement }>`
  position: absolute;
  left: 50%;
  z-index: ${({ theme }) => theme.zIndices.tooltip};
  ${({ $placement }) =>
    $placement === 'top' ? 'bottom: calc(100% + 8px);' : 'top: calc(100% + 8px);'}
  transform: translateX(-50%);
  max-width: 240px;
  width: max-content;
  padding: 8px 12px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.tooltipText};
  background: ${({ theme }) => theme.colors.tooltipBg};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: ${({ theme }) => theme.radii.sm};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  pointer-events: none;
  text-align: center;

  /* Arrow pointing at the trigger. */
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    ${({ $placement, theme }) =>
      $placement === 'top'
        ? `top: 100%; border-top-color: ${theme.colors.tooltipBg};`
        : `bottom: 100%; border-bottom-color: ${theme.colors.tooltipBg};`}
  }
`;

/**
 * Hover / focus tooltip (UI/UX Brief §8.5). Soft scale-and-fade entry,
 * dismissible with Escape, announced to screen readers via aria-describedby.
 */
export function Tooltip({ content, children, placement = 'top' }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const child = React.Children.only(children) as React.ReactElement<
    Record<string, unknown> & { tabIndex?: number }
  >;

  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  const trigger = cloneElement(child, {
    'aria-describedby': open ? id : undefined,
    tabIndex: child.props.tabIndex ?? 0,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    },
  });

  return (
    <Anchor>
      {trigger}
      <AnimatePresence>
        {open && (
          <Bubble
            id={id}
            role="tooltip"
            $placement={placement}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: reduceMotion ? 0 : 0.15, ease: 'easeOut' }}
          >
            {content}
          </Bubble>
        )}
      </AnimatePresence>
    </Anchor>
  );
}
