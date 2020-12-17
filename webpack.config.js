const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'intelligibleIdentity.lib.js',
    libraryTarget: 'umd',
    library: 'IntelligibleIdentity',
  },
};
