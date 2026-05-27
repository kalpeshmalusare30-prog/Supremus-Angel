'use client';

import React from 'react';
import styled from 'styled-components';
import type { FormField } from '@/types/field';

export interface DisplayBlockProps {
  field: FormField;
}

const Heading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.h1};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
  color: ${({ theme }) => theme.colors.text};
`;

const Subheading = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.h2};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const SectionHeader = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: ${({ theme }) => theme.letterSpacings.label};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSubtle};

  &::after {
    content: '';
    flex: 1 1 auto;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

const Paragraph = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  line-height: ${({ theme }) => theme.lineHeights.body};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: pre-line;
`;

const Rule = styled.hr`
  width: 100%;
  height: 1px;
  border: none;
  background: ${({ theme }) => theme.colors.border};
`;

const Img = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const VideoWrap = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceMuted};

  iframe,
  video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const Html = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.text};

  a {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 10px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border-radius: ${({ theme }) => theme.radii.full};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $pct: number }>`
  width: ${({ $pct }) => $pct}%;
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.full};
  transition: width ${({ theme }) => theme.transitions.base};
`;

const ProgressLabel = styled.div`
  margin-top: 4px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  color: ${({ theme }) => theme.colors.textSubtle};
`;


/** Builds an embeddable src for common video providers, else returns the URL. */
function embedSrc(url: string): string {
  const yt = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/.exec(url);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = /vimeo\.com\/(\d+)/.exec(url);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

const isFileVideo = (url: string) => /\.(mp4|webm|ogg)(\?|$)/i.test(url);

/** Renders a non-input layout/display element from its configured content. */
export function DisplayBlock({ field }: DisplayBlockProps) {
  // Heading-style elements use the Label as their text; richer elements
  // (description, media, progress) store content in defaultValue.
  const content = field.defaultValue;

  switch (field.type) {
    case 'heading':
      return <Heading>{field.label || 'Heading'}</Heading>;
    case 'subheading':
      return <Subheading>{field.label || 'Subheading'}</Subheading>;
    case 'sectionheader':
      return <SectionHeader>{field.label || 'Section'}</SectionHeader>;
    case 'description':
      return <Paragraph>{content}</Paragraph>;
    case 'divider':
      return <Rule />;
    case 'imageblock':
      // eslint-disable-next-line @next/next/no-img-element
      return content ? <Img src={content} alt={field.label || 'Image'} /> : <Paragraph>Set an image URL.</Paragraph>;
    case 'video':
      if (!content) return <Paragraph>Set a video URL.</Paragraph>;
      return (
        <VideoWrap>
          {isFileVideo(content) ? (
            <video controls src={content} />
          ) : (
            <iframe
              src={embedSrc(content)}
              title={field.label || 'Embedded video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </VideoWrap>
      );
    case 'html':
      return <Html dangerouslySetInnerHTML={{ __html: content }} />;
    case 'progress': {
      const pct = Math.min(100, Math.max(0, Number(content) || 0));
      return (
        <div>
          <ProgressTrack>
            <ProgressFill $pct={pct} />
          </ProgressTrack>
          <ProgressLabel>{pct}%</ProgressLabel>
        </div>
      );
    }
    default:
      return null;
  }
}
