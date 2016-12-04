const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'browser', 'js', 'app.js'),
  output: {
    path: path.join(__dirname, '.build', 'js'),
    filename: 'app.js',
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /(node_modules)/,
      loader: 'babel',
    }],
  },
};
