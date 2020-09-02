import { Controls } from './../src/components/controls/controls';
import { Lazy } from './../src/components/lazy/lazy';
import { LazyLoadImage } from './../src/components/lazyload-image/lazyload-image';
import { Virchual as VirchualCore, VirchualSettings } from './../src/virchual';

// @TODO settings with combined settings from components

export default class Virchual extends VirchualCore {
  constructor(container: HTMLElement, settings: VirchualSettings = {}) {
    super(container, settings);

    this.register(Controls, { isEnabled: true });
    this.register(Lazy, { threshold: 300 });
    this.register(LazyLoadImage, { lazyload: false });
  }
}
