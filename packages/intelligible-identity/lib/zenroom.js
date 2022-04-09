const { zencode_exec } = require('zenroom');
const fs = require('fs');
const path = require('path');
const secp256k1 = require('secp256k1');

/**
 * @description Provides the means to create and manage a DID in Ethereum.
 */
class Zenroom {
  /**
   * @description Creates an instance of Zenroom.
   * @param {Object} identityWeb3 The identity web3 object
   */
  constructor(identityWeb3) {
    if (identityWeb3 === undefined)
      throw new Error('wrapper/ethrDid: identityWeb3 not set');
    this.web3 = identityWeb3.web3;
    this.mainAddress = identityWeb3.mainAddress;
  }

  /**
   * @description Create kaypair
   */
  async createKeypair() {
    const newAccount = await this.web3.eth.accounts.create();
    //await this.web3.eth.accounts.wallet.add(newAccount);
    const hex = this.web3.utils.utf8ToHex(newAccount.privateKey.slice(2));

    const zencode = fs.readFileSync(
      path.resolve(__dirname, './templates/zencode/create-keypair.zen'),
      {
        encoding: 'utf8',
        flag: 'r',
      }
    );

    const result = await zencode_exec(zencode, {
      conf: `color=0, debug=0, rngseed=hex:${hex.slice(2)}`,
    });

    const pubKeyString = JSON.parse(result.result).DIDController.keypair
      .public_key;
    const privKeyString = JSON.parse(result.result).DIDController.keypair
      .private_key;

    const publicKey = secp256k1.publicKeyConvert(
      Uint8Array.from(atob(pubKeyString), (c) => c.charCodeAt(0))
    );
    const privateKey = Uint8Array.from(atob(privKeyString), (c) =>
      c.charCodeAt(0)
    );
    return { publicKey, privateKey };
  }
}

module.exports = { Zenroom };
