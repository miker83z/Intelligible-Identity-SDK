const algosdk = require('algosdk');

class AlgoWrapper {
  constructor(provider, port, apiToken) {
    console.log('TODO');
  }

  async newAddress() {
    try {
      const account = algosdk.generateAccount();
      console.log(account);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = { AlgoWrapper };
