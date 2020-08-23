import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import postcss from 'rollup-plugin-postcss';
import postcss_import from 'postcss-import';
import postcss_copy from 'postcss-copy';
import visualizer from 'rollup-plugin-visualizer';
import bundleSize from 'rollup-plugin-bundle-size';

const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  input: 'src/virchual.ts', // our source file
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es', // the preferred format
    },
    {
      file: pkg.browser,
      format: 'iife',
      name: 'MyPackage', // the global which can be used in a browser,
      sourcemap: true,
    },
  ],
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [
    visualizer(),
    typescript({
      typescript: require('typescript'),
    }),
    terser(), // minifies generated bundles
    bundleSize(),
    postcss({
      plugins: [
        postcss_import({}),
        postcss_copy({
          basePath: './src/css',
          preservePath: true,
          dest: 'dist',
          template: 'css/styles.[ext]',
        }),

        // postcss_url(),
        // postcss_url({
        //      url: "copy",
        //      basePath: path.resolve("."),
        //      assetPath: "resources"
        // })
      ],
      // Save it to a .css file - we'll reference it ourselves thank you
      // very much
      extract: true,
      sourceMap: true,
      //minimize: true, // Causes an error at the moment for some reason
    }),
    isDevelopment &&
      serve({
        open: true,

        host: '0.0.0.0',

        // Page to navigate to when opening the browser.
        // Will not do anything if open=false.
        // Remember to start with a slash.
        openPage: '/index.html',

        // Multiple folders to serve from
        contentBase: ['dist', 'examples'],

        // Options used in setting up server
        host: 'localhost',
        port: 1337,
      }),
  ],
};
