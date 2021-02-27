/* eslint-disable no-undef */
const IntelligibleIdentity = artifacts.require('./IntelligibleIdentity.sol');

module.exports = function (deployer) {
  return deployer.deploy(IntelligibleIdentity, 'IntelligibleIdentity1', 'IID');
};
