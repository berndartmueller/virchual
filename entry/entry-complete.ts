import { Virchual as VirchualCore, VirchualSettings } from './../src/virchual';
import { Controls } from './../src/components/controls';
import { Lazy } from './../src/components/lazy';

export default class Virchual extends VirchualCore {
  constructor(public container: HTMLElement, public settings: VirchualSettings = {}) {
    super(container, settings);

    this.register(Controls, { isEnabled: true });
    this.register(Lazy, { threshold: 300 });
  }
}
