/* eslint-disable no-undef */
const IntelligibleCertificate = artifacts.require(
  './IntelligibleCertificate.sol'
);

module.exports = function (deployer) {
  return deployer.deploy(
    IntelligibleCertificate,
    'IntelligibleCertificate1',
    'ICE'
  );
};
