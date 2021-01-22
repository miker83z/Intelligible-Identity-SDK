const { AlgoWrapper } = require('@intelligiblesuite/wrappers');

class IdentityAlgo extends AlgoWrapper {
  async newIdentityToken(data, identityAddress, identityAknURI) {
    if (this.algodClient === 'undefined' && this.mainAddress === 'undefined')
      return;

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

    let note = undefined; // arbitrary data
    // Asset creation specific parameters
    let addr = this.mainAddress.addr;
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
    let assetURL = identityAknURI.slice(0, 32); //'http://someurl'; // = identityAknURI; //TODO max 32 chars
    // Optional hash commitment of some sort relating to the asset. 32 character length.
    let assetMetadataHash = '16efaa3924a6fd9d3a4824799a4ac65d'; // TODO asset hash

    // The following parameters are the only ones
    // that can be changed, and they have to be changed
    // by the current manager
    // Specified address can change reserve, freeze, clawback, and manager
    let manager = identityAddress;
    // Specified address is considered the asset reserve
    // (it has no special privileges, this is only informational)
    let reserve = identityAddress;
    // Specified address can freeze or unfreeze user asset holdings
    let freeze = identityAddress;
    // Specified address can revoke user asset holdings and send
    // them to other addresses
    let clawback = identityAddress;

    // signing and sending "txn" allows "addr" to create an asset
    let txn = this.algosdk.makeAssetCreateTxnWithSuggestedParams(
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

    let rawSignedTxn = txn.signTxn(this.mainAddress.sk);
    let tx = await this.algodClient.sendRawTransaction(rawSignedTxn).do();
    // wait for transaction to be confirmed
    await this.waitForConfirmation(tx.txId);

    let assetID = null;
    // Get the new asset's information from the creator account
    let ptx = await this.algodClient
      .pendingTransactionInformation(tx.txId)
      .do();
    assetID = ptx['asset-index'];

    if (this.debug) {
      console.log('Transaction : ' + tx.txId);

      await this.printCreatedAsset(this.mainAddress.addr, assetID);
      //await this.printAssetHolding(this.algodClient, this.mainAddress.addr, assetID);
    }

    this.address = identityAddress;
    this.tokenId = assetID;

    return assetID;
  }

  newAddress() {
    const account = this.algosdk.generateAccount();
    const mnemonic = this.algosdk.secretKeyToMnemonic(account.sk);
    return {
      addr: account.addr,
      sk: account.sk,
      mnemonic,
    };
  }
}

module.exports = { IdentityAlgo };
