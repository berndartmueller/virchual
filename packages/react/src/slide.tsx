import * as React from 'react';

export interface VirchualSlideProps {
  html?: string;
}

export function VirchualSlide({ html }: VirchualSlideProps) {
  // eslint-disable-next-line react/no-danger
  return (
    <div
      className="virchual__slide"
      dangerouslySetInnerHTML={{ __html: html || '' }}
    />
  );
}
