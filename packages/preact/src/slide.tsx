import { h } from 'preact';

export interface VirchualSlideProps {
  html?: string;
}

export function VirchualSlide({ html }: VirchualSlideProps) {
  // eslint-disable-next-line react/no-danger
  return <div class="virchual__slide" dangerouslySetInnerHTML={{ __html: html || '' }} />;
}
