'use client';

import React from 'react';
import type { FormField } from '@/types/field';
import { getFieldType } from '@/lib/fieldTypes';
import {
  AddressAutocomplete,
  Captcha,
  CheckboxGroup,
  DatePicker,
  DateRangePicker,
  Input,
  MapPicker,
  MultiSelect,
  OtpInput,
  RadioGroup,
  RangeSlider,
  RichTextEditor,
  Segmented,
  Select,
  Stepper,
  TagInput,
  Textarea,
  Toggle,
  Uploader,
} from '@/components/ui';

// Year picker options: a sensible window around the current year.
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 121 }, (_, i) => String(CURRENT_YEAR + 5 - i));

export interface FieldInputProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  hasError?: boolean;
  disabled?: boolean;
  /** Overrides the field's own placeholder. */
  placeholder?: string;
  ariaDescribedBy?: string;
  onBlur?: () => void;
}

/**
 * Renders the right value control for a field's type — shared by the settings
 * modal (default value), the live preview, and the published form.
 */
export function FieldInput({
  field,
  value,
  onChange,
  id,
  hasError = false,
  disabled = false,
  placeholder,
  ariaDescribedBy,
  onBlur,
}: FieldInputProps) {
  const def = getFieldType(field.type);
  const ph = placeholder ?? field.placeholder ?? def.placeholder;
  const options = field.options ?? [];

  switch (def.control) {
    case 'calendar':
      return (
        <DatePicker
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          hasError={hasError}
          placeholder={ph}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'select':
      return (
        <Select
          id={id}
          value={value}
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
          options={[
            { value: '', label: ph || 'Select an option' },
            ...options.map((o) => ({ value: o, label: o })),
          ]}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'segmented':
      return (
        <Segmented
          id={id}
          value={value}
          options={options}
          disabled={disabled}
          onChange={onChange}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'range':
      return (
        <RangeSlider
          id={id}
          value={value}
          disabled={disabled}
          onChange={onChange}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'stepper':
      return (
        <Stepper
          id={id}
          value={value}
          disabled={disabled}
          onChange={onChange}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'checkboxes':
      return (
        <CheckboxGroup
          id={id}
          value={value}
          options={options}
          disabled={disabled}
          onChange={onChange}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'multiselect':
      return (
        <MultiSelect
          id={id}
          value={value}
          options={options}
          disabled={disabled}
          onChange={onChange}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'tags':
      return (
        <TagInput
          id={id}
          value={value}
          placeholder={ph}
          disabled={disabled}
          onChange={onChange}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'otp':
      return (
        <OtpInput
          id={id}
          value={value}
          disabled={disabled}
          onChange={onChange}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'year':
      return (
        <Select
          id={id}
          value={value}
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
          options={[{ value: '', label: ph || 'Select a year' }, ...YEAR_OPTIONS.map((y) => ({ value: y, label: y }))]}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'daterange':
      return (
        <DateRangePicker
          id={id}
          value={value}
          disabled={disabled}
          hasError={hasError}
          onChange={onChange}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'file':
      return (
        <Uploader
          id={id}
          variant="file"
          value={value}
          disabled={disabled}
          onChange={onChange}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'image':
      return (
        <Uploader
          id={id}
          variant="image"
          value={value}
          disabled={disabled}
          onChange={onChange}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'richtext':
      return (
        <RichTextEditor
          id={id}
          value={value}
          onChange={onChange}
          placeholder={ph}
          disabled={disabled}
          hasError={hasError}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'map':
      return (
        <MapPicker
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'addressauto':
      return (
        <AddressAutocomplete
          id={id}
          value={value}
          onChange={onChange}
          placeholder={ph}
          disabled={disabled}
          hasError={hasError}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'captcha':
      return (
        <Captcha
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'radio':
      return (
        <RadioGroup
          id={id}
          value={value}
          options={options}
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
          onChange={onChange}
        />
      );
    case 'toggle':
      return (
        <Toggle
          id={id}
          checked={value === 'true'}
          onCheckedChange={(c) => onChange(c ? 'true' : 'false')}
          disabled={disabled}
          aria-label={field.label || 'Value'}
          aria-describedby={ariaDescribedBy}
        />
      );
    case 'textarea':
      return (
        <Textarea
          id={id}
          value={value}
          rows={def.rows}
          placeholder={ph}
          hasError={hasError}
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      );
    case 'input':
    default:
      return (
        <Input
          id={id}
          type={def.inputType ?? 'text'}
          inputMode={def.inputMode}
          value={value}
          placeholder={ph}
          hasError={hasError}
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      );
  }
}
