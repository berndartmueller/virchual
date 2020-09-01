const postcss_copy = require('postcss-copy');
const postcss_import = require('postcss-import');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    postcss_import({}),
    postcss_copy({
      basePath: './src/css',
      preservePath: true,
      dest: 'dist',
      template: 'css/styles.[ext]',
    }),
    cssnano({
      preset: 'default',
    }),
  ],
};
