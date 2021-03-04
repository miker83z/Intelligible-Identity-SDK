const { IdentityWeb3 } = require('./lib/web3');
const { IdentityAKN } = require('./lib/akn');

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
    this.akn = {};
    this.information = {};
  }

  /**
   * @description Creates a new web3 object by initializing the provider and the main
   * address and then it reserves a tokenId that can be lather used to issue a token
   * @param {Object} web3Provider The web3 provider
   * @param {number|string} mainAddress The selected main address or its
   * position within the provider accounts list
   * @param {string} [addressWeb3] The Ethereum address to send the token to
   * @param {number} [networkId] The id of the network where the provider operates
   * @param {Object} [intelligibleIdArtifact] The json object containing the contract abi
   */
  async prepareNewIdentityWeb3(
    web3Provider,
    mainAddress,
    addressWeb3,
    networkId,
    intelligibleIdArtifact
  ) {
    this.web3 = new IdentityWeb3(
      web3Provider,
      networkId,
      intelligibleIdArtifact
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

  /**
   * @description Sets the personal information of a newly created intelligible identity
   * @param {Object} information Identity's personal information object
   * @param {Object} references Identity's references object
   */
  setIdentityInformation(information, references) {
    this.information = information;
    this.references = references;
  }

  /**
   * @description Creates a new akn object fetching the information from the personal
   * information object (setIdentityInformation required), the web3 object (not required)
   * and the algo object (not required)
   * @param {boolean} [optionalNoPersonalSign] The option for signing with eth.personal.sign
   * (if true) or eth.sign (if false)
   * @param {Object} [information] Identity's personal information object
   * @param {Object} [references] Identity's references object
   */
  async newIdentityAKN(optionalNoPersonalSign, information, references) {
    if (information !== undefined) {
      this.information = information;
    }
    if (references !== undefined) {
      this.references = references;
    }
    if (!this.information || !this.references) {
      throw new Error(
        'identity: You need to set identity information and references first'
      );
    }
    let createdWeb3 = !!Object.keys(this.web3).length && !!this.web3.tokenId;

    const web3Information = {
      accountAddress: {
        '@eId': 'identityEthereumAccountAddress',
        '#': createdWeb3 ? this.web3.address : 'addressWeb3',
      },
      smartContractAddress: createdWeb3
        ? this.web3.contract.options.address
        : 'addressSmartContractWeb3',
      tokenId: createdWeb3 ? this.web3.tokenId : 'tokenIdWeb3',
    };

    // AKN document
    this.akn = new IdentityAKN(
      this.information,
      this.references,
      web3Information
    );

    //Signatures
    this.akn.addSwSignature(
      this.references.idIssuerSoftware['@eId'],
      this.references.idIssuerSoftware.name,
      'softwareSignature' // Software signature TODO
    );

    if (createdWeb3) {
      const signature = await this.web3.signData(
        this.akn.finalizeNoConclusions(),
        optionalNoPersonalSign
      );
      this.akn.addSignature(
        this.references.idIssuerRepresentative['@eId'],
        this.references.idIssuerRepresentative.name,
        this.references.idIssuerRepresentativeRole['@eId'],
        this.references.idIssuerRepresentativeRole.name,
        this.references.idIssuerRepresentative['@href'], //TODO
        this.web3.mainAddress,
        Date.now(),
        signature
      );
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
   * @param {number} [networkId] The id of the network where the provider operates
   * @param {Object} [intelligibleIdArtifact] The json object containing the contract abi
   * @return {string} The token URI
   */
  async fromWeb3Address(
    web3Provider,
    mainAddress,
    addressWeb3,
    networkId,
    intelligibleIdArtifact
  ) {
    this.web3 = new IdentityWeb3(
      web3Provider,
      networkId,
      intelligibleIdArtifact
    );
    await this.web3.setMainAddress(mainAddress);
    if (addressWeb3 === undefined) {
      // addressWeb3 = this.web3.newAddress();
      addressWeb3 = this.web3.mainAddress;
    }
    return await this.web3.getTokenByAddress(addressWeb3); //tokenURI
  }

  /**
   * @description Creates an akn instance from a string that represents the AKN document
   * @param {string} aknDocumentString The string that represents the XML document
   */
  async fromStringAKN(
    aknDocumentString,
    web3Provider,
    networkId,
    intelligibleIdArtifact
  ) {
    this.akn = IdentityAKN.fromString(aknDocumentString);

    if (web3Provider !== undefined) {
      const identityEthereumAccountAddressEle = this.akn.findValueByEId(
        'identityEthereumAccountAddress'
      );

      if (identityEthereumAccountAddressEle !== undefined) {
        this.web3 = new IdentityWeb3(
          web3Provider,
          networkId,
          intelligibleIdArtifact
        );

        this.web3.address = identityEthereumAccountAddressEle.node.textContent;
      }
    }
  }
}

module.exports = {
  IdentityWeb3,
  IdentityAKN,
  IntelligibleIdentity,
};
