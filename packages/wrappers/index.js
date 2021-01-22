const web3 = require('./lib/web3Wrapper');
const algo = require('./lib/algoWrapper');
const akn = require('./lib/aknWrapper');
const utils = require('./lib/templates');

module.exports = {
  Web3Wrapper: web3.Web3Wrapper,
  AlgoWrapper: algo.AlgoWrapper,
  AKNWrapper: akn.AKNWrapper,
  utils,
};
