import { ControlsSettings } from './../src/components/controls/controls';
import { Virchual as VirchualCore, VirchualSettings as VirchualCoreSettings } from './../src/virchual';

export type VirchualSettings = VirchualCoreSettings & ControlsSettings;

export class Virchual extends VirchualCore {
  constructor(container: HTMLElement, settings: VirchualSettings = {}) {
    super(container, settings);
  }
}
