const Web3 = require('web3');
const fs = require('fs');
const IntelligibleIdentity = require('../src/main');

const web3Provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545');
const intelligibleIdArtifact = JSON.parse(
  fs.readFileSync(
    'contract_development/build/contracts/IntelligibleIdentity.json'
  )
);
const personalInformation = {
  name: 'Mario',
  email: 'mario@wii.jp',
};
const networkId = '5777';

const main = async () => {
  const intelligibleOneWeb3 = new IntelligibleIdentity.web3.Web3Wrapper(
    web3Provider,
    intelligibleIdArtifact,
    networkId
  );
  const res = await intelligibleOneWeb3.newIdentityToken(personalInformation);
  const aknDocumentPartiallySigned = IntelligibleIdentity.akn.newAKNDocument(
    res.identityAknURI,
    personalInformation,
    res.publicKey,
    intelligibleIdArtifact.networks[networkId].address,
    res.tokenId
  );
  const aknDocumentComplete = await intelligibleOneWeb3.signData(
    aknDocumentPartiallySigned
  );
  console.log(aknDocumentComplete);
  //intelligibleOneWeb3.newAddress();
};

main();
