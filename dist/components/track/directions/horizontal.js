import { between } from '../../../utils/utils';
export class HorizontalDirection {
    constructor(options, instance, components) {
        this.options = options;
        this.instance = instance;
        this.components = components;
        /**
         * Axis of translate.
         *
         * @type {string}
         */
        this.axis = 'X';
        /**
         * Sign for the direction.
         *
         * @type {number}
         */
        this.sign = -1;
        this.virtual = components.Virtual;
        this.layout = components.Layout;
    }
    /**
     * Calculate position by index.
     *
     * @param {number} index - Slide index.
     *
     * @return {Object} - Calculated position.
     */
    toPosition(index) {
        return this.sign * (this.layout.totalWidth(index - 1) + this.offset(index));
    }
    /**
     * Calculate the closest slide index from the given position.
     *
     * @return {number} - The closest slide position.
     */
    toIndex(position) {
        position *= this.sign;
        // if (this.instance.is(SLIDE)) {
        if (true) {
            position = between(position, this.layout.totalWidth(this.virtual.total), 0);
        }
        const slides = this.virtual.getSlides();
        for (const i in slides) {
            const slide = slides[i];
            const slideIndex = this.instance.index;
            const slidePosition = this.sign * this.toPosition(slideIndex);
            if (slidePosition < position && position <= slidePosition + this.layout.slideWidth(slideIndex) + this.layout.gap) {
                return slideIndex;
            }
        }
        return 0;
    }
    /**
     * Trim redundant spaces on the left or right edge if necessary.
     *
     * @param {number} position - Position value to be trimmed.
     *
     * @return {number} - Trimmed position.
     */
    trim(position) {
        const edge = this.sign * (this.layout.totalWidth(this.virtual.total) - (this.layout.width + this.layout.gap));
        return between(position, edge, 0);
    }
    /**
     * Return current offset value, considering direction.
     *
     * @return {number} - Offset amount.
     */
    offset(index) {
        const { focus } = this.options;
        const slideWidth = this.layout.slideWidth(index);
        if (focus === 'center') {
            return -(this.layout.width - slideWidth) / 2;
        }
        return -(parseInt(`${focus}`) || 0) * (slideWidth + this.layout.gap);
    }
}
