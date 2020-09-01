import Virchual from '@virchual/index';
import { Controls } from '@virchual/components/controls/controls';

import './../../src/css/styles.css';

[].forEach.call(document.querySelectorAll('.image-swiper'), (slider: HTMLElement) => {
  const instance = new Virchual(slider, {
    slides: () => {
      const slides: string[] = [];

      // add 9 more slides to a total of 10
      for (let i = 1; i < 10; i++) {
        slides.push(`
          <picture>
            <source
              type="image/webp"
              srcset="
                https://i.findheim.at/images/sm/6iBu4sycxr9kXMlcbyVyz.webp,
                https://i.findheim.at/images/md/6iBu4sycxr9kXMlcbyVyz.webp 2x
              " />
            <source
              type="image/jpeg"
              srcset="
                https://i.findheim.at/images/sm/6iBu4sycxr9kXMlcbyVyz.jpg,
                https://i.findheim.at/images/md/6iBu4sycxr9kXMlcbyVyz.jpg 2x
              " />
            <img src="https://i.findheim.at/images/md/6iBu4sycxr9kXMlcbyVyz.jpg" itemprop="image"/>
          </picture>
        `);
      }

      return slides;
    },
  });

  instance.register(Controls, { isEnabled: true });

  instance.mount();
});
