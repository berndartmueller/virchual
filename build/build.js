import typescript from 'rollup-plugin-typescript2';

export default {
  output: {
    name: 'Virchual',
    sourcemap: true,
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
  ],
};
