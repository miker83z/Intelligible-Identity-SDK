const web3lib = require('./lib/web3');
const algolib = require('./lib/algo');
const aknlib = require('./lib/akn');

/**
 * @description Represents an Intelligible Identity and includes tha objects that compose it.
 * This allows to create a new Intelligible Identity by issuing the identity tokens, to handle
 * the AKN document and to reconstruct an identity from text.
 */
class IntelligibleIdentity {
  /**
   * @description: Creates an empty instance of IntelligibleIdentity.
   */
  constructor() {
    this.web3 = {};
    this.algo = {};
    this.akn = {};
    this.information = {};
  }

  /**
   * @description Creates a new web3 object by initializing the provider and the main
   * address and then it reserves a tokenId that can be lather used to issue a token
   * @param {Object} web3Provider The web3 provider
   * @param {number|string} mainAddress The selected main address or its
   * position within the provider accounts list
   * @param {Object} intelligibleIdArtifact The json object containing the contract abi
   * @param {number} networkId The id of the network where the provider operates
   * @param {string} [addressWeb3] The Ethereum address to send the token to
   */
  async prepareNewIdentityWeb3(
    web3Provider,
    mainAddress,
    intelligibleIdArtifact,
    networkId,
    addressWeb3
  ) {
    this.web3 = new web3lib.IdentityWeb3(
      web3Provider,
      intelligibleIdArtifact,
      networkId
    );
    await this.web3.setMainAddress(mainAddress);
    await this.web3.reserveTokenId();
    if (addressWeb3 === undefined) {
      // addressWeb3 = this.web3.newAddress();
      addressWeb3 = this.web3.mainAddress;
    }
    this.web3.address = addressWeb3;
  }

  /**
   * @description Finalizes a web3 object by issuing the token, after it has been prepared
   * @param {string} uri The token uri. (Possibly an hash pointer).
   */
  async finalizeNewIdentityWeb3(uri) {
    if (!this.web3.mainAddress || !this.web3.provider || !this.web3.address) {
      throw new Error('identity: You need to prepare a web3 object first');
    }
    await this.web3.newTokenFromReserved(uri);
  }

  //TODO algo refactoring
  async prepareNewIdentityAlgo(
    baseServer,
    port,
    apiToken,
    mainAddressMnemonic,
    addressAlgo
  ) {
    this.algo = new algolib.IdentityAlgo(
      baseServer,
      port,
      apiToken,
      mainAddressMnemonic,
      false
    );

    if (addressAlgo === 'undefined') {
      addressAlgo = this.algo.newAddress().addr;
    }
    const identityAknURI = 'temp todo';
    const personalInformation = { name: 'temp', email: 'todo' };
    await this.algo.newIdentityToken(
      personalInformation,
      addressAlgo,
      identityAknURI
    );
  }

  //TODO algo refactoring
  async finalizeNewIdentityAlgo(uri) {
    console.log(uri + 'TODO algo'); //TODO
  }

  /**
   * @description Sets the personal information of a newly created intelligible identity
   * @param {Object} personalInformation Identity's personal information object
   */
  setPersonalInformation(personalInformation) {
    personalInformation.name =
      personalInformation.name.replace(/\s/g, '') + Date.now();
    const identityAknURI = aknlib.IdentityAKN.aknUriFrom(
      personalInformation.name
    );
    this.information = { ...personalInformation, identityAknURI };
  }

  /**
   * @description Creates a new akn object fetching the information from the personal
   * information object (setPersonalInformation required), the web3 object (not required)
   * and the algo object (not required)
   * @param {boolean} [optionalNoPersonalSign] The option for signing with eth.personal.sign
   * (if true) or eth.sign (if false)
   */
  async newIdentityAKN(optionalNoPersonalSign) {
    if (!this.information) {
      throw new Error('identity: You need to set personal information first');
    }
    let createdWeb3 = !!Object.keys(this.web3).length && !!this.web3.tokenId;
    let createdAlgo = !!Object.keys(this.algo).length && !!this.algo.tokenId;

    // AKN document
    this.akn = new aknlib.IdentityAKN(
      this.information.identityAknURI,
      this.information,
      createdWeb3 ? this.web3.address : 'addressWeb3',
      createdWeb3
        ? this.web3.contract.options.address
        : 'addressSmartContractWeb3',
      createdWeb3 ? this.web3.tokenId : 'tokenIdWeb3',
      createdAlgo ? this.algo.address : 'addressAlgo',
      createdAlgo ? this.algo.tokenId : 'tokenIdAlgo'
    );

    //Signatures
    this.akn.addSignature('softwareSignature', 'softwareSignature'); // Software signature TODO

    if (createdWeb3) {
      const signature = await this.web3.signData(
        this.akn.finalizeNoConclusions(),
        optionalNoPersonalSign
      );
      this.akn.addSignature(signature, 'identitySignature');
    }
  }

