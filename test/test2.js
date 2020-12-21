const IntelligibleIdentity = require('../src/main');
const fs = require('fs');

const baseServer = 'https://testnet-algorand.api.purestake.io/idx2';
const port = '';
const apiToken = {
  'X-API-Key': fs.readFileSync('test/.secret').toString(),
};

const personalInformation = {
  name: 'Mario',
  email: 'mario@wii.jp',
};

const main = async () => {
  const intelligibleOneAlgo = new IntelligibleIdentity.algo.AlgoWrapper(
    baseServer,
    port,
    apiToken
  );
  const address = intelligibleOneAlgo.newAddress();
  console.log(address);
};

main();
