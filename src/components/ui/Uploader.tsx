'use client';

import React, { useRef, useState } from 'react';
import { FileUp, ImageUp, UploadCloud, X } from 'lucide-react';
import styled from 'styled-components';

export interface UploaderProps {
  value: string;
  onChange: (value: string) => void;
  /** `file` stores the filename; `image` stores a data URL and previews it. */
  variant?: 'file' | 'image';
  id?: string;
  disabled?: boolean;
  'aria-describedby'?: string;
}

const Zone = styled.div<{ $over: boolean; $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-height: 96px;
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme, $over }) => ($over ? theme.colors.primarySoft : theme.colors.surface)};
  border: 1px dashed
    ${({ theme, $over }) => ($over ? theme.colors.primary : theme.colors.borderStrong)};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Prompt = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
`;

const Hint = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.caption};
  color: ${({ theme }) => theme.colors.textSubtle};
`;

const FileChip = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => `0 ${theme.spacing.sm}`};
  height: 44px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const FileName = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Remove = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex: none;
  color: ${({ theme }) => theme.colors.textSubtle};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
    background: ${({ theme }) => theme.colors.dangerSoft};
  }
`;

const Preview = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  img {
    max-height: 160px;
    width: auto;
    align-self: flex-start;
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

/** A drag-and-drop uploader. `file` keeps the filename; `image` keeps a data URL. */
export function Uploader({
  value,
  onChange,
  variant = 'file',
  id,
  disabled = false,
  'aria-describedby': describedBy,
}: UploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const isImage = variant === 'image';

  const accept = (file: File | undefined) => {
    if (!file) return;
    if (isImage) {
      const reader = new FileReader();
      reader.onload = () => onChange(String(reader.result));
      reader.readAsDataURL(file);
    } else {
      onChange(file.name);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setOver(false);
    if (!disabled) accept(e.dataTransfer.files?.[0]);
  };

  if (value) {
    return (
      <Preview>
        {isImage && value.startsWith('data:image') ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Uploaded preview" />
        ) : null}
        <FileChip>
          {isImage ? <ImageUp size={18} aria-hidden /> : <FileUp size={18} aria-hidden />}
          <FileName>{isImage ? 'Image attached' : value}</FileName>
          {!disabled && (
            <Remove type="button" aria-label="Remove file" onClick={() => onChange('')}>
              <X size={16} aria-hidden />
            </Remove>
          )}
        </FileChip>
      </Preview>
    );
  }

  return (
    <>
      <Zone
        id={id}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-describedby={describedBy}
        $over={over}
        $disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        <UploadCloud size={24} aria-hidden />
        <Prompt>Drag &amp; drop or click to upload</Prompt>
        <Hint>{isImage ? 'PNG, JPG, GIF' : 'Any file'}</Hint>
      </Zone>
      <input
        ref={inputRef}
        type="file"
        accept={isImage ? 'image/*' : undefined}
        hidden
        disabled={disabled}
        onChange={(e) => accept(e.target.files?.[0])}
      />
    </>
  );
}
