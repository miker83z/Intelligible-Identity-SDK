const algosdk = require('algosdk');

/**
 * @description Wraps the algorand library into a class. Allows to instantiate am
 * Algorand client object and sets a designated transaction issuer.
 */
class AlgoWrapper {
  /**
   * @description Creates an instance of AlgoWrapper. Allows to create an instance
   * using a provider object that includes apiToken, baseServer and port information
   * @param {Object} provider The provider object that includes apiToken, baseServer
   * and port information
   * @param {boolean} debug A parameter for indicating whether to show logs on console
   * or not
   */
  constructor(provider, debug) {
    if (provider === undefined || !provider)
      throw new Error('wrapper/AlgoWrapper: Provider not set');
    this.provider = provider;
    this.debug = debug === undefined ? false : debug;

    this.algodClient = new algosdk.Algodv2(
      provider.apiToken,
      provider.baseServer,
      provider.port
    );
  }

  /**
   * @description Creates an alorand account from a mnemonic string
   * @static
   * @param {string} mnemonic The mnemonic string
   * @return {Object} The created account object
   */
  static fromMnemonic(mnemonic) {
    return algosdk.mnemonicToSecretKey(mnemonic);
  }

  /**
   * @description Generates a new account
   * @return {Object} An object containing address, secret key and mnemonic
   */
  static newAddress() {
    const account = algosdk.generateAccount();
    const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
    return {
      addr: account.addr,
      sk: account.sk,
      mnemonic,
    };
  }

  /**
   * @description Sets the main address for operating with the dlt,
   * i,e. issuing a transactions, signing
   * @param {Object} address The selected main address object containing also the
   * secret key
   */
  async setMainAddress(address) {
    this.mainAddress = address;
  }

  /**
   * @description Create a new asset
   * @param {Object} assetConfig An object containing the information of the asset
   * to create
   * @param {string} receivingAddress The address of the asset receiver
   * @return {string} The id of the asset
   */
  async newAsset(assetConfig, receivingAddress) {
    if (this.mainAddress === undefined)
      throw new Error(
        'wrapper/algoWrapper: You need to provide a main address for operations'
      );

    //createAsset
    if (this.debug) {
      let accountInfo = await this.algodClient
        .accountInformation(this.mainAddress.addr)
        .do();
      console.log('Account balance: %d microAlgos', accountInfo.amount);
    }

    const params = await this.algodClient.getTransactionParams().do();
    //params.fee = 1000;
    //params.flatFee = true;
    const addr = this.mainAddress.addr; //tx sender

    const note = undefined; // arbitrary data
    const defaultFrozen = true; //cannot transfer it
    const decimals = 0;
    const totalIssuance = 1; // total number of this asset

    const { unitName, assetName, assetURL, assetMetadataHash } = assetConfig;
    // Optional string pointing to a URL relating to the asset, max 32 chars
    // Optional hash commitment of some sort relating to the asset. 32 character length.

    // The following parameters are the only ones
    // that can be changed, and they have to be changed
    // by the current manager
    const manager = receivingAddress;
    const reserve = receivingAddress; // Considered the asset reserve
    const freeze = receivingAddress; // Can freeze or unfreeze
    const clawback = receivingAddress; // Can revoke user asset holdings and send
    // them to other addresses

    const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
      addr,
      note,
      totalIssuance,
      decimals,
      defaultFrozen,
      manager,
      reserve,
      freeze,
      clawback,
      unitName,
      assetName,
      assetURL,
      assetMetadataHash,
      params
    );
    const rawSignedTxn = txn.signTxn(this.mainAddress.sk);
    const tx = await this.algodClient.sendRawTransaction(rawSignedTxn).do();

    // wait for transaction to be confirmed
    await this.waitForConfirmation(tx.txId);

    // Get the new asset's information from the creator account
    let ptx = await this.algodClient
      .pendingTransactionInformation(tx.txId)
      .do();
    const assetID = ptx['asset-index'];

    if (this.debug) {
      console.log('Transaction : ' + tx.txId);
      await this.printCreatedAsset(this.mainAddress.addr, assetID);
      //await this.printAssetHolding(this.algodClient, this.mainAddress.addr, assetID);
    }

    this.tokenId = assetID;

    return assetID;
  }

  /**
   * @description Function used to wait for a tx confirmation
   * https://github.com/algorand/docs/blob/13e4c7e4c20086defff50fe8602b0f1e1d76b06f/examples/assets/v2/javascript/AssetExample.js
   * @param {string} txId The id of the transaction to wait
   */
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

  /**
   * @description Function used to print created asset for account and assetid
   * https://github.com/algorand/docs/blob/13e4c7e4c20086defff50fe8602b0f1e1d76b06f/examples/assets/v2/javascript/AssetExample.js
   * @param {string} account The account
   * @param {string} assetid The id of the asset
   */
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

  /**
   * @description Function used to print asset holding for account and assetid
   * https://github.com/algorand/docs/blob/13e4c7e4c20086defff50fe8602b0f1e1d76b06f/examples/assets/v2/javascript/AssetExample.js
   * @static
   * @param {string} account The account
   * @param {string} assetid The id of the asset
   */
  async printAssetHolding(account, assetid) {
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
