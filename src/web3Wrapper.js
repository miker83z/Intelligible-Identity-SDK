const Web3 = require('web3');
//const Web3 = require('./../dist/web3.min.js');
const aknBuilder = require('./aknBuilder');

class Web3Wrapper {
  constructor(provider, contractArtifact, networkId) {
    this.web3 = new Web3(provider);

    //const contractArtifact = await JSON.parse(contractArtifactRaw);
    this.contract = new this.web3.eth.Contract(
      contractArtifact.abi,
      contractArtifact.networks[networkId].address
    );
    this.contract.setProvider(provider);
  }

  async newIdentityToken(data) {
    if (
      this.web3 === 'undefined' &&
      this.contract === 'undefined' &&
      data.name === 'undefined'
    )
      return;

    const identityAknURI = aknBuilder.AKNUriString(data.name);
    const accounts = await this.web3.eth.getAccounts();
    const publicKey = accounts[0];

    try {
      const res = await this.contract.methods
        .newIdentity(publicKey, identityAknURI)
        .send({ from: publicKey, gas: 1000000 });
      const tokenId = res.events['Transfer'].returnValues['tokenId'];
      console.log('Token Id:' + tokenId);

      return { identityAknURI, publicKey, tokenId };
    } catch (error) {
      console.log('Token Creation Error: ' + error);
    }
  }

  async signData(data) {
    if (this.web3 === 'undefined') return;
    const signers = await this.web3.eth.getAccounts();
    if (signers.length < 1) return;

    //const signature = await this.web3.eth.personal.sign(data, signers[0]);
    const signature = await this.web3.eth.sign(data, signers[0]);

    return aknBuilder.ultimate(data, signature);
  }

  async newAddress() {
    if (this.web3 === 'undefined' && this.contract === 'undefined') return;
    this.idAddress = this.web3.eth.accounts.create();

    //this.web3.eth.accounts.wallet.add(this.idAddress);
    //console.log(this.web3.eth.accounts.wallet.length);

    //console.log(await this.web3.eth.getAccounts());
    //const ac = await this.web3.eth.personal.newAccount('');
  }
}

module.exports = { Web3Wrapper };
