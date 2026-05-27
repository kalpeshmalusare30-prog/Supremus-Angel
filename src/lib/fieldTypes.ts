// Single source of truth for every field type the builder supports.
// Add a type here (plus the union in @/types/field and, if it needs custom
// rules, a case in @/lib/validators) and it shows up everywhere: the
// "Add field" picker, the per-row Type selector, the input control, and the
// live preview. Presentation lives here; validation lives in validators.ts.

import {
  AlignLeft,
  ArrowUpDown,
  Calendar,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  ChevronDownSquare,
  CircleDot,
  Clock,
  Code,
  DollarSign,
  FileText,
  FileUp,
  Map as MapIcon,
  Navigation,
  ShieldCheck,
  Hash,
  Heading1,
  Heading2,
  Heading as HeadingIcon,
  Image as ImageIcon,
  ImagePlus,
  KeyRound,
  Link as LinkIcon,
  ListChecks,
  Lock,
  Mail,
  MapPin,
  PanelTop,
  Percent,
  Phone,
  Pilcrow,
  Rows3,
  Search,
  SeparatorHorizontal,
  SlidersHorizontal,
  SquareStack,
  Star,
  Tags as TagsIcon,
  ToggleLeft,
  Type as TypeIcon,
  Video as VideoIcon,
  type LucideIcon,
} from 'lucide-react';
import type { FieldType } from '@/types/field';

/** Which control renders for the value. */
export type FieldControl =
  | 'input'
  | 'textarea'
  | 'toggle'
  | 'select'
  | 'radio'
  | 'calendar'
  | 'range'
  | 'stepper'
  | 'segmented'
  | 'checkboxes'
  | 'multiselect'
  | 'tags'
  | 'otp'
  | 'year'
  | 'daterange'
  | 'file'
  | 'image'
  | 'richtext'
  | 'map'
  | 'addressauto'
  | 'captcha'
  | 'display';

export interface FieldTypeDef {
  type: FieldType;
  /** Human label shown in the picker and the Type selector. */
  label: string;
  /** Grouping for the picker and the selector's optgroups. */
  group: FieldGroup;
  /** Icon for the picker tile and the row badge. */
  icon: LucideIcon;
  /** Value control to render. */
  control: FieldControl;
  /** `type` attribute when control is `input` (defaults to "text"). */
  inputType?: string;
  /** Soft keyboard hint on mobile. */
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'email' | 'url';
  /** Placeholder for the value control. */
  placeholder?: string;
  /** One-line helper shown under the label in the picker. */
  description: string;
  /** Visible rows for textarea controls. */
  rows?: number;
}

/** Ordered groups — controls section order in the picker and the selector. */
export type FieldGroup =
  | 'Text'
  | 'Number'
  | 'Date & time'
  | 'Choice'
  | 'Contact'
  | 'Advanced'
  | 'Media & smart'
  | 'Layout';
export const FIELD_GROUPS: FieldGroup[] = [
  'Text',
  'Number',
  'Date & time',
  'Choice',
  'Contact',
  'Advanced',
  'Media & smart',
  'Layout',
];

