import { ComponentDependencies } from './../component';

export type LazyLoadImageSettings = {
  /**
   * Enables lazyloading imagest that are currently not visible, thus saving bandwidth.
   */
  lazyload?: boolean;

  /**
   * The CSS selector for lazyloaded images. Default 'img,picture'
   */
  lazyloadSelector?: string;

  /**
   * How many images should get eagerly loaded on both sides of current slide.
   */
  loadEager?: number;
};

export class LazyLoadImage {
  private lazyload: boolean;
  private lazyloadSelector: string;
  private loadEager: number;

  constructor(private imports: ComponentDependencies, settings: LazyLoadImageSettings) {
    const { lazyload, lazyloadSelector, loadEager } = {
      lazyload: true,
      lazyloadSelector: 'img,picture',
      loadEager: 1,
      ...settings,
    };

    this.lazyload = lazyload;
    this.lazyloadSelector = lazyloadSelector;
    this.loadEager = loadEager;

    imports.eventBus.on('mounted', () => {
      this.lazyLoad();
    });

    imports.eventBus.on('move', () => {
      this.lazyLoad();
    });
  }

  private lazyLoad(): void {
    const images = this.getImages(this.imports.virchual.currentIndex, this.imports.virchual.currentIndex + 1);

    images.forEach(image => {
      this.loadImage(image);
    });
  }

  private loadImage(image: HTMLImageElement) {
    // @todo handle picture and img element slightly different

    [].forEach.call(image.getElementsByTagName('source'), (source: HTMLSourceElement) => {
      const dataSrc = source.dataset.srcset;

      if (dataSrc) {
        source.setAttribute('srcset', dataSrc);

        source.removeAttribute('data-srcset');
      }
    });

    image.classList.add('loading');
  }

  private getImages(start: number, end: number) {
    if (start - this.loadEager >= 0) {
      start = start - this.loadEager;
    }

    if (this.imports.virchual.slides.length > end + this.loadEager) {
      end = end + this.loadEager;
    }

    const images = [];

    while (start <= end) {
      const slide = this.imports.virchual.slides[start];

      start++;

      if (!slide.isMounted) {
        continue;
      }

      [].forEach.call(slide.ref.querySelectorAll(this.lazyloadSelector), (img: HTMLElement) => {
        images.push(img);
      });
    }

    return images;
  }
}
