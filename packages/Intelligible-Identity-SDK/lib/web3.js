const { Web3Wrapper } = require('@intelligiblesuite/token-ethereum');

/**
 * @description Provides the means to create and manage an intelligible identity
 * in Ethereum.
 * @extends {Web3Wrapper}
 */
class IdentityWeb3 extends Web3Wrapper {
  /**
   * @description Creates an instance of CertificateWeb3. An instance only requires a
   * provider: in such case, methods not related to the smart contract will work.
   * @param {Object} provider The web3 provider
   * @param {number} [networkId] The id of the network where the provider operates
   * @param {Object} [contractArtifact] The json object containing the contract abi
   */
  constructor(provider, networkId, contractArtifact) {
    super(provider, 'identity', networkId, contractArtifact);
  }

  /**
   * @description Signs a payload with the main address private key. Based on the
   * parameter isPersonal uses one of the web3's 'eth.personal.sign' and
   * 'eth.sign'
   * @param {string} payload The data to sign
   * @param {boolean|undefined} isPersonal The discriminator for the signature function
   * @return {string} The signature
   */
  async signData(payload, isPersonal) {
    if (this.mainAddress === undefined)
      throw new Error(
        'identity/web3: You need to provide a main address for operations'
      );
    if (payload === undefined || !payload)
      throw new Error('identity/web3: You need to provide a valid payload');
    if (isPersonal === undefined || typeof isPersonal !== 'boolean')
      isPersonal = true;

    if (isPersonal)
      return await this.web3.eth.personal.sign(payload, this.mainAddress);
    else return await this.web3.eth.sign(payload, this.mainAddress);
  }

  /**
   * @description Returns the address that signed the payload through the web3
   * function 'eth.personal.sign'
   * @param {string} payload The signad data
   * @param {string} signature The signature
   * @return {string} The signatory address
   */
  async verifySignedData(payload, signature) {
    if (payload === undefined || !payload)
      throw new Error('identity/web3: You need to provide a valid payload');
    if (signature === undefined || !signature)
      throw new Error('identity/web3: You need to provide a valid signature');

    return await this.web3.eth.personal.ecRecover(payload, signature);
  }

  /**
   * @description Create a new address
   * @return {Object} The address object
   */
  async newAddress() {
    this.idAddress = this.web3.eth.accounts.create();

    //this.web3.eth.accounts.wallet.add(this.idAddress);
    //console.log(this.web3.eth.accounts.wallet.length);

    //console.log(await this.web3.eth.getAccounts());
    //const ac = await this.web3.eth.personal.newAccount('');
    return this.idAddress;
  }
}

module.exports = { IdentityWeb3 };
