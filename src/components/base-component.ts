import VirtualSwiper, { VirtualSwiperOptions, VirtualSwiperComponents } from './../virchual';

export interface BaseComponentConstructor {
  new (options: VirtualSwiperOptions): BaseComponent;
}

export interface BaseComponent {
  mount(instance: VirtualSwiper, components: VirtualSwiperComponents): void;
}
