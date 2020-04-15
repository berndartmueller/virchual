import { find, exist, each, error } from './utils';
import TrackComponent from './components/track';
export default class VirtualSwiper {
    constructor(root, options = {}, components) {
        this.root = root;
        this.options = options;
        this.components = components;
        this.root = root instanceof Element ? root : find(document, root);
        exist(this.root, 'An invalid element/selector was given.');
        const defaultComponents = {
            Track: TrackComponent,
        };
        this.components = Object.assign(Object.assign({}, defaultComponents), this.components);
        this.mount();
    }
    mount() {
        try {
            each(this.components, (component, key) => {
                const required = component.required;
                if (required === undefined || required) {
                    component.mount && component.mount();
                }
                else {
                    delete this.components[key];
                }
            });
        }
        catch (e) {
            error(e.message);
            return null;
        }
    }
}
