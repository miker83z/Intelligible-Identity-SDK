const path = require('path');

module.exports = {
  entry: './index.js',
  resolve: {
    modules: ['node_modules'],
    fallback: {
      os: require.resolve('os-browserify/browser'),
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
      url: require.resolve('url/'),
      crypto: require.resolve('crypto-browserify'),
      util: require.resolve('util/'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert/'),
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'intelligibleIdentity.lib.js',
    libraryTarget: 'umd',
    library: 'IntelligibleIdentity',
  },
};
