'use client';

import React from 'react';
import styled from 'styled-components';
import { media } from '@/styles/breakpoints';
import { DatePicker } from './DatePicker';

export interface DateRangePickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  hasError?: boolean;
  'aria-describedby'?: string;
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  ${media.mobile} {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Side = styled.div`
  flex: 1 1 0;
  min-width: 0;
`;

const Dash = styled.span`
  flex: none;
  color: ${({ theme }) => theme.colors.textSubtle};

  ${media.mobile} {
    display: none;
  }
`;

/** A start/end date range built from two calendars. Value is "start|end". */
export function DateRangePicker({
  value,
  onChange,
  id,
  disabled = false,
  hasError = false,
  'aria-describedby': describedBy,
}: DateRangePickerProps) {
  const [start = '', end = ''] = value.split('|');
  const emit = (s: string, e: string) => onChange(s === '' && e === '' ? '' : `${s}|${e}`);

  return (
    <Row id={id} aria-describedby={describedBy}>
      <Side>
        <DatePicker
          value={start}
          onChange={(v) => emit(v, end)}
          disabled={disabled}
          hasError={hasError}
          placeholder="Start date"
        />
      </Side>
      <Dash aria-hidden>–</Dash>
      <Side>
        <DatePicker
          value={end}
          onChange={(v) => emit(start, v)}
          disabled={disabled}
          hasError={hasError}
          placeholder="End date"
        />
      </Side>
    </Row>
  );
}
