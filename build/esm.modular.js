import pkg from './../package.json';
import build from './build';

export default Object.assign(build, {
  input: 'entry/entry-modular.ts',
  output: Object.assign(build.output, {
    file: pkg.module.split('.esm.js')[0] + '.modular.esm.js',
    format: 'es',
  }),
});
