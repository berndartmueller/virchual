import { Component, h, render, toChildArray, VNode, createRef } from 'preact';
import { Controls, LazyLoadImage, Virchual as VirchualCore } from 'virchual';
import { VirchualSlide, VirchualSlideProps } from './slide';

import 'virchual/dist/virchual.css';

export interface Props {
  id?: string;
  children?: VNode<VirchualSlideProps>[] | VNode<VirchualSlideProps>;
}

export class Virchual extends Component<Props> {
  ref = createRef<HTMLDivElement>();

  componentDidMount() {
    const instance = new VirchualCore(this.ref.current, {
      slides: () =>
        toChildArray(this.props.children).map(slide => ref => {
          return render(slide, ref);
        }),
    });

    instance.register(Controls, { isEnabled: true });
    instance.register(LazyLoadImage, { lazyload: true });

    instance.mount();
  }

  render({ id }: Props) {
    return (
      <div ref={this.ref} id={id} class="virchual image-swiper">
        <div class="virchual__frame" style="height: 100%" />

        <button type="button" value="-1" tabIndex={-1} aria-controls="" class="virchual__control virchual__control--prev">
          <svg
            viewBox="0 0 16 16"
            role="presentation"
            aria-hidden="true"
            focusable="false"
            style="height: 20px; width: 20px; display: block; fill: currentcolor"
          >
            <path d="m10.8 16c-.4 0-.7-.1-.9-.4l-6.8-6.7c-.5-.5-.5-1.3 0-1.8l6.8-6.7c.5-.5 1.2-.5 1.7 0s .5 1.2 0 1.7l-5.8 5.9 5.8 5.9c.5.5.5 1.2 0 1.7-.2.3-.5.4-.8.4" />
          </svg>
        </button>

        <button type="button" value="1" tabIndex={-1} aria-controls="" class="virchual__control virchual__control--next">
          <svg
            viewBox="0 0 16 16"
            role="presentation"
            aria-hidden="true"
            focusable="false"
            style="height: 20px; width: 20px; display: block; fill: currentcolor"
          >
            <path d="m5.3 16c .3 0 .6-.1.8-.4l6.8-6.7c.5-.5.5-1.3 0-1.8l-6.8-6.7c-.5-.5-1.2-.5-1.7 0s-.5 1.2 0 1.7l5.8 5.9-5.8 5.9c-.5.5-.5 1.2 0 1.7.2.3.5.4.9.4" />
          </svg>
        </button>
      </div>
    );
  }
}

export { VirchualSlide };
