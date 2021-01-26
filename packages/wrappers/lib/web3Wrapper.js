const Web3 = require('web3');

/**
 * @description Wraps the web3 library into a class. Allows to instantiate a Web3
 * object and to set a designated transaction issuer.
 */
class Web3Wrapper {
  /**
   * @description Creates an instance of Web3Wrapper. An instance only requires a
   * provider: in such case, methods not related to the smart contract will work.
   * @param {Object} provider The web3 provider
   * @param {Object} contractArtifact The json object containing the contract abi
   * @param {number} networkId The id of the network where the provider operates
   */
  constructor(provider, contractArtifact, networkId) {
    if (provider === undefined || !provider)
      throw new Error('wrapper/web3Wrapper: Provider not set');
    this.provider = provider;
    this.web3 = new Web3(provider);
    this.gas = 1000000;
    this.useCase = '';

    if (contractArtifact !== undefined) {
      this.setContract(contractArtifact, networkId);
    }
  }

  /**
   * @description Sets the main address for operating with the blockchain,
   * i,e. issuing a transactions, signing
   * @param {number|string} address The selected main address or its
   * position within the provider accounts list
   */
  async setMainAddress(address) {
    if (Web3Wrapper.checkIfAddress(address)) {
      this.mainAddress = address;
    } else if (typeof address === 'number') {
      const accounts = await this.web3.eth.getAccounts();
      this.mainAddress = accounts[address];
    } else {
      throw new Error('wrapper/web3Wrapper: Invalid address parameter');
    }
  }

  /**
   * @description Sets the smart contract for communicating with the blockchain
   * @param {Object} contractArtifact The json object containing the contract abi
   * @param {number} networkId The id of the network where the provider operates
   */
  setContract(contractArtifact, networkId) {
    if (contractArtifact === undefined || !contractArtifact)
      throw new Error('wrapper/web3Wrapper: Contract artifact not set');
    if (networkId === undefined || !networkId)
      throw new Error('wrapper/web3Wrapper: Network id not set');
    //const contractArtifact = await JSON.parse(contractArtifactRaw);
    this.contract = new this.web3.eth.Contract(
      contractArtifact.abi,
      contractArtifact.networks[networkId].address
    );
    this.contract.setProvider(this.provider);
  }

  /**
   * @description Reserves a token id that can later be associated to a token
   * by calling an Ethereum smart contract method
   * @return {number} The reserved token id within the smart contract
   */
  async reserveTokenId() {
    if (this.contract === undefined)
      throw new Error(
        'wrapper/web3Wrapper: You need to provide a contract artifact'
      );
    if (this.mainAddress === undefined)
      throw new Error(
        'wrapper/web3Wrapper: You need to provide a main address for operations'
      );

    const res = await this.contract.methods
      .reserveIds(1)
      .send({ from: this.mainAddress, gas: this.gas });
    const tokenId = res.events['Reserved'].returnValues['firstReservedId'];

    this.tokenId = tokenId;

    return tokenId;
  }

  /**
   * @description Creates a new intelligible identity token by calling an Ethereum
   * smart contract method, after a token id has been reserved with reserveTokenId().
   * @param {string} address The Ethereum address to send the token to
   * @param {string} URI The URI to register in the token
   */
  async newTokenFromReserved(URI) {
    if (this.contract === undefined)
      throw new Error(
        'wrapper/web3Wrapper: You need to provide a contract artifact'
      );
    if (this.mainAddress === undefined)
      throw new Error(
        'wrapper/web3Wrapper: You need to provide a main address for operations'
      );
    if (
      this.address === undefined ||
      !Web3Wrapper.checkIfAddress(this.address)
    ) {
      throw new Error(
        'wrapper/web3Wrapper: Invalid Ethereum address to send the token to'
      );
    }
    if (URI === undefined || !URI) {
      throw new Error('wrapper/web3Wrapper: You need to provide a URI');
    }
    if (this.tokenId === undefined) {
      throw new Error('wrapper/web3Wrapper: A token id must be reserved');
    }

    let contractMethod;
    switch (this.useCase) {
      case 'identity':
        contractMethod = this.contract.methods.newIdentityFromReserved;
        break;
      case 'certificate':
        contractMethod = this.contract.methods.newCertificateFromReserved;
        break;
      default:
        throw new Error(
          'wrapper/web3Wrapper: A valid use case must be provided'
        );
    }

    await contractMethod(this.address, URI, this.tokenId).send({
      from: this.mainAddress,
      gas: this.gas,
    });
  }