/** The catalogue, in display order. */
export const FIELD_TYPES: FieldTypeDef[] = [
  {
    type: 'text',
    label: 'Short text',
    group: 'Text',
    icon: TypeIcon,
    control: 'input',
    placeholder: 'Enter a value',
    description: 'A single line of text.',
  },
  {
    type: 'textarea',
    label: 'Paragraph',
    group: 'Text',
    icon: AlignLeft,
    control: 'textarea',
    placeholder: 'Enter a longer response…',
    description: 'Multiple lines of text.',
    rows: 3,
  },
  {
    type: 'email',
    label: 'Email',
    group: 'Text',
    icon: Mail,
    control: 'input',
    inputType: 'email',
    inputMode: 'email',
    placeholder: 'name@domain.com',
    description: 'An email address, validated.',
  },
  {
    type: 'url',
    label: 'Website',
    group: 'Text',
    icon: LinkIcon,
    control: 'input',
    inputType: 'url',
    inputMode: 'url',
    placeholder: 'https://example.com',
    description: 'A web address, validated.',
  },
  {
    type: 'phone',
    label: 'Phone number',
    group: 'Text',
    icon: Phone,
    control: 'input',
    inputType: 'tel',
    inputMode: 'tel',
    placeholder: '+1 555 123 4567',
    description: 'A telephone number.',
  },
  {
    type: 'password',
    label: 'Password',
    group: 'Text',
    icon: Lock,
    control: 'input',
    inputType: 'password',
    placeholder: '••••••••',
    description: 'A masked secret value.',
  },
  {
    type: 'search',
    label: 'Search',
    group: 'Text',
    icon: Search,
    control: 'input',
    inputType: 'search',
    placeholder: 'Search…',
    description: 'A search query box.',
  },
  {
    type: 'number',
    label: 'Number',
    group: 'Number',
    icon: Hash,
    control: 'input',
    inputMode: 'decimal',
    placeholder: '42',
    description: 'Any numeric value.',
  },
  {
    type: 'currency',
    label: 'Currency',
    group: 'Number',
    icon: DollarSign,
    control: 'input',
    inputMode: 'decimal',
    placeholder: '0.00',
    description: 'An amount of money.',
  },
  {
    type: 'rating',
    label: 'Rating',
    group: 'Number',
    icon: Star,
    control: 'input',
    inputMode: 'numeric',
    placeholder: '1–5',
    description: 'A score from 1 to 5.',
  },
  {
    type: 'percentage',
    label: 'Percentage',
    group: 'Number',
    icon: Percent,
    control: 'input',
    inputMode: 'decimal',
    placeholder: '0',
    description: 'A percentage value.',
  },
  {
    type: 'range',
    label: 'Range slider',
    group: 'Number',
    icon: SlidersHorizontal,
    control: 'range',
    description: 'A value chosen on a slider (0–100).',
  },
  {
    type: 'stepper',
    label: 'Stepper',
    group: 'Number',
    icon: ArrowUpDown,
    control: 'stepper',
    description: 'A number with + / − buttons.',
  },
  {
    type: 'date',
    label: 'Date',
    group: 'Date & time',
    icon: Calendar,
    control: 'calendar',
    placeholder: 'Pick a date',
    description: 'A calendar date.',
  },
  {
    type: 'time',
    label: 'Time',
    group: 'Date & time',
    icon: Clock,
    control: 'input',
    inputType: 'time',
    description: 'A time of day.',
  },
  {
    type: 'datetime',
    label: 'Date & time',
    group: 'Date & time',
    icon: CalendarClock,
    control: 'input',
    inputType: 'datetime-local',
    description: 'A date with a time.',
  },
  {
    type: 'month',
    label: 'Month',
    group: 'Date & time',
    icon: CalendarDays,
    control: 'input',
    inputType: 'month',
    description: 'A month and year.',
  },
  {
    type: 'week',
    label: 'Week',
    group: 'Date & time',
    icon: CalendarRange,
    control: 'input',
    inputType: 'week',
    description: 'A calendar week.',
  },
  {
    type: 'year',
    label: 'Year',
    group: 'Date & time',
    icon: CalendarDays,
    control: 'year',
    placeholder: 'Select a year',
    description: 'A single year.',
  },
  {
    type: 'daterange',
    label: 'Date range',
    group: 'Date & time',
    icon: CalendarRange,
    control: 'daterange',
    description: 'A start and end date.',
  },
  {
    type: 'boolean',
    label: 'Yes / No',
    group: 'Choice',
    icon: ToggleLeft,
    control: 'toggle',
    description: 'A true / false switch.',
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    group: 'Choice',
    icon: ChevronDownSquare,
    control: 'select',
    placeholder: 'Select an option',
    description: 'Pick one from a list.',
  },
  {
    type: 'radio',
    label: 'Radio',
    group: 'Choice',
    icon: CircleDot,
    control: 'radio',
    description: 'Pick one of a few options.',
  },
  {
    type: 'checkboxes',
    label: 'Checkboxes',
    group: 'Choice',
    icon: ListChecks,
    control: 'checkboxes',
    description: 'Pick several from a list.',
  },
  {
    type: 'multiselect',
    label: 'Multi-select',
    group: 'Choice',
    icon: SquareStack,
    control: 'multiselect',
    description: 'Pick several as chips.',
  },
  {
    type: 'likert',
    label: 'Likert scale',
    group: 'Choice',
    icon: Rows3,
    control: 'segmented',
    description: 'Agree / disagree scale.',
  },
  {
    type: 'address',
    label: 'Address',
    group: 'Contact',
    icon: MapPin,
    control: 'textarea',
    placeholder: 'Street, city, state, ZIP',
    description: 'A postal address.',
    rows: 3,
  },
  {
    type: 'tags',
    label: 'Tags',
    group: 'Advanced',
    icon: TagsIcon,
    control: 'tags',
    placeholder: 'Type and press Enter…',
    description: 'Free-form chips / keywords.',
  },
  {
    type: 'otp',
    label: 'OTP / PIN',
    group: 'Advanced',
    icon: KeyRound,
    control: 'otp',
    description: 'A one-time code or PIN.',
  },
  {
    type: 'file',
    label: 'File upload',
    group: 'Advanced',
    icon: FileUp,
    control: 'file',
    description: 'Attach a file (drag & drop).',
  },
  {
    type: 'image',
    label: 'Image upload',
    group: 'Advanced',
    icon: ImagePlus,
    control: 'image',
    description: 'Upload an image with preview.',
  },
  {
    type: 'richtext',
    label: 'Rich text',
    group: 'Media & smart',
    icon: FileText,
    control: 'richtext',
    placeholder: 'Write something…',
    description: 'Formatted text (bold, lists, links).',
  },
  {
    type: 'map',
    label: 'Location (map)',
    group: 'Media & smart',
    icon: MapIcon,
    control: 'map',
    description: 'Pick a point on an OpenStreetMap.',
  },
  {
    type: 'addressauto',
    label: 'Address autocomplete',
    group: 'Media & smart',
    icon: Navigation,
    control: 'addressauto',
    placeholder: 'Start typing an address…',
    description: 'Search addresses via OpenStreetMap.',
  },
  {
    type: 'captcha',
    label: 'Captcha',
    group: 'Media & smart',
    icon: ShieldCheck,
    control: 'captcha',
    description: 'A simple human-check (demo only).',
  },
  {
    type: 'heading',
    label: 'Heading',
    group: 'Layout',
    icon: Heading1,
    control: 'display',
    description: 'A large title.',
  },
  {
    type: 'subheading',
    label: 'Subheading',
    group: 'Layout',
    icon: Heading2,
    control: 'display',
    description: 'A smaller title.',
  },
  {
    type: 'sectionheader',
    label: 'Section header',
    group: 'Layout',
    icon: HeadingIcon,
    control: 'display',
    description: 'A titled section divider.',
  },
  {
    type: 'description',
    label: 'Description text',
    group: 'Layout',
    icon: Pilcrow,
    control: 'display',
    description: 'A block of help text.',
  },
  {
    type: 'divider',
    label: 'Divider',
    group: 'Layout',
    icon: SeparatorHorizontal,
    control: 'display',
    description: 'A horizontal rule.',
  },
  {
    type: 'imageblock',
    label: 'Image',
    group: 'Layout',
    icon: ImageIcon,
    control: 'display',
    description: 'A static image by URL.',
  },
  {
    type: 'video',
    label: 'Video embed',
    group: 'Layout',
    icon: VideoIcon,
    control: 'display',
    description: 'An embedded video by URL.',
  },
  {
    type: 'html',
    label: 'HTML block',
    group: 'Layout',
    icon: Code,
    control: 'display',
    description: 'Custom HTML content.',
  },
  {
    type: 'progress',
    label: 'Progress bar',
    group: 'Layout',
    icon: PanelTop,
    control: 'display',
    description: 'A static progress bar.',
  },
];

