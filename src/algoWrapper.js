const algosdk = require('algosdk');

class AlgoWrapper {
  constructor(provider, port, apiToken) {
    console.log('TODO');
  }

  newAddress() {
    return algosdk.generateAccount();
  }
}

module.exports = { AlgoWrapper };