  /**
   * @description Creates a new Intelligible Identity for all the objects involved (
   * web3, algo, akn). It mainly aggregates the other methods found in this class.
   * @param {Object} personalInformation  Identity's personal information object
   * @param {boolean} [optionalNoPersonalSign] The option for signing with eth.personal.sign
   * (if true) or eth.sign (if false)
   * @param {Object} [web3Settings] An object containing the settings for creating a web3
   * object. If undefined, the object won't be created.
   * @param {Object} [algoSettings] An object containing the settings for creating a algo
   * object. If undefined, the object won't be created.
   */
  async newIdentityStandard(
    personalInformation,
    optionalNoPersonalSign,
    web3Settings,
    algoSettings
  ) {
    const createWeb3 = !!web3Settings;
    const createAlgo = !!algoSettings;

    if (createWeb3) {
      await this.prepareNewIdentityWeb3(
        web3Settings.web3Provider,
        web3Settings.mainAddress,
        web3Settings.intelligibleIdArtifact,
        web3Settings.networkId,
        web3Settings.addressWeb3
      );
    }
    if (createAlgo) {
      await this.prepareNewIdentityAlgo(
        algoSettings.baseServer,
        algoSettings.port,
        algoSettings.apiToken,
        algoSettings.mainAddressMnemonic,
        algoSettings.addressAlgo
      );
    }

    this.setPersonalInformation(personalInformation);

    await this.newIdentityAKN(optionalNoPersonalSign);

    if (createWeb3) {
      await this.finalizeNewIdentityWeb3(this.information.identityAknURI);
    }
    if (createAlgo) {
      await this.finalizeNewIdentityAlgo(this.information.identityAknURI);
    }
  }

  /**
   * @description Creates a web3 instance from an Ethereum address by searching for the last Identity
   * token issued to this. It returns the token URI used to derive/obtain the akn document.
   * @param {Object} web3Provider The web3 provider
   * @param {number|string} mainAddress The selected main address or its
   * position within the provider accounts list
   * @param {string} [addressWeb3] The address the token was issued to. If undefined the main address
   * will be used instead
   * @param {Object} intelligibleIdArtifact The json object containing the contract abi
   * @param {number} networkId The id of the network where the provider operates
   * @return {string} The token URI
   */
  async fromWeb3Address(
    web3Provider,
    mainAddress,
    addressWeb3,
    intelligibleIdArtifact,
    networkId
  ) {
    this.web3 = new web3lib.IdentityWeb3(
      web3Provider,
      intelligibleIdArtifact,
      networkId
    );
    await this.web3.setMainAddress(mainAddress);
    if (addressWeb3 === undefined) {
      // addressWeb3 = this.web3.newAddress();
      addressWeb3 = this.web3.mainAddress;
    }
    return await this.web3.getTokenByAddress(addressWeb3); //tokenURI
  }

  //TODO algo refactoring
  async fromAlgoAddress(
    baseServer,
    port,
    apiToken,
    mainAddressMnemonic,
    addressAlgo
  ) {
    this.algo = new algolib.IdentityAlgo(
      baseServer,
      port,
      apiToken,
      mainAddressMnemonic,
      false
    );

    return addressAlgo; //TODO
    // return await this.algo.getToken(addressAlgo); //tokenURI
  }

  /**
   * @description Creates an akn instance from a string that represents the AKN document
   * @param {string} aknDocumentString The string that represents the XML document
   */
  fromStringAKN(aknDocumentString) {
    this.akn = aknlib.IdentityAKN.fromString(aknDocumentString);

    const {
      name,
      email,
    } = this.akn.metaAndMain.akomaNtoso.doc.mainBody.tblock.find(
      (t) => t['@eId'] == 'tblock_1'
    ).p;

    const identityAknURI = this.akn.metaAndMain.akomaNtoso.doc.meta
      .identification.FRBRManifestation.FRBRthis['@value'];

    this.information = { name, email, identityAknURI };

    //TODO verify Signatures (certificate tests)
    //if (createdWeb3) { }
  }
}

module.exports = {
  IdentityWeb3: web3lib.IdentityWeb3,
  IdentityAlgo: algolib.IdentityAlgo,
  IdentityAKN: aknlib.IdentityAKN,
  IntelligibleIdentity,
};
