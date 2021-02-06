const { AlgoWrapper } = require('@intelligiblesuite/wrappers');

/**
 * @description Provides the means to create and manage an intelligible identity
 * in Algorand.
 * @extends {AlgoWrapper}
 */
class IdentityAlgo extends AlgoWrapper {
  /**
   * @description Creates a new assets that represents an Identity Token
   * @param {Object} assetConfig The object containing the asset information.
   * It must contain at least one of assetURL or assetMetadataHash
   * @param {string} identityAddress The address receiving the identity token
   * @return {string} The token id
   */
  async newIdentityToken(assetConfig) {
    if (this.mainAddress === undefined)
      throw new Error(
        'identity/algo: You need to provide a main address for operations'
      );
    if (this.address === undefined) {
      throw new Error('identity/algo: Invalid address to send the token to');
    }
    if (assetConfig === undefined || !assetConfig) {
      throw new Error(
        'identity/algo: You need to provide an identity assetConfig'
      );
    }

    this.newAsset(
      { ...assetConfig, unitName: 'IntId', assetName: 'intid' },
      this.address
    );

    return this.tokenId;
  }
}

module.exports = { IdentityAlgo };