/** Fast lookup by type. */
export const FIELD_TYPE_MAP: Record<FieldType, FieldTypeDef> = FIELD_TYPES.reduce(
  (acc, def) => {
    acc[def.type] = def;
    return acc;
  },
  {} as Record<FieldType, FieldTypeDef>,
);

/** Definition for a type (falls back to "text" defensively). */
export function getFieldType(type: FieldType): FieldTypeDef {
  return FIELD_TYPE_MAP[type] ?? FIELD_TYPE_MAP.text;
}

/** True for layout/display elements that carry no respondent value. */
export function isDisplayType(type: FieldType): boolean {
  return getFieldType(type).control === 'display';
}

/** Initial value for a freshly added field of the given type. */
export function defaultValueFor(type: FieldType): string {
  switch (type) {
    case 'boolean':
      return 'false';
    case 'range':
      return '50';
    case 'stepper':
      return '0';
    case 'checkboxes':
    case 'multiselect':
    case 'tags':
      return '[]';
    case 'progress':
      return '50';
    case 'description':
      return 'Add a short description to guide respondents.';
    default:
      return '';
  }
}

/** Types in a group, preserving registry order. */
export function typesInGroup(group: FieldGroup): FieldTypeDef[] {
  return FIELD_TYPES.filter((def) => def.group === group);
}
