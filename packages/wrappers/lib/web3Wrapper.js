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
