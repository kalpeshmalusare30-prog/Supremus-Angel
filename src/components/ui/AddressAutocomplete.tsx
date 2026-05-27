'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Loader2, MapPin } from 'lucide-react';

export interface AddressAutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  'aria-describedby'?: string;
}

interface Suggestion {
  place_id: number;
  display_name: string;
}

const ENDPOINT = 'https://nominatim.openstreetmap.org/search';
const DEBOUNCE_MS = 350;

const Wrap = styled.div`
  position: relative;
`;

const Field = styled.div<{ $hasError: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};

  &:focus-within {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.primary};
    box-shadow: ${({ theme, $hasError }) =>
      $hasError ? `0 0 0 3px ${theme.colors.dangerSoft}` : theme.shadows.focus};
  }

  svg {
    flex: none;
    color: ${({ theme }) => theme.colors.textSubtle};
  }
`;

const Bare = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  background: none;
  outline: none;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }
`;

const Spin = styled(Loader2)`
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const List = styled.ul`
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 240px;
  overflow-y: auto;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const Option = styled.li`
  padding: 8px 10px;
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainer};
  }
`;

/**
 * Address field with OpenStreetMap (Nominatim) autocomplete — no API key.
 * Subject to Nominatim's usage policy/rate limits, so lookups are debounced.
 * The selected (or typed) address text is stored in the field value.
 */
export function AddressAutocomplete({
  id,
  value,
  onChange,
  placeholder = 'Start typing an address…',
  disabled = false,
  hasError = false,
  'aria-describedby': ariaDescribedBy,
}: AddressAutocompleteProps) {
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const skipNext = useRef(false);

  useEffect(() => {
    const q = value.trim();
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    if (q.length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`${ENDPOINT}?format=jsonv2&limit=5&q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })
        .then((r) => (r.ok ? r.json() : []))
        .then((data: Suggestion[]) => {
          setResults(Array.isArray(data) ? data : []);
          setOpen(true);
        })
        .catch(() => {
          // Network blocked / rate-limited — degrade to a plain text field.
        })
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [value]);

  const select = (s: Suggestion) => {
    skipNext.current = true;
    onChange(s.display_name);
    setResults([]);
    setOpen(false);
  };

  return (
    <Wrap>
      <Field $hasError={hasError}>
        <MapPin size={16} aria-hidden />
        <Bare
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          aria-describedby={ariaDescribedBy}
          aria-invalid={hasError}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {loading && <Spin size={16} aria-hidden />}
      </Field>
      {open && results.length > 0 && (
        <List role="listbox">
          {results.map((s) => (
            <Option key={s.place_id} role="option" aria-selected={false} onClick={() => select(s)}>
              {s.display_name}
            </Option>
          ))}
        </List>
      )}
    </Wrap>
  );
}
