const path = require('path');

module.exports = {
  entry: './src/main.js',
  resolve: {
    modules: ['node_modules'],
    fallback: {
      assert: false,
      fs: false,
      tls: false,
      net: false,
      path: false,
      os: false,
      zlib: false,
      url: false,
      util: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
      'crypto-browserify': false,
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'intelligibleIdentity.lib.js',
    libraryTarget: 'umd',
    library: 'IntelligibleIdentity',
  },
};