  /**
   * @description Creates a new intelligible identity token by calling an Ethereum
   * smart contract method.
   * @param {string} address The Ethereum address to send the token to
   * @param {string} URI The URI to register in the token
   * @return {number} The token id within the smart contract
   */
  async newToken(address, URI) {
    if (this.contract === undefined)
      throw new Error('identity/web3: You need to provide a contract artifact');
    if (this.mainAddress === undefined)
      throw new Error(
        'identity/web3: You need to provide a main address for operations'
      );
    if (address === undefined || !Web3Wrapper.checkIfAddress(address)) {
      throw new Error(
        'identity/web3: Invalid Ethereum address to send the token to'
      );
    }
    if (URI === undefined || !URI) {
      throw new Error('identity/web3: You need to provide an identity URI');
    }
    if (this.address !== undefined) {
      throw new Error(
        'identity/web3: A token has already been instanciated for this object'
      );
    }

    let contractMethod;
    switch (this.useCase) {
      case 'identity':
        contractMethod = this.contract.methods.newIdentity;
        break;
      case 'certificate':
        contractMethod = this.contract.methods.newCertificate;
        break;
      default:
        throw new Error(
          'wrapper/web3Wrapper: A valid use case must be provided'
        );
    }

    const res = contractMethod(address, URI).send({
      from: this.mainAddress,
      gas: this.gas,
    });
    const tokenId = res.events['Transfer'].returnValues['tokenId'];

    this.address = address;
    this.tokenId = tokenId;

    return tokenId;
  }

  /**
   * @description Fetches the information from the last token issued to an address
   * @param {string} address The address the token was issued to
   * @return {string} The token uri
   */
  async getTokenByAddress(address) {
    if (this.contract === undefined)
      throw new Error(
        'wrapper/web3Wrapper: You need to provide a contract artifact'
      );
    if (this.mainAddress === undefined)
      throw new Error(
        'wrapper/web3Wrapper: You need to provide a main address for operations'
      );
    if (address === undefined || !Web3Wrapper.checkIfAddress(address)) {
      throw new Error(
        'wrapper/web3Wrapper: Invalid Ethereum address to get the token from'
      );
    }

    const balanceOf = await this.contract.methods
      .balanceOf(address)
      .call({ from: this.mainAddress });
    if (balanceOf <= 0) {
      throw new Error('wrapper/web3Wrapper: No token issued for this address');
    }
    const tokenId = await this.contract.methods
      .tokenOfOwnerByIndex(address, balanceOf - 1)
      .call({ from: this.mainAddress });

    this.address = address;

    return await this.getTokenById(tokenId);
  }

  /**
   * @description Fetches the information from the a token
   * @param {string} tokenId The token id
   * @return {string} The token uri
   */
  async getTokenById(tokenId) {
    if (this.contract === undefined)
      throw new Error(
        'wrapper/web3Wrapper: You need to provide a contract artifact'
      );
    if (this.mainAddress === undefined)
      throw new Error(
        'wrapper/web3Wrapper: You need to provide a main address for operations'
      );

    const tokenURI = await this.contract.methods
      .tokenURI(tokenId)
      .call({ from: this.mainAddress });

    this.tokenId = tokenId;

    return tokenURI;
  }

  /**
   * @description Checks if an address is valid
   * @static
   * @param {string} address The address to check
   * @return {boolean}
   */
  static checkIfAddress(address) {
    return (
      (typeof address === 'string' || address instanceof String) &&
      address.length === 42 &&
      address.slice(0, 2) === '0x'
    );
  }
}

module.exports = { Web3Wrapper };
