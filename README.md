<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/berndartmueller/virchual">
    <img src="images/logo.png" alt="Logo" width="400px" height="96px">
  </a>
  <br />
  <br />

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

<p align="center">
  <a href="https://www.npmjs.com/package/virchual" target="_blank">
    <img alt="npm (tag)" src="https://img.shields.io/npm/v/virchual/latest">
  </a>

  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/virchual@next">

  <a href="https://travis-ci.org/berndartmueller/virchual" target="_blank">
    <img alt="Travis (.org)" src="https://img.shields.io/travis/berndartmueller/virchual">
  </a>
</p>

<br />

## Why Virchual?

- Lightweight. Only **<2.8kB** (gzipped).
- **Virtual slides** to keep DOM elements at a minimum (Lighthouse ❤️ it)
- Instagram like **pagination bullets**.
- **0 dependencies**. Everything included.

<br />

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

### CDN

To get Virchual up and running as fast as possible, you can serve all necessary files via a CDN.

- https://cdn.jsdelivr.net/npm/virchual@next/dist/index.bundle.js

#### jsDelivr

Just add a link to the css file in your `<head>`:

```html
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/virchual@next/dist/index.css" />
```

Then, before your closing `<body>` tag add:

```html
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/virchual@next/dist/index.bundle.js"></script>
```

### NPM & Yarn

```sh
$ npm install virchual
```

or

```sh
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

```ts
import 'virchual/dist/index.css';

import { Virchual } from 'virchual';

const slider = new Virchual(document.querySelector('.virchual'), {
  slides: () => {
    return [
      '<img src="image.jpg"/>', // slide 1
      '<img src="image2.jpg"/>', // slide 2
    ];
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

## API

- [Virchual](#virchual)

  - [Virchual#mount](#virchualmount)
  - [Virchual#on](#virchualon)
  - [Virchual#off](#virchualoff)
  - [Virchual#prev](#virchualprev)
  - [Virchual#next](#virchualnext)
  - [Virchual#destroy](#virchualdestroy)

## Virchual

```ts
Virchual(element: HTMLElement, settings: VirchualSettings): Virchual
```

Virchual constructor. Creates a new Virchual slider instance.

---

### Virchual#mount

---

```ts
Virchual.mount();
```

Mount slider and bind DOM events.

### Virchual#on

---

```ts
Virchual.on(events: string, handler: () => {}, elm: HTMLElement);
```

Add event listener for given event(s).

```ts
instance.on('mount', () => {
  console.log('Slider mounted.');
});

// multiple events can be defined by seperating with a whitespace

instance.on('mount destroy', () => {
  console.log('Slider mounted/destroy.');
});
```

### Virchual#off

---

```ts
Virchual.off(events: string);
```

Remove event listener for given event(s).

```ts
instance.off('mount');

// multiple events can be defined by seperating with a whitespace

instance.off('mount destroy');
```

### Virchual#prev

---

```ts
Virchual.prev();
```

Move to previous slide. Rewind in case first slide is currently shown.

### Virchual#next

---

```ts
Virchual.next();
```

Move to next slide. Rewind in case last slide is currently shown.

### Virchual#destroy

---

```ts
Virchual.destroy();
```

Unmount slider, remove DOM events for this instance.

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

2. Run

```sh
npm run dev
```

### Running Tests

```sh
npm run test
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

## Sponsor

If you want to support me, you can buy me a coffee to keep me coding -> https://www.buymeacoffee.com/berndartmueller

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[size-shield]: https://img.shields.io/bundlephobia/minzip/virchual@1.0.0-alpha.5.svg?color=%23477998&style=flat-square
