const algosdk = require('algosdk');
const aknBuilder = require('./aknBuilder');

class AlgoWrapper {
  constructor(provider, port, apiToken, txIssuerAccount, debug) {
    this.provider = provider;
    this.port = port;
    this.apiToken = apiToken;
    this.txIssuerAccount = txIssuerAccount;
    this.debug = debug === undefined ? false : debug;

    this.algodClient = new algosdk.Algodv2(apiToken, provider, port);
  }

  async newIdentityToken(data, identityAccount) {
    if (
      this.algodClient === 'undefined' &&
      this.txIssuerAccount === 'undefined'
    )
      return;

    const identityAknURI = aknBuilder.AKNUriString(data.name);

    //createAsset
    if (this.debug) {
      let accountInfo = await this.algodClient
        .accountInformation(this.txIssuerAccount.addr)
        .do();
      console.log('Account balance: %d microAlgos', accountInfo.amount);
    }

    const params = await this.algodClient.getTransactionParams().do();
    //params.fee = 1000;
    //params.flatFee = true;

    let note = undefined; // arbitrary data
    // Asset creation specific parameters
    let addr = this.txIssuerAccount.addr;
    // Whether user accounts will need to be unfrozen before transacting
    let defaultFrozen = true;
    // integer number of decimals for asset unit calculation
    let decimals = 0;
    // total number of this asset available for circulation
    let totalIssuance = 1;
    // Used to display asset units to user
    let unitName = 'IntID';
    // Friendly name of the asset
    let assetName = 'intid';

    // Optional string pointing to a URL relating to the asset
    let assetURL = 'http://someurl'; // = identityAknURI; //TODO max 32 chars
    // Optional hash commitment of some sort relating to the asset. 32 character length.
    let assetMetadataHash = '16efaa3924a6fd9d3a4824799a4ac65d'; // TODO asset hash

    // The following parameters are the only ones
    // that can be changed, and they have to be changed
    // by the current manager
    // Specified address can change reserve, freeze, clawback, and manager
    let manager = identityAccount.addr;
    // Specified address is considered the asset reserve
    // (it has no special privileges, this is only informational)
    let reserve = identityAccount.addr;
    // Specified address can freeze or unfreeze user asset holdings
    let freeze = identityAccount.addr;
    // Specified address can revoke user asset holdings and send
    // them to other addresses
    let clawback = identityAccount.addr;

    // signing and sending "txn" allows "addr" to create an asset
    let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
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

    let rawSignedTxn = txn.signTxn(this.txIssuerAccount.sk);
    let tx = await this.algodClient.sendRawTransaction(rawSignedTxn).do();
    // wait for transaction to be confirmed
    await waitForConfirmation(this.algodClient, tx.txId);

    let assetID = null;
    // Get the new asset's information from the creator account
    let ptx = await this.algodClient
      .pendingTransactionInformation(tx.txId)
      .do();
    assetID = ptx['asset-index'];

    if (this.debug) {
      console.log('Transaction : ' + tx.txId);

      await printCreatedAsset(
        this.algodClient,
        this.txIssuerAccount.addr,
        assetID
      );
      //await printAssetHolding(this.algodClient, this.txIssuerAccount.addr, assetID);
    }

    return { identityAknURI, assetID };
  }

  newAddress() {
    const account = algosdk.generateAccount();
    const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
    return {
      addr: account.addr,
      sk: account.sk,
      mnemonic,
    };
  }
}

// Function used to wait for a tx confirmation
const waitForConfirmation = async (algodclient, txId) => {
  let response = await algodclient.status().do();
  let lastround = response['last-round'];
  while (true) {
    const pendingInfo = await algodclient
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
    await algodclient.statusAfterBlock(lastround).do();
  }
};

// Function used to print created asset for account and assetid
const printCreatedAsset = async (algodclient, account, assetid) => {
  let accountInfo = await algodclient.accountInformation(account).do();
  for (idx = 0; idx < accountInfo['created-assets'].length; idx++) {
    let scrutinizedAsset = accountInfo['created-assets'][idx];
    if (scrutinizedAsset['index'] == assetid) {
      console.log('AssetID = ' + scrutinizedAsset['index']);
      let myparms = JSON.stringify(scrutinizedAsset['params'], undefined, 2);
      console.log('parms = ' + myparms);
      break;
    }
  }
};

// Function used to print asset holding for account and assetid
const printAssetHolding = async (algodclient, account, assetid) => {
  let accountInfo = await algodclient.accountInformation(account).do();
  for (idx = 0; idx < accountInfo['assets'].length; idx++) {
    let scrutinizedAsset = accountInfo['assets'][idx];
    if (scrutinizedAsset['asset-id'] == assetid) {
      let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
      console.log('assetholdinginfo = ' + myassetholding);
      break;
    }
  }
};

const fromMnemonic = (mnemonic) => {
  return algosdk.mnemonicToSecretKey(mnemonic);
};

module.exports = { AlgoWrapper, fromMnemonic };
