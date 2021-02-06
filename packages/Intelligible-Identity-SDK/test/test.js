const fs = require('fs');
const Web3 = require('web3');

const iid = require(__dirname + '/..');

// Setup info////////////////////////
const web3Provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545');
const intelligibleIdArtifact = JSON.parse(
  fs.readFileSync(__dirname + '/IntelligibleIdentity.json')
);
const secrets = fs
  .readFileSync(__dirname + '/.secret')
  .toString()
  .split('\n');

const baseServer = 'https://testnet-algorand.api.purestake.io/ps2';
const port = '';
const apiToken = {
  'X-API-Key': secrets[0],
};
const mnemonic = secrets[1];

const personalInformation = {
  name: 'Mario',
  email: 'mario@wii.jp',
};
const networkId = '5777';
//////////////////////////////////////

// Test starts
const simpleNoWeb3NoAlgo = async () => {
  const a = new iid.IntelligibleIdentity();
  await a.newIdentityStandard(personalInformation, false);
};

const simpleNoAlgo = async () => {
  const a = new iid.IntelligibleIdentity();
  await a.newIdentityStandard(personalInformation, false, {
    web3Provider,
    mainAddress: 0,
    intelligibleIdArtifact,
    networkId,
  });
};

const simple = async () => {
  const a = new iid.IntelligibleIdentity();
  const mainAddress = iid.IdentityAlgo.fromMnemonic(mnemonic);
  await a.newIdentityStandard(
    personalInformation,
    false,
    {
      web3Provider,
      mainAddress: 0,
      intelligibleIdArtifact,
      networkId,
    },
    {
      baseServer,
      port,
      apiToken,
      mainAddress,
      addressAlgo: 'undefined',
    }
  );
  console.log(a.akn.finalize());
};

const fromAddress = async () => {
  const a = new iid.IntelligibleIdentity();
  await a.newIdentityStandard(personalInformation, false, {
    web3Provider,
    mainAddress: 0,
    intelligibleIdArtifact,
    networkId,
  });

  const b = new iid.IntelligibleIdentity();
  await b.fromWeb3Address(
    web3Provider,
    0,
    a.web3.address,
    intelligibleIdArtifact,
    networkId
  );
  b.fromStringAKN(a.akn.finalize());
};

simpleNoWeb3NoAlgo();
simpleNoAlgo();
simple();

fromAddress();
