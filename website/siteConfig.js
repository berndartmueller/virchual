/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'virchual',
  tagline: 'Super-fast, lightweight slider and carousel, written in TypeScript without any dependencies.',
  url: 'https://www.virchual.xyz',
  baseUrl: '/',
  projectName: 'virchual',
  organizationName: 'berndartmueller',
  cname: 'virchual.xyz',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [],

  /* path to images for header/footer */
  headerIcon: 'img/favicon.ico',
  footerIcon: 'img/favicon.ico',
  favicon: 'img/favicon.ico',

  twitter: true,
  twitterUsername: 'berndartmueller',

  /* Colors for website */
  colors: {
    primaryColor: '#BC3E77',
    secondaryColor: '#02703d',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Bernd Artmüller`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  // '//cdn.jsdelivr.net/npm/virchual@next/dist/index.bundle.js'
  scripts: ['https://buttons.github.io/buttons.js', 'js/virchual.umd.js', 'js/index.js'],
  stylesheets: ['css/virchual.css'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/virchual.jpg',
  twitterImage: 'img/virchual.jpg',

  // For sites with a sizable amount of content, set collapsible to true.
  // Expand/collapse the links and subcategories under categories.
  // docsSideNavCollapsible: true,

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/berndartmueller/virchual',
};

module.exports = siteConfig;
