'use client';

import React, { forwardRef } from 'react';
import styled from 'styled-components';

export interface SelectOption {
  value: string;
  label: string;
}

/** A labelled set of options, rendered as an <optgroup>. */
export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Flat options. Mutually exclusive with `groups`. */
  options?: SelectOption[];
  /** Grouped options, rendered as <optgroup>s. */
  groups?: SelectGroup[];
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  /* Chevron cue. */
  &::after {
    content: '';
    position: absolute;
    right: 12px;
    width: 8px;
    height: 8px;
    border-right: 2px solid ${({ theme }) => theme.colors.textSubtle};
    border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
    transform: translateY(-2px) rotate(45deg);
    pointer-events: none;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  height: 44px;
  padding: 0 32px 0 12px;
  appearance: none;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

/** Native, themed select. Accepts flat `options` or grouped `groups`. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, groups, ...rest },
  ref,
) {
  return (
    <Wrapper>
      <StyledSelect ref={ref} {...rest}>
        {groups
          ? groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))
          : options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
      </StyledSelect>
    </Wrapper>
  );
});
