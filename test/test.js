const Web3 = require('web3');
const fs = require('fs');
const IntelligibleIdentity = require('../index');
const intelligibleOne = new IntelligibleIdentity();

const web3Provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545');
const intelligibleIdArtifact = fs.readFileSync(
  'contract_development/build/contracts/IntelligibleIdentity.json'
);
const personalInformation = {
  name: 'Mario',
  email: 'mario@wii.jp',
};

const main = async () => {
  intelligibleOne.initWeb3(web3Provider, JSON.parse(intelligibleIdArtifact));
  const res = await intelligibleOne.newIdentityTokenWeb3(personalInformation);
  const aknDocumentPartiallySigned = intelligibleOne.newAKNDocument(
    res.identityAknURI,
    personalInformation,
    res.publicKey,
    res.tokenId
  );
  const aknDocumentComplete = await intelligibleOne.signDataWeb3(
    aknDocumentPartiallySigned
  );
  console.log(aknDocumentComplete);
  //intelligibleOne.newAddress();
};

main();
