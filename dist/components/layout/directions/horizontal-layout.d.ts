import { BaseLayout } from './../index';
export declare class HorizontalLayout extends BaseLayout {
    private padding;
    private _gap;
    initLayout(): void;
    /**
     * Accumulate slide width including the gap to the designated index.
     *
     * @param index If undefined, width of all slides will be accumulated.
     *
     * @return Accumulated width.
     */
    totalWidth(index: number): number;
    get width(): number;
    /**
     * Return list width.
     *
     * @return Current list width.
     */
    get listWidth(): number;
    get listHeight(): number;
    /**
     * Return the slide height in px.
     *
     * @return The slide height.
     */
    get slideHeight(): number;
    /**
     * Return the slide width in px.
     *
     * @param {number} index - Slide index.
     *
     * @return {number} - The slide width.
     */
    slideWidth(index: number): number;
    get height(): number;
    get margin(): string;
    get gap(): number;
}
