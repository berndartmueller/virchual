import 'virchual/dist/virchual.css';

import * as React from 'react';
import { Virchual as VirchualCore, Controls, LazyLoadImage } from 'virchual';

import { VirchualSlide, VirchualSlideProps } from './slide';

export interface VirtualProps {
  id?: string;
  children: React.ReactElement<VirchualSlideProps> | React.ReactElement<VirchualSlideProps>[];
}

export interface State {
  slides: string[];
}

export class Virchual extends React.Component<VirtualProps, State> {
  private ref: React.RefObject<HTMLDivElement>;

  constructor(props: VirtualProps) {
    super(props);
    this.ref = React.createRef<HTMLDivElement>();

    const children = props.children || [];
    const slides: string[] = [];

    React.Children.toArray(children).map(child => {
      const html = (child as React.ReactElement<VirchualSlideProps>).props.html;

      if (!html) {
        return;
      }

      slides.push(html);
    });

    this.state = {
      slides,
    };
  }

  componentDidMount() {
    const instance = new VirchualCore(this.ref.current!, {
      slides: () => this.state.slides.slice(1),
    });

    instance.mount();
    instance.register(Controls, { isEnabled: true });
    instance.register(LazyLoadImage, { lazyload: true });
  }

  render() {
    const { id, children } = this.props;

    return (
      <div ref={this.ref} id={id} className="virchual image-swiper">
        <div className="virchual__frame" style={{ height: '100%' }}>
          {React.Children.toArray(children)?.map((child, index) => {
            if (index > 0) {
              return null;
            }

            return child;
          })}
        </div>

        <button type="button" value="-1" tabIndex={-1} aria-controls="" className="virchual__control virchual__control--prev">
          <svg
            viewBox="0 0 16 16"
            role="presentation"
            aria-hidden="true"
            focusable="false"
            style={{
              height: '20px',
              width: '20px',
              display: 'block',
              fill: 'white',
            }}
          >
            <path d="m10.8 16c-.4 0-.7-.1-.9-.4l-6.8-6.7c-.5-.5-.5-1.3 0-1.8l6.8-6.7c.5-.5 1.2-.5 1.7 0s .5 1.2 0 1.7l-5.8 5.9 5.8 5.9c.5.5.5 1.2 0 1.7-.2.3-.5.4-.8.4" />
          </svg>
        </button>

        <button type="button" value="1" tabIndex={-1} aria-controls="" className="virchual__control virchual__control--next">
          <svg
            viewBox="0 0 16 16"
            role="presentation"
            aria-hidden="true"
            focusable="false"
            style={{
              height: '20px',
              width: '20px',
              display: 'block',
              fill: 'white',
            }}
          >
            <path d="m5.3 16c .3 0 .6-.1.8-.4l6.8-6.7c.5-.5.5-1.3 0-1.8l-6.8-6.7c-.5-.5-1.2-.5-1.7 0s-.5 1.2 0 1.7l5.8 5.9-5.8 5.9c-.5.5-.5 1.2 0 1.7.2.3.5.4.9.4" />
          </svg>
        </button>
      </div>
    );
  }
}

export { VirchualSlide };
