import typescript from 'rollup-plugin-typescript2';

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
      typescript({
        typescript: require('typescript'),
      }),
    ],
  },
];
