const { CertificateMeta } = require('./lib/meta');
const { Web3Wrapper } = require('intelligible-nft-web3');
const { NoStandardSignatureDoc } = require('intelligible-nostdsign-doc');

/**
 * @description Represents an Intelligible Certificate and includes tha objects that compose it.
 * This allows to create a new Intelligible Certificate by issuing the Certificate tokens, to handle
 * the metadata document and to reconstruct an Certificate from text.
 */
class IntelligibleCertificate {
  /**
   * @description: Creates an empty instance of IntelligibleCertificate.
   */
  constructor() {
    this.web3 = {};
    this.meta = {};
    this.references = {};
    this.information = {};
    this.hashDigest = {};
    this.signatures = {};
  }

  /**
   * @description Creates a new web3 object by initializing the provider and the main
   * address and then it reserves a tokenId that can be later used to issue a token
   * @param {Object} web3Provider The web3 provider
   * @param {number|string} mainAddress The selected main address or its
   * position within the provider accounts list
   * @param {string} addressWeb3 The Ethereum address to send the token to
   * @param {number} [networkId] The id of the network where the provider operates
   * @param {Object} [intelligibleCertArtifact] The json object containing the contract abi
   */
  async prepareNewCertificateWeb3(
    web3Provider,
    mainAddress,
    addressWeb3,
    networkId,
    intelligibleCertArtifact
  ) {
    if (addressWeb3 === undefined) {
      throw new Error(
        'certificate: You need to provide a valid receiver address'
      );
    }
    this.web3 = new Web3Wrapper(
      web3Provider,
      'certificate',
      networkId,
      intelligibleCertArtifact
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
    this.information = JSON.parse(JSON.stringify(information));
    this.references = JSON.parse(JSON.stringify(references));
  }

  /**
   * @description Creates a new meta object fetching the information from the certificate
   * information object
   * @param {Object} [information] Certificate's information object
   * @param {Object} [references] Certificate's references object
   */
  newCertificateMeta(information, references) {
    if (!this.information || !this.references) {
      throw new Error(
        'certificate: You need to set certificate information and references first'
      );
    }
    this.setCertificateInformation(information, references);

    // Meta document
    this.meta = new CertificateMeta(this.information, this.references);
  }

  /**
   * @description Creates a new signature object that represents a signature on the
   * Certificate's meta object (hash digest).
   * @param {string} eId Signatory eID
   * @param {string} entity Signatory entity
   * @param {string} timestamp Certificate's meta object signature timestamp
   * @param {string} signat Certificate's meta object signature
   */
  async addSignatureToCertificate(eId, entity, timestamp, signat) {
    if (signat === undefined) {
      throw new Error(
        'certificate: You need to set certificate signature first'
      );
    }

    //Signature
    const signature = new NoStandardSignatureDoc();
    signature.addSignature(
      '#' + eId, //'#icertIssuer',
      entity, //this.references.icertIssuer.entity,
      timestamp,
      signat
    );
    this.signatures[eId] = signature;
  }

  /**
   * @description Creates a web3 instance from a token id. It returns the token URI used to derive/obtain
   * the meta document.
   * @param {Object} web3Provider The web3 provider
   * @param {number|string} mainAddress The selected main address or its
   * position within the provider accounts list
   * @param {string} tokenId The token id
   * @param {number} [networkId] The id of the network where the provider operates
   * @param {Object} [intelligibleCertArtifact] The json object containing the contract abi
   * @return {string} The token URI
   */
  async fromWeb3TokenId(
    web3Provider,
    mainAddress,
    tokenId,
    networkId,
    intelligibleCertArtifact
  ) {
    this.web3 = new Web3Wrapper(
      web3Provider,
      'certificate',
      networkId,
      intelligibleCertArtifact
    );
    await this.web3.setMainAddress(mainAddress);
    return await this.web3.getTokenById(tokenId); //tokenURI
  }

  /**
   * @description Creates an meta instance from a string that represents the Meta document
   * @param {string} aknDocumentString The string that represents the XML document
   */
  fromStringMeta(aknDocumentString) {
    this.meta = CertificateMeta.fromString(aknDocumentString);
    const { information, references } =
      this.meta.parseInformationAndReferences();
    this.setCertificateInformation(information, references);
  }

  /**
   * @description Creates a signature instance from a string that represents the signature document
   * @param {string} indexKey The key for indexing the signature
   * @param {string} signatureDocumentString The string that represents the signature XML document
   */
  async fromStringSignature(indexKey, signatureDocumentString) {
    this.signatures[indexKey] = NoStandardSignatureDoc.fromString(
      signatureDocumentString
    );
  }
}

module.exports = {
  CertificateMeta,
  IntelligibleCertificate,
};
