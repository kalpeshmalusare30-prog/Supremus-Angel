'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Crosshair, X } from 'lucide-react';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapPickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  'aria-describedby'?: string;
}

/** Parses a stored "lat,lng" value, or null when absent/malformed. */
function parseLatLng(value: string): [number, number] | null {
  const m = /^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/.exec(value.trim());
  if (!m) return null;
  const lat = Number(m[1]);
  const lng = Number(m[2]);
  return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
}

const PIN_HTML =
  '<div style="width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);' +
  'background:#a12c8c;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MapBox = styled.div`
  height: 300px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceMuted};

  /* Keep Leaflet controls/tiles under app chrome (top nav, modals). */
  .leaflet-pane,
  .leaflet-top,
  .leaflet-bottom {
    z-index: 1;
  }
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  min-height: 32px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  color: ${({ theme }) => theme.colors.textMuted};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

/**
 * Map location picker on OpenStreetMap tiles via Leaflet (no API key). Click
 * to drop a pin; the chosen point is stored as "lat,lng". Leaflet is imported
 * lazily on the client so it never runs during SSR.
 */
export function MapPicker({
  id,
  value,
  onChange,
  disabled = false,
  'aria-describedby': ariaDescribedBy,
}: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const placeRef = useRef<(lat: number, lng: number) => void>(() => {});
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [coords, setCoords] = useState<[number, number] | null>(() => parseLatLng(value));

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const initial = parseLatLng(value);
      const map = L.map(containerRef.current, { zoomControl: true }).setView(
        initial ?? [20, 0],
        initial ? 13 : 2,
      );
      mapRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({ className: '', html: PIN_HTML, iconSize: [16, 16], iconAnchor: [8, 16] });
      placeRef.current = (lat, lng) => {
        if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
        else markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
      };
      if (initial) placeRef.current(initial[0], initial[1]);

      if (!disabled) {
        map.on('click', (e) => {
          const lat = Number(e.latlng.lat.toFixed(6));
          const lng = Number(e.latlng.lng.toFixed(6));
          placeRef.current(lat, lng);
          setCoords([lat, lng]);
          onChangeRef.current(`${lat},${lng}`);
        });
      }
      setTimeout(() => map.invalidateSize(), 0);
      cleanup = () => {
        map.remove();
        mapRef.current = null;
        markerRef.current = null;
      };
    })().catch(() => {
      // Leaflet failed to initialise (e.g. offline) — the field still saves
      // coordinates set via "Use my location".
    });
    return () => {
      cancelled = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useMyLocation = () => {
    if (disabled || typeof navigator === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = Number(pos.coords.latitude.toFixed(6));
      const lng = Number(pos.coords.longitude.toFixed(6));
      mapRef.current?.setView([lat, lng], 14);
      placeRef.current(lat, lng);
      setCoords([lat, lng]);
      onChange(`${lat},${lng}`);
    });
  };

  const clear = () => {
    markerRef.current?.remove();
    markerRef.current = null;
    setCoords(null);
    onChange('');
  };

  return (
    <Wrap>
      <MapBox ref={containerRef} id={id} role="application" aria-describedby={ariaDescribedBy} />
      <Bar>
        {coords ? (
          <span>
            📍 {coords[0]}, {coords[1]}
          </span>
        ) : (
          <span>Click the map to drop a pin.</span>
        )}
        {!disabled && (
          <>
            <Chip type="button" onClick={useMyLocation}>
              <Crosshair size={14} aria-hidden />
              Use my location
            </Chip>
            {coords && (
              <Chip type="button" onClick={clear}>
                <X size={14} aria-hidden />
                Clear
              </Chip>
            )}
          </>
        )}
      </Bar>
    </Wrap>
  );
}
