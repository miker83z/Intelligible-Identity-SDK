const Web3 = require('web3');
const { convert } = require('xmlbuilder2');
const {
  ecrecover,
  keccakFromString,
  hashPersonalMessage,
  fromRpcSig,
  Address,
} = require('ethereumjs-util');
const fs = require('fs');
const assert = require('assert').strict;
const IntelligibleCertificate = require(__dirname + '/..');
const IntelligibleIdentity = require(__dirname +
  '/../../Intelligible-Identity-SDK/');

// Setup info////////////////////////
const web3Provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545');
const intelligibleIdArtifact = JSON.parse(
  fs.readFileSync(__dirname + '/IntelligibleIdentity.json')
);
const intelligibleCertArtifact = JSON.parse(
  fs.readFileSync(__dirname + '/IntelligibleCertificate.json')
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
const certifiableEntity = {
  name: 'measurementsX',
  uri: '/akn/eu/openData/dataset/measurements/measurementsX.akn',
  documentDigest: 'bO8GOuyG8g76FI7f65DtfYHG67a7fe67',
};
const networkId = '5777';
//////////////////////////////////////

// Test starts
const newIdentity = async (personalInformation) => {
  //Web3
  const intelligibleOneWeb3 = new IntelligibleIdentity.web3.Web3Wrapper(
    web3Provider,
    intelligibleIdArtifact,
    networkId
  );
  const resWeb3 = await intelligibleOneWeb3.newIdentityToken(
    personalInformation
  );

  // AKN document
  const aknDocument = IntelligibleIdentity.akn.newAKNDocument(
    resWeb3.identityAknURI,
    personalInformation,
    resWeb3.publicKey,
    intelligibleIdArtifact.networks[networkId].address,
    resWeb3.tokenId,
    'algo',
    'tokenID'
  );
  const signature = await intelligibleOneWeb3.signDataNoPersonal(aknDocument);
  const aknDocumentSW = IntelligibleIdentity.akn.addSignature(
    aknDocument,
    'softwareSignature',
    'softwareSignature'
  ); // Software signature TODO
  const aknDocumentComplete = IntelligibleIdentity.akn.addSignature(
    aknDocumentSW,
    signature,
    'identitySignature'
  );
  return {
    aknUri: resWeb3.identityAknURI,
    aknDocument: aknDocumentComplete,
    publicKey: resWeb3.publicKey,
    identityWeb3Object: intelligibleOneWeb3,
  };
};

const verifySignature = async (
  signedData, //TODO should be extrected from aknCertificate
  aknCertificate,
  aknIdentityProvider,
  aknIdentityOwner
) => {
  const certificate = convert(aknCertificate, { format: 'object' });
  const provider = convert(aknIdentityProvider, { format: 'object' });

  const providerSignature =
    certificate.akomaNtoso.doc.conclusions.signatures.providerSignature['#'];
  const providerPublicKey = provider.akomaNtoso.doc.mainBody.tblock.find(
    (t) => t['@eId'] == 'tblock_2'
  ).p.publicKeyWeb3;

  const identityWeb3 = new IntelligibleIdentity.web3.Web3Wrapper(
    web3Provider,
    intelligibleCertArtifact,
    networkId
  );

  /*
  const extractedPublicKey = await identityWeb3.verifySignedData(
    signedData,
    providerSignature
  );
  */

  /*
  const digest = keccakFromString(
    '\x19Ethereum Signed Message:\n' + signedData.length + signedData);
  */
  const digest = hashPersonalMessage(Buffer.from(signedData, 'utf-8'));
  const parsedSig = fromRpcSig(providerSignature);

  const extractedPublicKey = ecrecover(
    digest,
    parsedSig.v,
    parsedSig.r,
    parsedSig.s
  );

  assert.deepEqual(
    Address.fromPublicKey(extractedPublicKey),
    Address.fromString(providerPublicKey)
  );
};

const main = async () => {
  //Web3
  const certificateWeb3 = new IntelligibleCertificate.web3.Web3Wrapper(
    web3Provider,
    intelligibleCertArtifact,
    networkId
  );
  const certifiableEntityOwner = await newIdentity({
    name: 'Owner',
    email: 'owner@e.corp',
  });
  const certificateProvider = await newIdentity({
    name: 'Provider',
    email: 'provider@na.chi',
  });

  const resWeb3 = await certificateWeb3.newCertificateToken(
    certifiableEntity,
    certifiableEntityOwner.publicKey
  );

  // AKN document
  const aknCertificate = IntelligibleCertificate.akn.newAKNDocument(
    resWeb3.certificateAknURI,
    certifiableEntity,
    intelligibleCertArtifact.networks[networkId].address,
    resWeb3.tokenId,
    'algo',
    'tokenID',
    certifiableEntityOwner.aknUri,
    certificateProvider.aknUri
  );
  const signature = await certificateProvider.identityWeb3Object.signDataNoPersonal(
    aknCertificate
  );
  const aknDocumentSW = IntelligibleCertificate.akn.addSignature(
    aknCertificate,
    'softwareSignature',
    'softwareSignature'
  ); // Software signature TODO
  const aknDocumentComplete = IntelligibleCertificate.akn.addSignature(
    aknDocumentSW,
    signature,
    'providerSignature'
  );
  // Owner signature TODO
  console.log(aknDocumentComplete);

  //verify signature
  verifySignature(
    aknCertificate,
    aknDocumentComplete,
    certificateProvider.aknDocument,
    certifiableEntityOwner.aknDocument
  );
};

main();
