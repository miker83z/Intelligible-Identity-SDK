const { AlgoWrapper } = require('@intelligiblesuite/wrappers');

class CertificateAlgo extends AlgoWrapper {
  /**
   * @description Creates a new assets that represents a Certificate Token
   * @param {Object} assetConfig The object containing the asset information.
   * It must contain at least one of assetURL or assetMetadataHash
   * @param {string} receivingAddress The address receiving the certificate token
   * @return {string} The token id
   */
  async newCertificateToken(assetConfig) {
    if (this.mainAddress === undefined)
      throw new Error(
        'certificate/algo: You need to provide a main address for operations'
      );
    if (this.address === undefined) {
      throw new Error('certificate/algo: Invalid address to send the token to');
    }
    if (assetConfig === undefined || !assetConfig) {
      throw new Error('certificate/algo: You need to provide an assetConfig');
    }

    this.newAsset(
      { ...assetConfig, unitName: 'IntCert', assetName: 'intcert' },
      this.address
    );

    return this.tokenId;
  }
}

module.exports = { CertificateAlgo };
