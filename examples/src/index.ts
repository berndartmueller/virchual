import Virchual from '@virchual/index';
import { Controls } from '@virchual/components/controls/controls';

import './../../src/css/styles.css';

[].forEach.call(document.querySelectorAll('.image-swiper'), (slider: HTMLElement) => {
  const instance = new Virchual(slider, {
    slides: () => {
      const unsplashImageIds = [
        '7EsFOzUoIzU',
        'lUtPqjz5D5k',
        '1-9nfcJ7-Zk',
        'ZmQh4ojSA-k',
        '9ZaqDVDdMwg',
        'OhqiMvM6NsE',
        'C8mZsNgGZk0',
        'am6_dPRmWwI',
        'M2FEVCu4Osw',
      ];
      const slides: string[] = [];

      // add 9 more slides to a total of 10
      for (let i = 1; i < 10; i++) {
        const imageId = unsplashImageIds[i - 1];

        slides.push(`
          <picture>
            <source
              type="image/jpeg"
              srcSet="
                https://source.unsplash.com/${imageId}/400x265,
                https://source.unsplash.com/${imageId}/800x530 2x
              "
            />
            <img src="https://source.unsplash.com/${imageId}/400x265" itemProp="image" />
          </picture>
        `);
      }

      return slides;
    },
  });

  instance.register(Controls, { isEnabled: true });

  instance.mount();
});
