import pkg from './../package.json';
import build from './build';

export default Object.assign(build, {
  input: 'entry/entry-complete.ts',
  output: Object.assign(build.output, {
    file: pkg.module,
    format: 'es',
  }),
});
