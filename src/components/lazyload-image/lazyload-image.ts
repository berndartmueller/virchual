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
  private _lazyload: boolean;
  private _lazyloadSelector: string;
  private _events: {
    load: LazyLoadImage['_onLoad'];
    error: LazyLoadImage['_onError'];
  };

  constructor(private _imports: ComponentDependencies, _settings: LazyLoadImageSettings) {
    const { lazyload, lazyloadSelector } = {
      lazyload: true,
      lazyloadSelector: 'img,picture',
      ..._settings,
    };

    this._lazyload = lazyload;
    this._lazyloadSelector = lazyloadSelector;
    this._events = {
      load: this._onLoad.bind(this),
      error: this._onError.bind(this),
    };

    // exit in case lazy loading is disabled
    if (!this._lazyload) {
      return;
    }

    _imports.eventBus.on({
      mounted: () => {
        this._doLazyLoad();
      },
      move: () => {
        this._doLazyLoad();
      },
    });
  }

  /**
   * Lazy load images.
   */
  private _doLazyLoad(): void {
    const images = this._getImages();

    images.forEach(image => this._loadImage(image));
  }

  /**
   * Get all image tags (<img>, <picture>) to lazy load.
   */
  private _getImages() {
    const indices = range(0, this._imports.virchual.getSlides(true).length - 1);
    const slidesWindowIndices = slidingWindow(indices, this._imports.virchual.currentIndex, 1);

    const images: Array<HTMLImageElement | HTMLPictureElement> = [];

    slidesWindowIndices.forEach(index => {
      const slide = this._imports.virchual.getSlides(true)[index];

      if (!slide.isMounted) {
        return;
      }

      [].forEach.call(slide.ref.querySelectorAll(this._lazyloadSelector), (img: HTMLElement) => {
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
  private _loadImage(image: HTMLImageElement | HTMLPictureElement) {
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

        this._imports.eventBus.on(this._events, source);
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

  private _onLoad(event: Event) {
    const image = event.target as HTMLImageElement;

    this._completeLoading(image);
  }

  private _onError(event: Event) {
    const image = event.target as HTMLImageElement;
    const target = getImage(image);

    target.classList.add(ERROR_CLASSNAME);

    this._completeLoading(image);
  }

  private _completeLoading(image: HTMLImageElement) {
    const target = getImage(image);

    target.classList.remove(LOADING_CLASSNAME);
    target.classList.add(COMPLETE_CLASSNAME);

    this._imports.eventBus.off(this._events, image);
  }
}
