const web3lib = require('./lib/web3');
const algolib = require('./lib/algo');
const aknlib = require('./lib/akn');

/**
 * @description Represents an Intelligible Certificate and includes tha objects that compose it.
 * This allows to create a new Intelligible Certificate by issuing the Certificate tokens, to handle
 * the AKN document and to reconstruct an Certificate from text.
 */
class IntelligibleCertificate {
  /**
   * @description: Creates an empty instance of IntelligibleCertificate.
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
   * @param {Object} intelligibleCertArtifact The json object containing the contract abi
   * @param {number} networkId The id of the network where the provider operates
   * @param {string} addressWeb3 The Ethereum address to send the token to
   */
  async prepareNewCertificateWeb3(
    web3Provider,
    mainAddress,
    intelligibleCertArtifact,
    networkId,
    addressWeb3
  ) {
    if (addressWeb3 === undefined) {
      throw new Error(
        'certificate: You need to provide a valid receiver address'
      );
    }
    this.web3 = new web3lib.CertificateWeb3(
      web3Provider,
      intelligibleCertArtifact,
      networkId
    );
    await this.web3.setMainAddress(mainAddress);
    await this.web3.reserveTokenId();
    this.web3.address = addressWeb3;
  }

  /**
   * @description Finalizes a web3 object by issuing the token, after it has been prepared
   * @param {string} uri The token uri. (Possibly an hash pointer).
   */
  async finalizeNewCertificateWeb3(uri) {
    if (!this.web3.mainAddress || !this.web3.provider || !this.web3.address) {
      throw new Error('certificate: You need to prepare a web3 object first');
    }
    await this.web3.newTokenFromReserved(uri);
  }

  //TODO algo refactoring
  async prepareNewCertificateAlgo(
    baseServer,
    port,
    apiToken,
    mainAddressMnemonic,
    addressAlgo
  ) {
    console.log(
      baseServer +
        port +
        apiToken +
        mainAddressMnemonic +
        addressAlgo +
        'TODO algo'
    ); //TODO
  }

  //TODO algo refactoring
  async finalizeNewCertificateAlgo(uri) {
    console.log(uri + 'TODO algo'); //TODO
  }

  /**
   * @description Sets the information of a newly created intelligible certificate
   * @param {Object} information Certificate's information object
   */
  setCertificateInformation(information) {
    information.name = information.name.replace(/\s/g, '') + Date.now();
    const certificateAknURI = aknlib.CertificateAKN.aknUriFrom(
      information.name
    );
    this.information = { ...information, certificateAknURI };
  }

  /**
   * @description Creates a new akn object fetching the information from the certificate
   * information object (setCertificateInformation required), the web3 object (not required)
   * and the algo object (not required). PROVIDER AND RECEIVER SIGNATURES ARE NOT INCLUDED.
   * @param {string} certifiableEntityOwnerIdentityURI The receiver URI
   * @param {string} certificateProviderIdentityURI The provider URI
   */
  newCertificateAKN(
    certifiableEntityOwnerIdentityURI,
    certificateProviderIdentityURI
  ) {
    if (!this.information) {
      throw new Error(
        'certificate: You need to set personal information first'
      );
    }
    let createdWeb3 = this.web3 && this.web3.tokenId;
    let createdAlgo = this.algo && this.algo.tokenId;

    // AKN document
    this.akn = new aknlib.CertificateAKN(
      this.information.certificateAknURI,
      this.information,
      createdWeb3
        ? this.web3.contract.options.address
        : 'addressSmartContractWeb3',
      createdWeb3 ? this.web3.tokenId : 'tokenIdWeb3',
      createdAlgo ? this.algo.address : 'addressAlgo',
      createdAlgo ? this.algo.tokenId : 'tokenIdAlgo',
      certifiableEntityOwnerIdentityURI,
      certificateProviderIdentityURI
    );

    //Signatures
    this.akn.addSignature('softwareSignature', 'softwareSignature'); // Software signature TODO
  }

