const { Web3Wrapper } = require('@intelligiblesuite/wrappers');

/**
 * @description Provides the means to create and manage an intelligible identity
 * in Ethereum.
 * @extends {Web3Wrapper}
 */
class IdentityWeb3 extends Web3Wrapper {
  /**
   * @description Creates a new intelligible identity token by calling an Ethereum
   * smart contract method.
   * @param {string} identityAddress The Ethereum address to send the token to
   * @param {string} identityAknURI The URI to register in the token
   * @return {number} The token id within the smart contract
   */
  async newIdentityToken(identityAddress, identityAknURI) {
    if (this.contract === undefined)
      throw new Error('identity/web3: You need to provide a contract artifact');
    if (this.mainAddress === undefined)
      throw new Error(
        'identity/web3: You need to provide a main address for operations'
      );
    if (
      identityAddress === undefined ||
      !Web3Wrapper.checkIfAddress(identityAddress)
    ) {
      throw new Error(
        'identity/web3: Invalid Ethereum address to send the token to'
      );
    }
    if (identityAknURI === undefined || !identityAknURI) {
      throw new Error('identity/web3: You need to provide an identity URI');
    }
    if (this.address !== undefined) {
      throw new Error(
        'identity/web3: A token has already been instanciated for this object'
      );
    }

    const res = await this.contract.methods
      .newIdentity(identityAddress, identityAknURI)
      .send({ from: this.mainAddress, gas: 1000000 });
    const tokenId = res.events['Transfer'].returnValues['tokenId'];

    this.address = identityAddress;
    this.tokenId = tokenId;

    return tokenId;
  }

  /**
   * @description Reserves a token id that can later be associated to a token
   * by calling an Ethereum smart contract method
   * @return {number} The reserved token id within the smart contract
   */
  async reserveTokenId() {
    if (this.contract === undefined)
      throw new Error('identity/web3: You need to provide a contract artifact');
    if (this.mainAddress === undefined)
      throw new Error(
        'identity/web3: You need to provide a main address for operations'
      );

    const res = await this.contract.methods
      .reserveIds(1)
      .send({ from: this.mainAddress, gas: 1000000 });
    const tokenId = res.events['Reserved'].returnValues['firstReservedId'];

    this.tokenId = tokenId;

    return tokenId;
  }

  /**
   * @description Creates a new intelligible identity token by calling an Ethereum
   * smart contract method, after a token id has been reserved with reserveTokenId().
   * @param {string} identityAddress The Ethereum address to send the token to
   * @param {string} URI The URI to register in the token
   */
  async newIdentityTokenFromReserved(identityAddress, URI) {
    if (this.contract === undefined)
      throw new Error('identity/web3: You need to provide a contract artifact');
    if (this.mainAddress === undefined)
      throw new Error(
        'identity/web3: You need to provide a main address for operations'
      );
    if (
      identityAddress === undefined ||
      !Web3Wrapper.checkIfAddress(identityAddress)
    ) {
      throw new Error(
        'identity/web3: Invalid Ethereum address to send the token to'
      );
    }
    if (URI === undefined || !URI) {
      throw new Error('identity/web3: You need to provide a URI');
    }
    if (this.address !== undefined) {
      throw new Error(
        'identity/web3: A token has already been instanciated for this object'
      );
    }
    if (this.tokenId === undefined) {
      throw new Error('identity/web3: A token id must be reserved');
    }

    await this.contract.methods
      .newIdentityFromReserved(identityAddress, URI, this.tokenId)
      .send({ from: this.mainAddress, gas: 1000000 });

    this.address = identityAddress;
  }

  /**
   * @description Creates a new intelligible identity by fetching the information from
   * the last token issued to an address
   * @param {string} identityAddress The address the token was issued to
   * @return {string} The token uri
   */
  async getIdentityToken(identityAddress) {
    if (this.contract === undefined)
      throw new Error('identity/web3: You need to provide a contract artifact');
    if (this.mainAddress === undefined)
      throw new Error(
        'identity/web3: You need to provide a main address for operations'
      );
    if (
      identityAddress === undefined ||
      !Web3Wrapper.checkIfAddress(identityAddress)
    ) {
      throw new Error(
        'identity/web3: Invalid Ethereum address to get the token from'
      );
    }

    const balanceOf = await this.contract.methods
      .balanceOf(identityAddress)
      .call({ from: this.mainAddress });
    if (balanceOf <= 0) {
      throw new Error('identity/web3: No token issued for this address');
    }
    const tokenId = await this.contract.methods
      .tokenOfOwnerByIndex(identityAddress, balanceOf - 1)
      .call({ from: this.mainAddress });
    const tokenURI = await this.contract.methods
      .tokenURI(tokenId)
      .call({ from: this.mainAddress });

    this.address = identityAddress;
    this.tokenId = tokenId;

    return tokenURI;
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
