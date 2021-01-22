const fs = require('fs');
const assert = require('assert').strict;
const Web3 = require('web3');
const {
  ecrecover,
  keccakFromString,
  hashPersonalMessage,
  fromRpcSig,
  Address,
} = require('ethereumjs-util');

const ice = require(__dirname + '/..');
const iid = require('@intelligiblesuite/identity');

const testAlgo = false;

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
const addressIdSmartContractWeb3 =
  intelligibleIdArtifact.networks[networkId].address;
const addressCertSmartContractWeb3 =
  intelligibleCertArtifact.networks[networkId].address;
//////////////////////////////////////

// Test starts
const main = async () => {
  const p = new iid.IntelligibleIdentity();
  await p.newPersonIdentityStandard(
    { name: 'Owner', email: 'owner@e.corp' },
    {
      web3Provider,
      txIssuer: 0,
      addressWeb3: 'undefined',
      intelligibleIdArtifact,
      networkId,
    }
  );
  const o = new iid.IntelligibleIdentity();
  await o.newPersonIdentityStandard(
    {
      name: 'Provider',
      email: 'provider@na.chi',
    },
    {
      web3Provider,
      txIssuer: 0,
      addressWeb3: 'undefined',
      intelligibleIdArtifact,
      networkId,
    }
  );

  const c = new ice.IntelligibleCertificate();
  await c.newCertificateStandard(certificateInformation, p, o, {
    web3Provider,
    txIssuer: 0,
    receiverAddress: o.web3.address,
    intelligibleCertArtifact,
    networkId,
  });

  await verifySignature(c.akn.finalize(), p.akn.finalize(), o.akn.finalize());
};

const mainWithAlgo = async () => {
  const p = new iid.IntelligibleIdentity();
  await p.newPersonIdentityStandard(
    { name: 'Owner', email: 'owner@e.corp' },
    {
      web3Provider,
      txIssuer: 0,
      addressWeb3: 'undefined',
      intelligibleIdArtifact,
      networkId,
    },
    {
      baseServer,
      port,
      apiToken,
      txIssuerMnemonic: mnemonic,
      addressAlgo: 'undefined',
    }
  );
  const o = new iid.IntelligibleIdentity();
  await o.newPersonIdentityStandard(
    {
      name: 'Provider',
      email: 'provider@na.chi',
    },
    {
      web3Provider,
      txIssuer: 0,
      addressWeb3: 'undefined',
      intelligibleIdArtifact,
      networkId,
    },
    {
      baseServer,
      port,
      apiToken,
      txIssuerMnemonic: mnemonic,
      addressAlgo: 'undefined',
    }
  );

  const c = new ice.IntelligibleCertificate();
  await c.newCertificateStandard(
    certificateInformation,
    p,
    o,
    {
      web3Provider,
      txIssuer: 0,
      receiverAddress: o.web3.address,
      intelligibleCertArtifact,
      networkId,
    },
    {
      baseServer,
      port,
      apiToken,
      txIssuerMnemonic: mnemonic,
      receiverAddress: o.algo.address,
    }
  );

  await verifySignature(c.akn.finalize(), p.akn.finalize(), o.akn.finalize());
};

const verifySignature = async (
  aknCertificateDocumentString,
  aknProviderIdentityDocumentString,
  aknOwnerIdentityDocumentString
) => {
  const c = ice.CertificateAKN.fromString(aknCertificateDocumentString);
  const signedPayload = c.finalizeNoConclusions();

  const p = iid.IdentityAKN.fromString(aknProviderIdentityDocumentString);
  const providerSignature = c.conclusions.signatures.providerSignature['#'];
  const providerAddress = p.metaAndMain.akomaNtoso.doc.mainBody.tblock.find(
    (t) => t['@eId'] == 'tblock_2'
  ).p.addressWeb3;

  const o = iid.IdentityAKN.fromString(aknOwnerIdentityDocumentString);
  const ownerSignature = c.conclusions.signatures.ownerSignature['#'];
  const ownerAddress = o.metaAndMain.akomaNtoso.doc.mainBody.tblock.find(
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

  const parsedOwnSig = fromRpcSig(providerSignature);
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

main();
