'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

export interface DatePickerProps {
  value: string;
  onChange: (iso: string) => void;
  id?: string;
  disabled?: boolean;
  hasError?: boolean;
  placeholder?: string;
  'aria-describedby'?: string;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (n: number) => String(n).padStart(2, '0');
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function parseISO(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

/** 42 days (6 weeks) covering the viewed month plus adjacent spill days. */
function buildGrid(view: Date): Date[] {
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const start = new Date(view.getFullYear(), view.getMonth(), 1 - first.getDay());
  return Array.from(
    { length: 42 },
    (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  );
}

const Trigger = styled.button<{ $error: boolean; $empty: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  height: 44px;
  padding: 0 12px;
  text-align: left;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme, $empty }) => ($empty ? theme.colors.textSubtle : theme.colors.text)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $error }) => ($error ? theme.colors.danger : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  svg {
    flex: none;
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.surfaceMuted};
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

const Pop = styled(motion.div)`
  position: fixed;
  z-index: 1100;
  width: 296px;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const CalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MonthLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const NavBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainer};
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const WeekCell = styled.span`
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const Day = styled.button<{ $out: boolean; $today: boolean; $sel: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme, $sel }) => ($sel ? theme.fontWeights.semibold : theme.fontWeights.regular)};
  color: ${({ theme, $out, $sel }) =>
    $sel ? theme.colors.onPrimary : $out ? theme.colors.textSubtle : theme.colors.text};
  background: ${({ theme, $sel }) => ($sel ? theme.colors.primary : 'transparent')};
  border: 1px solid
    ${({ theme, $today, $sel }) =>
      $sel ? theme.colors.primary : $today ? theme.colors.primarySoft : 'transparent'};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme, $sel }) => ($sel ? theme.colors.primaryHover : theme.colors.surfaceContainer)};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const CalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const TextBtn = styled.button`
  padding: ${({ theme }) => `4px ${theme.spacing.sm}`};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primarySoft};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

/** A themed, animated calendar date picker that opens in a portal popover. */
export function DatePicker({
  value,
  onChange,
  id,
  disabled = false,
  hasError = false,
  placeholder = 'Pick a date',
  'aria-describedby': describedBy,
}: DatePickerProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [view, setView] = useState<Date>(() => parseISO(value) ?? new Date());

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => parseISO(value), [value]);
  const today = useMemo(() => new Date(), []);
  const grid = useMemo(() => buildGrid(view), [view]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const popW = 296;
    const popH = 360;
    const gap = 6;
    let top = r.bottom + gap;
    if (top + popH > window.innerHeight) top = Math.max(8, r.top - popH - gap);
    const left = Math.max(8, Math.min(r.left, window.innerWidth - popW - 8));
    setPos({ top, left });
  }, []);

  const openCal = useCallback(() => {
    if (disabled) return;
    setView(parseISO(value) ?? new Date());
    place();
    setOpen(true);
  }, [disabled, value, place]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onScrollOrResize = () => setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open]);

  const select = (d: Date) => {
    onChange(toISO(d));
    setOpen(false);
  };

  const display = selected
    ? selected.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : placeholder;

  return (
    <>
      <Trigger
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        $error={hasError}
        $empty={!selected}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openCal())}
      >
        <span>{display}</span>
        <CalendarIcon size={18} aria-hidden />
      </Trigger>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <Pop
                ref={popRef}
                role="dialog"
                aria-label="Choose a date"
                style={{ top: pos.top, left: pos.left }}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: reduceMotion ? 0 : 0.16, ease: 'easeOut' }}
              >
                <CalHeader>
                  <NavBtn type="button" aria-label="Previous month" onClick={() => setView(addMonths(view, -1))}>
                    <ChevronLeft size={18} aria-hidden />
                  </NavBtn>
                  <MonthLabel>
                    {MONTHS[view.getMonth()]} {view.getFullYear()}
                  </MonthLabel>
                  <NavBtn type="button" aria-label="Next month" onClick={() => setView(addMonths(view, 1))}>
                    <ChevronRight size={18} aria-hidden />
                  </NavBtn>
                </CalHeader>

                <WeekRow>
                  {WEEKDAYS.map((w) => (
                    <WeekCell key={w}>{w}</WeekCell>
                  ))}
                </WeekRow>

                <DayGrid>
                  {grid.map((d) => (
                    <Day
                      key={toISO(d)}
                      type="button"
                      $out={d.getMonth() !== view.getMonth()}
                      $today={sameDay(d, today)}
                      $sel={Boolean(selected && sameDay(d, selected))}
                      aria-label={d.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      onClick={() => select(d)}
                    >
                      {d.getDate()}
                    </Day>
                  ))}
                </DayGrid>

                <CalFooter>
                  <TextBtn
                    type="button"
                    onClick={() => {
                      onChange('');
                      setOpen(false);
                    }}
                  >
                    Clear
                  </TextBtn>
                  <TextBtn type="button" onClick={() => select(new Date())}>
                    Today
                  </TextBtn>
                </CalFooter>
              </Pop>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
