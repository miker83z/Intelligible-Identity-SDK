const web3lib = require('./lib/web3');
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
    this.akn = {};
    this.information = {};
  }

  /**
   * @description Creates a new web3 object by initializing the provider and the main
   * address and then it reserves a tokenId that can be later used to issue a token
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

  /**
   * @description Sets the information of a newly created intelligible certificate
   * @param {Object} information Certificate's information object
   * @param {Object} references Certificate's references object
   */
  setCertificateInformation(information, references) {
    this.information = information;
    this.references = references;
  }

  /**
   * @description Creates a new akn object fetching the information from the certificate
   * information object (setCertificateInformation required) and the web3 object (not required)
   * PROVIDER AND RECEIVER SIGNATURES ARE NOT INCLUDED.
   * @param {Object} [information] Certificate's information object
   * @param {Object} [references] Certificate's references object
   */
  newCertificateAKN(information, references) {
    if (information !== undefined) {
      this.information = information;
    }
    if (references !== undefined) {
      this.references = references;
    }
    if (!this.information || !this.references) {
      throw new Error(
        'certificate: You need to set certificate information and references first'
      );
    }
    let createdWeb3 = this.web3 && this.web3.tokenId;

    const tmpAdditionalBody =
      this.information.additionalBody !== undefined
        ? this.information.additionalBody
        : {};
    const tmpFRBRWork =
      this.information.FRBRWork !== undefined ? this.information.FRBRWork : {};
    const tmpFRBRExpression =
      this.information.FRBRExpression !== undefined
        ? this.information.FRBRExpression
        : {};
    const tmpFRBRManifestation =
      this.information.FRBRManifestation !== undefined
        ? this.information.FRBRManifestation
        : {};

    const certificateElements = {
      identification: {
        FRBRWork: {
          FRBRthis: {
            '@value': `/akn/eu/doc/intelligibleCertificate/${this.references.certIssuer.name}/${this.information.certificateType}/${this.information.certifiedEntityType}/${this.references.certEntity.name}/!main`,
          },
          FRBRuri: {
            '@value': `/akn/eu/doc/intelligibleCertificate/${this.references.certIssuer.name}/${this.information.certificateType}/${this.information.certifiedEntityType}/${this.references.certEntity.name}/`,
          },
          FRBRdate: { '@date': this.information.certificateDate },
          FRBRauthor: {
            '@href': this.references.certIssuerRepresentative['@eId'],
          },
          ...tmpFRBRWork,
        },
        FRBRExpression: {
          FRBRthis: {
            '@value': `/akn/eu/doc/intelligibleCertificate/${this.references.certIssuer.name}/${this.information.certificateType}/${this.information.certifiedEntityType}/${this.references.certEntity.name}/${this.information.certificateExpression}/!main`,
          },
          FRBRuri: {
            '@value': `/akn/eu/doc/intelligibleCertificate/${this.references.certIssuer.name}/${this.information.certificateType}/${this.information.certifiedEntityType}/${this.references.certEntity.name}/${this.information.certificateExpression}/`,
          },
          FRBRdate: { '@date': this.information.certificateDate },
          FRBRauthor: {
            '@href': this.references.certIssuerRepresentative['@eId'],
          },
          ...tmpFRBRExpression,
        },
        FRBRManifestation: {
          FRBRthis: {
            '@value': `/akn/eu/doc/intelligibleCertificate/${this.references.certIssuer.name}/${this.information.certificateType}/${this.information.certifiedEntityType}/${this.references.certEntity.name}/${this.information.certificateExpression}/!main.xml`,
          },
          FRBRuri: {
            '@value': `/akn/eu/doc/intelligibleCertificate/${this.references.certIssuer.name}/${this.information.certificateType}/${this.information.certifiedEntityType}/${this.references.certEntity.name}/${this.information.certificateExpression}.akn`,
          },
          FRBRdate: { '@date': this.information.certificateDate },
          FRBRauthor: {
            '@href': this.references.certIssuerRepresentative['@eId'],
          },
          ...tmpFRBRManifestation,
        },
      },
      references: this.references,
      prefaceTitle: `${this.information.certificateType} Certificate issued by ${this.references.certIssuer.name} to ${this.references.certReceiver.name} in reference to ${this.references.certEntity.name}`,
      mainBody: {
        information: {
          blockTitle: 'Certified Entity Information',
          p: {
            certificateType: this.information.certificateType,
            certifiedEntityType: this.information.certifiedEntityType,
            certificateDate: this.information.certificateDate,
            certificateExpression: this.information.certificateExpression,
            certificateEntity: this.references.certEntity['@eId'],
            certifiedEntityName: this.references.certEntity.name,
            certifiedEntityRepresentativeDocumentHashDigest: this.references
              .certEntity.documentHashDigest,
          },
        },
        web3: {
          blockTitle: 'Ethereum Token Reference',
          p: {
            smartContractAddress: createdWeb3
              ? this.web3.contract.options.address
              : 'addressSmartContractWeb3',
            tokenId: createdWeb3 ? this.web3.tokenId : 'tokenIdWeb3',
          },
        },
        identities: {
          blockTitle: 'Identities',
          p: {
            certificateIssuer: this.references.certIssuer['@eId'],
            certificateIssuerRepresentative: this.references
              .certIssuerRepresentative['@eId'],
            certReceiver: this.references.certReceiver['@eId'],
          },
        },
        ...tmpAdditionalBody,
      },
    };

    // AKN document
    this.akn = new aknlib.CertificateAKN(certificateElements);

    //Signatures
    this.akn.addSignature('softwareSignature', 'softwareSignature'); // Software signature TODO
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
  CertificateAKN: aknlib.CertificateAKN,
  IntelligibleCertificate,
};
