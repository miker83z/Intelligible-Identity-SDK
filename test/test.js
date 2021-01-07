const Web3 = require('web3');
const fs = require('fs');
const IntelligibleIdentity = require('../src/main');

const web3Provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545');
const intelligibleIdArtifact = JSON.parse(
  fs.readFileSync(
    'contract_development/build/contracts/IntelligibleIdentity.json'
  )
);
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
const networkId = '5777';

const main = async () => {
  // Web3
  const intelligibleOneWeb3 = new IntelligibleIdentity.web3.Web3Wrapper(
    web3Provider,
    intelligibleIdArtifact,
    networkId
  );
  const resWeb3 = await intelligibleOneWeb3.newIdentityToken(
    personalInformation
  );

  // Algorand
  const txIssuer = IntelligibleIdentity.algo.fromMnemonic(secrets[1]);
  const intelligibleOneAlgo = new IntelligibleIdentity.algo.AlgoWrapper(
    baseServer,
    port,
    apiToken,
    txIssuer,
    true
  );
  const identityAlgo = intelligibleOneAlgo.newAddress();
  const resAlgo = await intelligibleOneAlgo.newIdentityToken(
    personalInformation,
    identityAlgo
  );

  // AKN document
  const aknDocumentPartiallySigned = IntelligibleIdentity.akn.newAKNDocument(
    resWeb3.identityAknURI,
    personalInformation,
    resWeb3.publicKey,
    intelligibleIdArtifact.networks[networkId].address,
    resWeb3.tokenId,
    identityAlgo.addr,
    resAlgo.assetID
  );
  const aknDocumentComplete = await intelligibleOneWeb3.signDataNoPersonal(
    aknDocumentPartiallySigned
  );
  console.log(aknDocumentComplete);
};

main();
