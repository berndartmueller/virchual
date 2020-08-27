import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import postcss_import from 'postcss-import';
import postcss_copy from 'postcss-copy';
import visualizer from 'rollup-plugin-visualizer';
import bundleSize from 'rollup-plugin-bundle-size';

const isDevelopment = process.env.NODE_ENV === 'development';

export default [
  // library
  {
    input: 'src/index.ts', // our source file
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
    plugins: [
      visualizer(),
      typescript({
        typescript: require('typescript'),
      }),
      terser({
        compress: {
          drop_console: !isDevelopment,
          keep_fargs: false,
          passes: 2,
        },
        keep_fnames: false,
        ecma: 6,
        mangle: {
          properties: true,
          toplevel: true,
        },
      }), // minifies generated bundles
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
    ],
  },

  // example
  {
    input: './examples/src/index.ts', // our source file
    output: [
      {
        file: './examples/dist/index.js',
        format: 'iife',
        name: 'virchual', // the global which can be used in a browser,
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        typescript: require('typescript'),
      }),
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
          openPage: '/index.html',
          contentBase: ['./examples/src', './examples'],
          host: 'localhost',
          port: 1337,
        }),
    ],
  },
];
