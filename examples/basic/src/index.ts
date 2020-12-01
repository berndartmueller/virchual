import { Virchual, Controls, LazyLoadImage } from 'virchual';
import 'virchual/dist/virchual.css';

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
        '7EsFOzUoIzU',
        'lUtPqjz5D5k',
        '1-9nfcJ7-Zk',
        'ZmQh4ojSA-k',
        '9ZaqDVDdMwg',
        'OhqiMvM6NsE',
        'C8mZsNgGZk0',
        'am6_dPRmWwI',
        'M2FEVCu4Osw',
        '7EsFOzUoIzU',
      ];
      const slides: string[] = [];

      // add 9 more slides to a total of 10
      for (let i = 1; i < 10; i++) {
        const imageId = unsplashImageIds[i - 1];

        slides.push(`
                  <picture>
                    <source
                      type="image/jpeg"
                      data-srcSet="
                        https://source.unsplash.com/${imageId}/400x265,
                        https://source.unsplash.com/${imageId}/800x530 2x
                      "
                    />
                    <img data-src="https://source.unsplash.com/${imageId}/400x265" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                  </picture>
                `);
      }

      return slides;
    },
  });

  instance.register(Controls, { isEnabled: true });
  instance.register(LazyLoadImage, { lazyload: true });

  instance.mount();
});
