import { ComponentDependencies } from './../component';
import { slidingWindow, range } from '@virchual/utils/index';

export type LazyLoadImageSettings = {
  /**
   * Enables lazyloading imagest that are currently not visible, thus saving bandwidth.
   */
  lazyload?: boolean;

  /**
   * The CSS selector for lazyloaded images. Default 'img,picture'
   */
  lazyloadSelector?: string;
};

const LAZY_CLASSNAME = 'virchual__lazy';
const LOADING_CLASSNAME = `${LAZY_CLASSNAME}--loading`;
const ERROR_CLASSNAME = `${LAZY_CLASSNAME}--failed`;
const COMPLETE_CLASSNAME = `${LAZY_CLASSNAME}--loaded`;

/**
 * Return true if given elemen is a <picture> tag.
 *
 * @param element HTML Element.
 */
function isPictureTag(element: HTMLElement): boolean {
  return element && element.nodeName.toLowerCase() === 'picture';
}

/**
 * Return either parent <picture> tag or <img> tag.
 *
 * @param element Image HTML tag.
 */
function getImage(image: HTMLImageElement | HTMLPictureElement): HTMLImageElement | HTMLPictureElement {
  const picture = image.parentNode as HTMLElement;

  if (isPictureTag(picture)) {
    return picture;
  }

  return image;
}

export class LazyLoadImage {
  private lazyload: boolean;
  private lazyloadSelector: string;
  private events: {
    load: LazyLoadImage['onLoad'];
    error: LazyLoadImage['onError'];
  };

  constructor(private imports: ComponentDependencies, settings: LazyLoadImageSettings) {
    const { lazyload, lazyloadSelector } = {
      lazyload: true,
      lazyloadSelector: 'img,picture',
      ...settings,
    };

    this.lazyload = lazyload;
    this.lazyloadSelector = lazyloadSelector;
    this.events = {
      load: this.onLoad.bind(this),
      error: this.onError.bind(this),
    };

    // exit in case lazy loading is disabled
    if (!this.lazyload) {
      return;
    }

    imports.eventBus.on({
      mounted: () => {
        this.doLazyLoad();
      },
      move: () => {
        this.doLazyLoad();
      },
    });
  }

  /**
   * Lazy load images.
   */
  private doLazyLoad(): void {
    const images = this.getImages();

    images.forEach(image => this.loadImage(image));
  }

  /**
   * Get all image tags (<img>, <picture>) to lazy load.
   */
  private getImages() {
    const indices = range(0, this.imports.virchual.slides.length - 1);
    const slidesWindowIndices = slidingWindow(indices, this.imports.virchual.currentIndex, 1);

    const images: Array<HTMLImageElement | HTMLPictureElement> = [];

    slidesWindowIndices.forEach(index => {
      const slide = this.imports.virchual.slides[index];

      if (!slide.isMounted) {
        return;
      }

      [].forEach.call(slide.ref.querySelectorAll(this.lazyloadSelector), (img: HTMLElement) => {
        // skip <img> tags within <picture> tags
        if (isPictureTag(img.parentElement)) {
          return;
        }

        images.push(img);
      });
    });

    return images;
  }

  /**
   * Do the actual lazy loading for a given image.
   *
   * @param image Either <img> or <picture> tag.
   */
  private loadImage(image: HTMLImageElement | HTMLPictureElement) {
    let hasLazyImages = false;

    [].forEach.call(image.querySelectorAll('img,source'), (source: HTMLImageElement | HTMLSourceElement) => {
      const srcSetData = source.dataset.srcset;
      const srcData = source.dataset.src;

      if (srcSetData) {
        source.setAttribute('srcset', srcSetData);
        source.removeAttribute('data-srcset');
      }

      // source is <img>
      if (srcData) {
        source.setAttribute('src', source.dataset.src);
        source.removeAttribute('data-src');

        this.imports.eventBus.on(this.events, source);
      }

      if (srcSetData || srcData) {
        hasLazyImages = true;
      }
    });

    if (hasLazyImages) {
      image.classList.add(LAZY_CLASSNAME);
      image.classList.add(LOADING_CLASSNAME);
    }
  }

  private onLoad(event: Event) {
    const image = event.target as HTMLImageElement;

    this.completeLoading(image);
  }

  private onError(event: Event) {
    const image = event.target as HTMLImageElement;
    const target = getImage(image);

    target.classList.add(ERROR_CLASSNAME);

    this.completeLoading(image);
  }

  private completeLoading(image: HTMLImageElement) {
    const target = getImage(image);

    target.classList.remove(LOADING_CLASSNAME);
    target.classList.add(COMPLETE_CLASSNAME);

    this.imports.eventBus.off(this.events, image);
  }
}
