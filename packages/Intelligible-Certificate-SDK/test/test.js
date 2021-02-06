const fs = require('fs');
const assert = require('assert').strict;
const Web3 = require('web3');
const {
  ecrecover,
  hashPersonalMessage,
  fromRpcSig,
  Address,
} = require('ethereumjs-util');

const ice = require(__dirname + '/..');
const iid = require('@intelligiblesuite/identity');

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
const mnemonic = secrets[1];

const certificateInformation = {
  name: 'measurementsX',
  uri: '/akn/eu/openData/dataset/measurements/measurementsX.akn',
  documentDigest: 'bO8GOuyG8g76FI7f65DtfYHG67a7fe67',
};
const networkId = '5777';
//////////////////////////////////////

// Test starts
const simpleNoAlgo = async () => {
  const p = new iid.IntelligibleIdentity();
  await p.newIdentityStandard({ name: 'Provider', email: 'pr@na.chi' }, false, {
    web3Provider,
    mainAddress: 0,
    intelligibleIdArtifact,
    networkId,
  });
  const o = new iid.IntelligibleIdentity();
  await o.newIdentityStandard({ name: 'Owner', email: 'owner@e.corp' }, false, {
    web3Provider,
    mainAddress: 0,
    intelligibleIdArtifact,
    networkId,
  });

  const c = new ice.IntelligibleCertificate();
  await c.newCertificateStandard(certificateInformation, {
    web3Provider,
    mainAddress: 0,
    addressWeb3: o.web3.address,
    intelligibleCertArtifact,
    networkId,
  });

  //sign
  const pSignatture = await p.web3.signData(
    c.akn.finalizeNoConclusions(),
    false
  );
  const oSignatture = await o.web3.signData(
    c.akn.finalizeNoConclusions(),
    false
  );
  c.akn.addSignature(pSignatture, 'providerSignature');
  c.akn.addSignature(oSignatture, 'ownerSignature');

  await verifySignature(c.akn.finalize(), p.akn.finalize(), o.akn.finalize());
};

const onlyAlgo = async () => {
  const o = new iid.IntelligibleIdentity();
  await o.newIdentityStandard({ name: 'Owner', email: 'owner@e.corp' }, false, {
    web3Provider,
    mainAddress: 0,
    intelligibleIdArtifact,
    networkId,
  });

  const c = new ice.IntelligibleCertificate();
  const mainAddress = iid.IdentityAlgo.fromMnemonic(mnemonic);
  await c.newCertificateStandard(certificateInformation, undefined, {
    baseServer,
    port,
    apiToken,
    mainAddress,
    addressAlgo: 'undefined',
  });
};

const verifySignature = async (
  aknCertificateDocumentString,
  aknProviderIdentityDocumentString,
  aknOwnerIdentityDocumentString
) => {
  const c = new ice.IntelligibleCertificate();
  c.fromStringAKN(aknCertificateDocumentString);
  const signedPayload = c.akn.finalizeNoConclusions();

  const p = new iid.IntelligibleIdentity();
  p.fromStringAKN(aknProviderIdentityDocumentString);
  const providerSignature = c.akn.conclusions.signatures.providerSignature['#'];
  const providerAddress = p.akn.metaAndMain.akomaNtoso.doc.mainBody.tblock.find(
    (t) => t['@eId'] == 'tblock_2'
  ).p.addressWeb3;

  const o = new iid.IntelligibleIdentity();
  o.fromStringAKN(aknOwnerIdentityDocumentString);
  const ownerSignature = c.akn.conclusions.signatures.ownerSignature['#'];
  const ownerAddress = o.akn.metaAndMain.akomaNtoso.doc.mainBody.tblock.find(
    (t) => t['@eId'] == 'tblock_2'
  ).p.addressWeb3;

  /*
  const identityWeb3 = new iid.IdentityWeb3(web3Provider);
  const extractedPublicKey = await identityWeb3.verifySignedData(
    signedPayload,
    providerSignature
  );
  */

  /*
  const digest = keccakFromString(
    '\x19Ethereum Signed Message:\n' + signedPayload.length + signedPayload);
  */
  const digest = hashPersonalMessage(Buffer.from(signedPayload, 'utf-8'));
  const parsedProvSig = fromRpcSig(providerSignature);
  const extractedProvPublicKey = ecrecover(
    digest,
    parsedProvSig.v,
    parsedProvSig.r,
    parsedProvSig.s
  );
  assert.deepEqual(
    Address.fromPublicKey(extractedProvPublicKey),
    Address.fromString(providerAddress)
  );

  const parsedOwnSig = fromRpcSig(ownerSignature);
  const extractedOwnPublicKey = ecrecover(
    digest,
    parsedOwnSig.v,
    parsedOwnSig.r,
    parsedOwnSig.s
  );
  assert.deepEqual(
    Address.fromPublicKey(extractedOwnPublicKey),
    Address.fromString(ownerAddress)
  );

  console.log('Signatures verified!');
};

simpleNoAlgo();
//onlyAlgo();
