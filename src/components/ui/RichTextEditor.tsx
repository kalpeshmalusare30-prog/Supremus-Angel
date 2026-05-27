'use client';

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Bold, Italic, Link as LinkIcon, List, ListOrdered, Underline } from 'lucide-react';

export interface RichTextEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  'aria-describedby'?: string;
}

const Wrap = styled.div<{ $hasError: boolean; $disabled: boolean }>`
  border: 1px solid
    ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.surfaceMuted : theme.colors.surface};

  &:focus-within {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.primary};
    box-shadow: ${({ theme, $hasError }) =>
      $hasError ? `0 0 0 3px ${theme.colors.dangerSoft}` : theme.shadows.focus};
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 2px;
  padding: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

const Tool = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surfaceContainer};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const Editable = styled.div`
  min-height: 96px;
  padding: ${({ theme }) => `${theme.spacing.sm} 12px`};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.text};
  line-height: ${({ theme }) => theme.lineHeights.body};
  outline: none;
  overflow-wrap: anywhere;

  &:empty::before {
    content: attr(data-placeholder);
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
  ul,
  ol {
    padding-left: 1.4em;
  }
`;

/** True when the HTML has no meaningful text/content. */
function isBlank(html: string): boolean {
  return (
    html
      .replace(/<br\s*\/?>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/gi, '')
      .trim() === ''
  );
}

/**
 * Lightweight rich-text editor: a contenteditable surface plus a small
 * formatting toolbar (no heavy dependency). Stores sanitised-enough HTML in
 * the field value; emits an empty string when the content is blank.
 */
export function RichTextEditor({
  id,
  value,
  onChange,
  placeholder = 'Write something…',
  disabled = false,
  hasError = false,
  'aria-describedby': ariaDescribedBy,
}: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Seed the initial HTML once; afterwards the DOM is the source of truth so
  // the caret never jumps mid-edit.
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = () => {
    const html = ref.current?.innerHTML ?? '';
    onChange(isBlank(html) ? '' : html);
  };

  const run = (command: string, arg?: string) => {
    if (disabled) return;
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  const addLink = () => {
    if (disabled) return;
    const url = window.prompt('Link URL (https://…)');
    if (url) run('createLink', url);
  };

  return (
    <Wrap $hasError={hasError} $disabled={disabled}>
      <Toolbar role="toolbar" aria-label="Text formatting">
        <Tool type="button" aria-label="Bold" onClick={() => run('bold')} disabled={disabled}>
          <Bold size={16} aria-hidden />
        </Tool>
        <Tool type="button" aria-label="Italic" onClick={() => run('italic')} disabled={disabled}>
          <Italic size={16} aria-hidden />
        </Tool>
        <Tool
          type="button"
          aria-label="Underline"
          onClick={() => run('underline')}
          disabled={disabled}
        >
          <Underline size={16} aria-hidden />
        </Tool>
        <Tool
          type="button"
          aria-label="Bulleted list"
          onClick={() => run('insertUnorderedList')}
          disabled={disabled}
        >
          <List size={16} aria-hidden />
        </Tool>
        <Tool
          type="button"
          aria-label="Numbered list"
          onClick={() => run('insertOrderedList')}
          disabled={disabled}
        >
          <ListOrdered size={16} aria-hidden />
        </Tool>
        <Tool type="button" aria-label="Add link" onClick={addLink} disabled={disabled}>
          <LinkIcon size={16} aria-hidden />
        </Tool>
      </Toolbar>
      <Editable
        id={id}
        ref={ref}
        role="textbox"
        aria-multiline="true"
        aria-describedby={ariaDescribedBy}
        data-placeholder={placeholder}
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
      />
    </Wrap>
  );
}
