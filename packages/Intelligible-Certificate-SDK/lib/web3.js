const { Web3Wrapper } = require('@intelligiblesuite/wrappers');

/**
 * @description Provides the means to create and manage an intelligible certificate
 * in Ethereum.
 * @extends {Web3Wrapper}
 */
class CertificateWeb3 extends Web3Wrapper {
  /**
   * @description Creates an instance of CertificateWeb3. An instance only requires a
   * provider: in such case, methods not related to the smart contract will work.
   * @param {Object} provider The web3 provider
   * @param {Object} contractArtifact The json object containing the contract abi
   * @param {number} networkId The id of the network where the provider operates
   */
  constructor(provider, contractArtifact, networkId) {
    super(provider, contractArtifact, networkId);
    this.useCase = 'certificate';
  }
}

module.exports = { CertificateWeb3 };