  /**
   * @description Creates a new Intelligible Certificate for all the objects involved (
   * web3, algo, akn). It mainly aggregates the other methods found in this class.
   * @param {Object} certificateInformation  Certificate's information object
   * @param {Object} [web3Settings] An object containing the settings for creating a web3
   * object. If undefined, the object won't be created.
   * @param {Object} [algoSettings] An object containing the settings for creating a algo
   * object. If undefined, the object won't be created.
   */
  async newCertificateStandard(
    certificateInformation,
    web3Settings,
    algoSettings
  ) {
    const createWeb3 = !!web3Settings;
    const createAlgo = !!algoSettings;

    if (createWeb3) {
      await this.prepareNewCertificateWeb3(
        web3Settings.web3Provider,
        web3Settings.mainAddress,
        web3Settings.intelligibleCertArtifact,
        web3Settings.networkId,
        web3Settings.addressWeb3
      );
    }
    if (createAlgo) {
      await this.prepareNewCertificateAlgo(
        algoSettings.baseServer,
        algoSettings.port,
        algoSettings.apiToken,
        algoSettings.mainAddressMnemonic,
        algoSettings.addressAlgo
      );
    }

    this.setCertificateInformation(certificateInformation);

    this.newCertificateAKN();

    if (createWeb3) {
      await this.finalizeNewCertificateWeb3(this.information.certificateAknURI);
    }
    if (createAlgo) {
      await this.finalizeNewCertificateAlgo(this.information.certificateAknURI);
    }
  }

  /**
   * @description Creates a web3 instance from a token id. It returns the token URI used to derive/obtain
   * the akn document.
   * @param {Object} web3Provider The web3 provider
   * @param {number|string} mainAddress The selected main address or its
   * position within the provider accounts list
   * @param {string} tokenId The token id
   * @param {Object} intelligibleCertArtifact The json object containing the contract abi
   * @param {number} networkId The id of the network where the provider operates
   * @return {string} The token URI
   */
  async fromWeb3TokenId(
    web3Provider,
    mainAddress,
    tokenId,
    intelligibleCertArtifact,
    networkId
  ) {
    this.web3 = new web3lib.IdentityWeb3(
      web3Provider,
      intelligibleCertArtifact,
      networkId
    );
    await this.web3.setMainAddress(mainAddress);
    return await this.web3.getTokenById(tokenId); //tokenURI
  }

  //TODO algo refactoring
  async fromAlgoTokenId(
    baseServer,
    port,
    apiToken,
    mainAddressMnemonic,
    addressAlgo
  ) {
    console.log(
      baseServer +
        port +
        apiToken +
        mainAddressMnemonic +
        addressAlgo +
        'TODO algo'
    ); //TODO
    // return await this.algo.getTokenByAddress(addressAlgo); //tokenURI
  }

  /**
   * @description Creates an akn instance from a string that represents the AKN document
   * @param {string} aknDocumentString The string that represents the XML document
   */
  fromStringAKN(aknDocumentString) {
    this.akn = aknlib.CertificateAKN.fromString(aknDocumentString);

    const {
      name,
      uri,
      documentDigest,
    } = this.akn.metaAndMain.akomaNtoso.doc.mainBody.tblock.find(
      (t) => t['@eId'] == 'tblock_1'
    ).p;

    const certificateAknURI = this.akn.metaAndMain.akomaNtoso.doc.meta
      .identification.FRBRManifestation.FRBRthis['@value'];

    this.information = { name, uri, documentDigest, certificateAknURI };

    //TODO verify Signatures (certificate tests)
    //if (createdWeb3) { }
  }
}

module.exports = {
  CertificateWeb3: web3lib.CertificateWeb3,
  CertificateAlgo: algolib.CertificateAlgo,
  CertificateAKN: aknlib.CertificateAKN,
  IntelligibleCertificate,
};
