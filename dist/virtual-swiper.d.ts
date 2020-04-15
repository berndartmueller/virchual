import { BaseComponent } from './components/base-component';
export declare type VirtualSwiperOptions = {
    slides?: VirtualSwiperSlides;
    rewindSpeed?: number;
    speed?: number;
    rewind?: boolean;
    focus?: boolean | string | number;
    perPage?: number;
    isNavigation?: boolean;
    easing?: string;
    gap?: number | string;
    padding?: {
        left: number | string;
        right: number | string;
    };
    autoWidth?: boolean;
    width?: number | string;
    trimSpace?: boolean | string;
    direction?: string;
    fixedWidth?: number | string;
    height?: number;
    fixedHeight?: number | string;
    heightRatio?: number;
    updateOnMove?: boolean;
    swipeDistanceThreshold?: number;
    flickVelocityThreshold?: number;
    flickPower?: number;
    flickMaxPages?: number;
};
declare type VirtualSwiperSlides = string[] | (() => string[]);
export declare type VirtualSwiperComponents = {
    [key: string]: BaseComponent;
};
export default class VirtualSwiper {
    selector: HTMLElement | string;
    options: VirtualSwiperOptions;
    private components;
    root: HTMLElement;
    private _index;
    constructor(selector: HTMLElement | string, options?: VirtualSwiperOptions, components?: VirtualSwiperComponents);
    get index(): number;
    set index(index: number);
    get length(): number;
    private mount;
}
export {};
