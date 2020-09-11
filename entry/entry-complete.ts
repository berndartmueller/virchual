import { Controls, ControlsSettings } from './../src/components/controls/controls';
import { LazyLoadImage } from './../src/components/lazyload-image/lazyload-image';
import { Virchual as VirchualCore, VirchualSettings as VirchualCoreSettings } from './../src/virchual';

// @TODO settings with combined settings from components
export type VirchualSettings = VirchualCoreSettings & ControlsSettings;

export class Virchual extends VirchualCore {
  constructor(container: HTMLElement, settings: VirchualSettings = {}) {
    super(container, settings);

    this.register(Controls, { isEnabled: true });
    this.register(LazyLoadImage, { lazyload: true });
  }
}
