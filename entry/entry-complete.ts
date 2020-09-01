import { Controls } from './../src/components/controls';
import { Lazy } from './../src/components/lazy';
import { Virchual as VirchualCore, VirchualSettings } from './../src/virchual';

export default class Virchual extends VirchualCore {
  constructor(container: HTMLElement, settings: VirchualSettings = {}) {
    super(container, settings);

    this.register(Controls, { isEnabled: true });
    this.register(Lazy, { threshold: 300 });
  }
}
