const fs = require('fs');
const IntelligibleIdentity = require('../src/main');
const secrets = fs.readFileSync('test/.secret').toString().split('\n');

const baseServer = 'https://testnet-algorand.api.purestake.io/ps2';
const port = '';
const apiToken = {
  'X-API-Key': secrets[0],
};

const personalInformation = {
  name: 'Mario',
  email: 'mario@wii.jp',
};
const txIssuer = IntelligibleIdentity.algo.fromMnemonic(secrets[1]);
const intelligibleOneAlgo = new IntelligibleIdentity.algo.AlgoWrapper(
  baseServer,
  port,
  apiToken,
  txIssuer,
  true
);
const identityAccount = intelligibleOneAlgo.newAddress();
intelligibleOneAlgo.newIdentityToken(personalInformation, identityAccount);
