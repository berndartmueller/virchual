console.log('bbbaaabel');

module.exports = function (api) {
  api.cache(true);

  const rename = {};
  console.log('asdfasdfasdf');
  const mangle = require('./mangle.json');

  for (let prop in mangle.props.props) {
    let name = prop;
    if (name[0] === '$') {
      name = name.slice(1);
    }

    rename[name] = mangle.props.props[prop];
  }

  console.log('rename', rename);

  return {
    presets: ['@babel/env'],
    plugins: ['@babel/proposal-class-properties', ['babel-plugin-transform-rename-properties', { rename }]],
  };
};
