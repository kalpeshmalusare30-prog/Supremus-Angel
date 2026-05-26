'use client';

import { useMemo } from 'react';
import { useTheme } from 'styled-components';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { FormField } from '@/types/field';
import { isNumeric } from '@/utils/format';

export interface DataChartProps {
  fields: FormField[];
}

/** Renders numeric fields as a bar chart. Caller ensures ≥2 numeric fields. */
export function DataChart({ fields }: DataChartProps) {
  const theme = useTheme();

  // Derived once per fields change (TRD §11).
  const data = useMemo(
    () =>
      fields
        .filter(isNumeric)
        .map((f) => ({ name: f.label.trim() || 'Untitled', value: Number(f.value) })),
    [fields],
  );

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: theme.colors.textMuted, fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: theme.colors.border }}
        />
        <YAxis
          tick={{ fill: theme.colors.textMuted, fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <Tooltip
          cursor={{ fill: theme.colors.surfaceContainer }}
          contentStyle={{
            background: theme.colors.tooltipBg,
            border: 'none',
            borderRadius: theme.radii.sm,
            color: theme.colors.tooltipText,
            fontSize: 12,
            fontFamily: theme.fonts.mono,
          }}
          labelStyle={{ color: theme.colors.tooltipText }}
          itemStyle={{ color: theme.colors.tooltipText }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={56}>
          {data.map((entry, index) => (
            <Cell key={`${entry.name}-${index}`} fill={theme.colors.primary} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
