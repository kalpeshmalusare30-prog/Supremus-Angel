'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import styled from 'styled-components';
import { parseList, serializeList } from '@/utils/list';

export interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  'aria-describedby'?: string;
}

const Box = styled.div<{ $disabled: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 6px 8px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px 2px 10px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radii.full};
`;

const Remove = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.colors.secondary};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const Entry = styled.input`
  flex: 1 1 80px;
  min-width: 80px;
  height: 30px;
  border: none;
  background: transparent;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }
`;

/** Free-form tag/chip input. Enter or comma adds a tag; value is a JSON array. */
export function TagInput({
  value,
  onChange,
  id,
  placeholder = 'Type and press Enter…',
  disabled = false,
  'aria-describedby': describedBy,
}: TagInputProps) {
  const [draft, setDraft] = useState('');
  const tags = parseList(value);

  const commit = (raw: string) => {
    const tag = raw.trim();
    if (tag === '' || tags.includes(tag)) {
      setDraft('');
      return;
    }
    onChange(serializeList([...tags, tag]));
    setDraft('');
  };

  const removeAt = (index: number) => onChange(serializeList(tags.filter((_, i) => i !== index)));

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit(draft);
    } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      removeAt(tags.length - 1);
    }
  };

  return (
    <Box $disabled={disabled}>
      {tags.map((tag, index) => (
        <Tag key={`${tag}-${index}`}>
          {tag}
          {!disabled && (
            <Remove type="button" aria-label={`Remove ${tag}`} onClick={() => removeAt(index)}>
              <X size={12} aria-hidden />
            </Remove>
          )}
        </Tag>
      ))}
      <Entry
        id={id}
        value={draft}
        placeholder={tags.length === 0 ? placeholder : ''}
        disabled={disabled}
        aria-describedby={describedBy}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => commit(draft)}
      />
    </Box>
  );
}
