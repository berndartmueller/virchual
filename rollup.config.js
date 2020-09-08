import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';
import postcss from 'rollup-plugin-postcss';
import postcss_import from 'postcss-import';
import postcss_copy from 'postcss-copy';

console.log('ROLLU');
export default [
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
        ],
        extract: true,
        sourceMap: true,
      }),
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
