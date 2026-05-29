'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import type { FieldType } from '@/types/field';
import { FIELD_GROUPS, typesInGroup } from '@/lib/fieldTypes';
import { Modal } from '@/components/ui';
import {
  Grid,
  Group,
  GroupLabel,
  SearchWrap,
  Stack,
  Tile,
  TileDesc,
  TileIcon,
  TileLabel,
  TileText,
} from './FieldTypePicker.styles';

export interface FieldTypePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: FieldType) => void;
}

/** Modal field-type catalogue with search (IMP-002), opened from "Add field". */
export function FieldTypePicker({ open, onClose, onSelect }: FieldTypePickerProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();

  // Filter groups and their types by the search query.
  const visibleGroups = useMemo(() => {
    if (!q) return FIELD_GROUPS.map((g) => ({ group: g, types: typesInGroup(g) }));
    return FIELD_GROUPS
      .map((g) => ({
        group: g,
        types: typesInGroup(g).filter(
          (def) =>
            def.label.toLowerCase().includes(q) ||
            def.description.toLowerCase().includes(q) ||
            def.type.toLowerCase().includes(q),
        ),
      }))
      .filter(({ types }) => types.length > 0);
  }, [q]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add a field"
      description="Choose the kind of data you want to capture."
      size="lg"
    >
      {/* IMP-002: Real-time search across all field types. */}
      <SearchWrap>
        <Search size={16} aria-hidden />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search field types…"
          aria-label="Search field types"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              if (query) {
                setQuery('');
              } else {
                handleClose();
              }
            }
          }}
        />
      </SearchWrap>

      {visibleGroups.length === 0 ? (
        <Stack>
          <Group>
            <GroupLabel>No results for &ldquo;{query}&rdquo;</GroupLabel>
          </Group>
        </Stack>
      ) : (
        <Stack>
          {visibleGroups.map(({ group, types }) => (
            <Group key={group}>
              <GroupLabel>{group}</GroupLabel>
              <Grid>
                {types.map((def) => {
                  const Icon = def.icon;
                  return (
                    <Tile key={def.type} type="button" onClick={() => { setQuery(''); onSelect(def.type); }}>
                      <TileIcon>
                        <Icon size={20} aria-hidden />
                      </TileIcon>
                      <TileText>
                        <TileLabel>{def.label}</TileLabel>
                        <TileDesc>{def.description}</TileDesc>
                      </TileText>
                    </Tile>
                  );
                })}
              </Grid>
            </Group>
          ))}
        </Stack>
      )}
    </Modal>
  );
}
