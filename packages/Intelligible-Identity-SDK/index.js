const web3lib = require('./lib/web3');
const algolib = require('./lib/algo');
const aknlib = require('./lib/akn');

class IntelligibleIdentity {
  constructor() {
    this.web3 = {};
    this.algo = {};
    this.akn = {};
    this.information = {};
  }

  /////////////////////////////////////////// Prepare web3 ///////////////////////////////////////////
  async prepareNewIdentityWeb3(
    web3Provider,
    mainAddress,
    intelligibleIdArtifact,
    networkId
  ) {
    this.web3 = new web3lib.IdentityWeb3(
      web3Provider,
      intelligibleIdArtifact,
      networkId
    );
    await this.web3.setMainAddress(mainAddress);
    await this.web3.reserveTokenId();
  }

  async finalizeNewIdentityWeb3(uri, addressWeb3) {
    if (addressWeb3 === undefined) {
      // addressWeb3 = this.web3.newAddress();
      addressWeb3 = this.web3.mainAddress;
    }
    await this.web3.newIdentityTokenFromReserved(addressWeb3, uri);
  }

  /////////////////////////////////////////// Prepare Algo ///////////////////////////////////////////
  //TODO algo refactoring
  async prepareNewIdentityAlgo(
    baseServer,
    port,
    apiToken,
    mainAddressMnemonic
  ) {
    this.algo = new algolib.IdentityAlgo(
      baseServer,
      port,
      apiToken,
      mainAddressMnemonic,
      false
    );

    const identityAknURI = 'temp todo';
    const personalInformation = { name: 'temp', email: 'todo' };
    await this.algo.newIdentityToken(
      personalInformation,
      this.algo.newAddress().addr, //TODO
      identityAknURI
    );
  }

  //TODO algo refactoring
  async finalizeNewIdentityAlgo(uri, addressAlgo) {
    if (addressAlgo === 'undefined') {
      addressAlgo = this.algo.newAddress().addr;
    }
    console.log(uri + addressAlgo + 'TODO algo'); //TODO
  }

  /////////////////////////////////////////// Create AKN ///////////////////////////////////////////
  setPersonalInformation(personalInformation) {
    const identityAknURI = aknlib.IdentityAKN.aknUriFrom(
      personalInformation.name + Date.now()
    );
    this.information = { ...personalInformation, identityAknURI };
  }

  async newIdentityAKN(optionalNoPersonalSign) {
    if (!this.information) {
      throw new Error('identity: You need to set personal information first');
    }
    let createdWeb3 =
      this.web3 && this.web3.address === undefined && this.web3.tokenId;
    let createdAlgo =
      this.algo && this.algo.address === undefined && this.algo.tokenId;

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

  async newPersonIdentityStandard(
    personalInformation,
    optionalNoPersonalSign,
    web3Settings,
    algoSettings
  ) {
    let createWeb3 = true;
    let createAlgo = true;
    if (!web3Settings) {
      createWeb3 = false;
    }
    if (!algoSettings) {
      createAlgo = false;
    }

    if (createWeb3) {
      await this.prepareNewIdentityWeb3(
        web3Settings.web3Provider,
        web3Settings.mainAddress,
        web3Settings.intelligibleIdArtifact,
        web3Settings.networkId
      );
    }
    if (createAlgo) {
      await this.prepareNewIdentityAlgo(
        algoSettings.baseServer,
        algoSettings.port,
        algoSettings.apiToken,
        algoSettings.mainAddressMnemonic
      );
    }

    this.setPersonalInformation(personalInformation);

    await this.newIdentityAKN(optionalNoPersonalSign);

    if (createWeb3) {
      await this.finalizeNewIdentityWeb3(
        this.information.identityAknURI,
        web3Settings.addressWeb3
      );
    }
    if (createAlgo) {
      await this.finalizeNewIdentityAlgo(
        this.information.identityAknURI,
        algoSettings.addressAlgo
      );
    }

    // Finalize
    // const aknDocumentComplete = this.akn.finalize();
    // console.log(aknDocumentComplete);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////// From address web3 ///////////////////////////////////////////
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
    return await this.web3.getIdentityToken(addressWeb3); //tokenURI
  }

  /////////////////////////////////////////// From address algo ///////////////////////////////////////////
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
    // return await this.algo.getIdentityToken(addressAlgo); //tokenURI
  }

  /////////////////////////////////////////// From address akn ///////////////////////////////////////////
  fromAddressAKN(aknDocumentString) {
    this.akn = new aknlib.IdentityAKN.fromString(aknDocumentString);

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
