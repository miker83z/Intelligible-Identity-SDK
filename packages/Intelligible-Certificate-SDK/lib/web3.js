const { Web3Wrapper } = require('@intelligiblesuite/wrappers');

class CertificateWeb3 extends Web3Wrapper {
  async newCertificateToken(data, receiverAddress, certificateAknURI) {
    if (
      this.web3 === 'undefined' &&
      this.contract === 'undefined' &&
      this.txIssuer === 'undefined' &&
      data.name === 'undefined'
    )
      return;
    try {
      const res = await this.contract.methods
        .newCertificate(receiverAddress, certificateAknURI)
        .send({ from: this.txIssuer, gas: 1000000 });
      const tokenId = res.events['Transfer'].returnValues['tokenId'];
      console.log('Token Id:' + tokenId);

      this.receiverAddress = receiverAddress;
      this.tokenId = tokenId;

      return tokenId;
    } catch (error) {
      console.log('Token Creation Error: ' + error);
    }
  }
}

module.exports = { CertificateWeb3 };
