import { Fragment, ComponentChildren, h } from 'preact';

export interface VirchualSlideProps {
  id?: string;
  children?: ComponentChildren;
}

export function VirchualSlide({ children }: VirchualSlideProps) {
  return <Fragment>{children}</Fragment>;
}
