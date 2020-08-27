<!-- PROJECT SHIELDS -->

![size][size-shield]
[![Build Status](https://travis-ci.org/berndartmueller/virchual.svg?branch=master)](https://travis-ci.org/berndartmueller/virchual)
[![twitter][twitter-shield]][twitter-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/berndartmueller/virchual">
    <img src="images/logo.png" alt="Logo" width="400">
  </a>

  <h3 align="center" style="font-weight: bold;">virchual [virtual]</h3>

  <p align="center">
    Super-fast, lightweight (<2.8kB) slider/carousel with virtual slides. Written in TypeScript. Tree-shakeable. 0 dependencies!
    <br />
    <br />
    <a href="https://github.com/berndartmueller/virchual"><strong>View Demo »</strong></a>
    <br />
    <br />
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

<!-- ABOUT THE PROJECT -->

## About

This image swiper/slider/carousel library, written in TypeScript, aims to provide a high-performance slider best used when having many instances on a page (e.g. list of cards where each card has a swiper gallery - like Airbnb or hometogo).

Virchual uses virtual slides to only render visible slides. No unnecessary DOM elements.

## Installation

```sh
$ npm install virchual

or

$ yarn install virchual
```

<!-- USAGE EXAMPLES -->

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

Example HTML:

```html
<div class="virchual">
  <div class="virchual__frame"></div>
</div>
```

```javascript
import { Virchual } from 'virchual';

const slider = new Virchual(document.querySelector('.virchual'), {
  slides: () => {
    return [];
  },
});

slider.mount();
```

## Options

| Name                 | Type     | Description                                  | Required | Default  |
| -------------------- | -------- | -------------------------------------------- | -------- | -------- |
| `slides`             | `Array   | Function`                                    | Slides   | Yes      |
| `speed`              | `Number` | Slide transition speed                       | No       | 200      |
| `easing`             | `String` | Slide transition easing                      | No       | ease-out |
| `transitionDuration` | `Number` | staying duration of per slide/swipe item     | No       | 200ms    |
| `window`             | `Number` | How many slide clones on left and right side | No       | 1        |

<br/>

<!-- CONTRIBUTING -->

## Contributing

### Getting Started

1. Clone the repo

```sh
git clone github.com/berndartmueller/virchual.git
```

2. Install NPM packages

```sh
npm install
```

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Bernd Artmüller - [@berndartmueller](https://twitter.com/berndartmueller) - hello@berndartmueller.com

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[twitter-shield]: https://img.shields.io/badge/-Twitter-black.svg?style=flat-square&logo=twitter&colorB=555
[twitter-url]: https://www.twitter.com/berndartmueller
[product-screenshot]: images/screenshot.png
[size-shield]: https://img.shields.io/bundlephobia/minzip/virchual@1.0.0-alpha.5.svg?color=%23477998&style=flat-square
