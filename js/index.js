console.log('test');

document.addEventListener(
  'DOMContentLoaded',
  function () {
    const instance = new Virchual(document.querySelector('.image-swiper'), {
      slides: function () {
        const slides = [];

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

    // instance.register(Controls, { isEnabled: true });

    instance.mount();
    console.log('instance', instance);
  },
  false,
);
