'use client';

import React from 'react';
import type { FieldType } from '@/types/field';
import { FIELD_GROUPS, typesInGroup } from '@/lib/fieldTypes';
import { Modal } from '@/components/ui';
import {
  Grid,
  Group,
  GroupLabel,
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

/** Modal field-type catalogue, opened from "Add field". */
export function FieldTypePicker({ open, onClose, onSelect }: FieldTypePickerProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a field"
      description="Choose the kind of data you want to capture."
      size="lg"
    >
      <Stack>
        {FIELD_GROUPS.map((group) => (
          <Group key={group}>
            <GroupLabel>{group}</GroupLabel>
            <Grid>
              {typesInGroup(group).map((def) => {
                const Icon = def.icon;
                return (
                  <Tile key={def.type} type="button" onClick={() => onSelect(def.type)}>
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
    </Modal>
  );
}
