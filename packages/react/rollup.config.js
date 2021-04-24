import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';

export default [
  {
    input: './src/index.tsx', // our source file
    output: [
      {
        file: './dist/index.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      postcss({
        plugins: [],
        extract: true,
        sourceMap: true,
      }),
      typescript({
        typescript: require('typescript'),
        include: ['./src/**/*', './../../src/**/*.ts'],
      }),
    ],
  },
];
