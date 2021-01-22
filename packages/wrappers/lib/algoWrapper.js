const algosdk = require('algosdk');

class AlgoWrapper {
  constructor(provider, port, apiToken, mainAddressMnemonic, debug) {
    this.provider = provider;
    this.port = port;
    this.apiToken = apiToken;
    this.mainAddress = algosdk.mnemonicToSecretKey(mainAddressMnemonic);
    this.debug = debug === undefined ? false : debug;
    this.algosdk = algosdk;

    this.algodClient = new this.algosdk.Algodv2(apiToken, provider, port);
  }

  static fromMnemonic(mnemonic) {
    return this.algosdk.mnemonicToSecretKey(mnemonic);
  }

  // Function used to wait for a tx confirmation
  async waitForConfirmation(txId) {
    let response = await this.algodClient.status().do();
    let lastround = response['last-round'];
    for (;;) {
      const pendingInfo = await this.algodClient
        .pendingTransactionInformation(txId)
        .do();
      if (
        pendingInfo['confirmed-round'] !== null &&
        pendingInfo['confirmed-round'] > 0
      ) {
        //Got the completed Transaction
        console.log(
          'Transaction ' +
            txId +
            ' confirmed in round ' +
            pendingInfo['confirmed-round']
        );
        break;
      }
      lastround++;
      await this.algodClient.statusAfterBlock(lastround).do();
    }
  }

  // Function used to print created asset for account and assetid
  async printCreatedAsset(account, assetid) {
    let accountInfo = await this.algodClient.accountInformation(account).do();
    for (let idx = 0; idx < accountInfo['created-assets'].length; idx++) {
      let scrutinizedAsset = accountInfo['created-assets'][idx];
      if (scrutinizedAsset['index'] == assetid) {
        console.log('AssetID = ' + scrutinizedAsset['index']);
        let myparms = JSON.stringify(scrutinizedAsset['params'], undefined, 2);
        console.log('parms = ' + myparms);
        break;
      }
    }
  }

  // Function used to print asset holding for account and assetid
  static async printAssetHolding(account, assetid) {
    let accountInfo = await this.algodClient.accountInformation(account).do();
    for (let idx = 0; idx < accountInfo['assets'].length; idx++) {
      let scrutinizedAsset = accountInfo['assets'][idx];
      if (scrutinizedAsset['asset-id'] == assetid) {
        let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
        console.log('assetholdinginfo = ' + myassetholding);
        break;
      }
    }
  }
}

module.exports = { AlgoWrapper };
