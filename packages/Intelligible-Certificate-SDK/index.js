const web3lib = require('./lib/web3');
const algolib = require('./lib/algo');
const aknlib = require('./lib/akn');

class IntelligibleCertificate {
  constructor() {
    this.web3 = {};
    this.algo = {};
    this.akn = {};
  }

  async newCertificateStandard(
    certificateInformation,
    certificateProviderIID,
    certificateReceiverIID,
    web3Settings,
    algoSettings
  ) {
    const certificateAknURI = aknlib.CertificateAKN.aknUriFrom(
      certificateInformation.name
    );
    let createWeb3 = true;
    let createAlgo = true;
    if (web3Settings === undefined) {
      createWeb3 = false;
    }
    if (algoSettings === undefined) {
      createAlgo = false;
    }

    //Web3
    if (createWeb3) {
      await this.newCertificateWeb3(
        certificateAknURI,
        certificateInformation,
        web3Settings.web3Provider,
        web3Settings.txIssuer,
        web3Settings.receiverAddress,
        web3Settings.intelligibleCertArtifact,
        web3Settings.networkId
      );
    }

    // Algorand
    if (createAlgo) {
      await this.newCertificateAlgo(
        certificateAknURI,
        certificateInformation,
        algoSettings.baseServer,
        algoSettings.port,
        algoSettings.apiToken,
        algoSettings.txIssuerMnemonic,
        algoSettings.receiverAddress
      );
    }

    // AKN document
    this.akn = new aknlib.CertificateAKN(
      certificateAknURI,
      certificateInformation,
      createWeb3
        ? this.web3.contract.options.address
        : 'addressSmartContractWeb3',
      createWeb3 ? this.web3.tokenId : 'tokenIdWeb3',
      createAlgo ? this.algo.receiverAddress : 'addressAlgo',
      createAlgo ? this.algo.tokenId : 'tokenIdAlgo'
    );

    //Signatures
    this.akn.addSignature('softwareSignature', 'softwareSignature'); // Software signature TODO
    const providerSignature = await certificateProviderIID.web3.signDataNoPersonal(
      this.akn.finalizeNoConclusions()
    );
    this.akn.addSignature(providerSignature, 'providerSignature');
    const ownerSignature = await certificateReceiverIID.web3.signDataNoPersonal(
      this.akn.finalizeNoConclusions()
    );
    this.akn.addSignature(ownerSignature, 'ownerSignature');

    // Finalize
    const aknDocumentComplete = this.akn.finalize();
    // console.log(aknDocumentComplete);
  }

  async newCertificateWeb3(
    certificateAknURI,
    certificateInformation,
    web3Provider,
    txIssuer,
    receiverAddress,
    intelligibleCertArtifact,
    networkId
  ) {
    this.web3 = new web3lib.CertificateWeb3(
      web3Provider,
      intelligibleCertArtifact,
      networkId
    );
    await this.web3.setTxIssuer(txIssuer);
    await this.web3.newCertificateToken(
      certificateInformation,
      receiverAddress,
      certificateAknURI
    );
  }

  async newCertificateAlgo(
    certificateAknURI,
    certificateInformation,
    baseServer,
    port,
    apiToken,
    mnemonic,
    receiverAddress
  ) {
    this.algo = new algolib.CertificateAlgo(
      baseServer,
      port,
      apiToken,
      mnemonic,
      false
    );
    const tokenIdAlgo = await this.algo.newCertificateToken(
      certificateInformation,
      receiverAddress,
      certificateAknURI
    );
  }
}

module.exports = {
  CertificateWeb3: web3lib.CertificateWeb3,
  CertificateAlgo: algolib.CertificateAlgo,
  CertificateAKN: aknlib.CertificateAKN,
  IntelligibleCertificate,
};
