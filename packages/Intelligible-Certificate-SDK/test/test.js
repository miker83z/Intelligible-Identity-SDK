/* eslint-disable no-undef */
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

const networkId = '5777';
//////////////////////////////////////

const newCertificate = () => {
  const todayDate = new Date().toISOString().slice(0, 10);
  const certificateInformation = {
    certificateType: 'GDPRCompliance',
    certifiedEntityType: 'software',
    certificateDate: todayDate,
    certificateExpression: `en@${todayDate}`,
    FRBRWork: {},
    FRBRExpression: {},
    FRBRManifestation: {},
    additionalBody: {},
  };
  const certificateReferences = {
    certIssuer: {
      type: 'TLCOrganization',
      name: 'CompanyX',
      '@eId': '#certIssuer',
      '@href': '/akn/eu/doc/intelligibleIdentity/organization/CompanyX/',
      '@showAs': 'Issuer',
    },
    certIssuerRepresentative: {
      type: 'TLCPerson',
      name: 'PersonX',
      '@eId': '#certIssuerRepresentative',
      '@href': '/akn/eu/doc/intelligibleIdentity/person/PersonX/',
      '@showAs': 'Author',
    },
    certIssuerSoftware: {
      type: 'TLCObject',
      name: 'IntelligibleSuite@0.1.0',
      '@eId': '#issuerSoftware',
      '@href': '/akn/eu/doc/object/software/IntelligibleSuite/ver@0.1.0.akn',
      '@showAs': 'IssuerSoftware',
    },
    certReceiver: {
      type: 'TLCPerson',
      name: 'PersonY',
      '@eId': '#certReceiver',
      '@href': '/akn/eu/doc/intelligibleIdentity/person/PersonY/',
      '@showAs': 'Receiver',
    },
    certEntity: {
      type: 'TLCObject',
      name: 'softwareX',
      documentHashDigest: 'bO8GOuyG8g76FI7f65DtfYHG67a7fe67',
      '@eId': '#certEntity',
      '@href': '/some/uri/softwareX',
      '@showAs': 'CertifiedEntity',
    },
  };

  const c = new ice.IntelligibleCertificate();
  c.setCertificateInformation(certificateInformation, certificateReferences);
  c.newCertificateAKN();
  console.log(c.akn.finalize());
};

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

  const todayDate = new Date().toISOString().slice(0, 10);
  const certificateInformation = {
    certificateType: 'GDPRCompliance',
    certifiedEntityType: 'software',
    certificateDate: todayDate,
    certificateExpression: `en@${todayDate}`,
    FRBRWork: {},
    FRBRExpression: {},
    FRBRManifestation: {},
    additionalBody: {},
  };
  const certificateReferences = {
    certIssuer: {
      type: 'TLCOrganization',
      name: 'CompanyX',
      '@eId': 'certIssuer',
      '@href': '/akn/eu/doc/intelligibleIdentity/organization/CompanyX/',
      '@showAs': 'Issuer',
    },
    certIssuerRepresentative: {
      type: 'TLCPerson',
      name: 'PersonX',
      '@eId': 'certIssuerRepresentative',
      '@href': '/akn/eu/doc/intelligibleIdentity/person/PersonX/',
      '@showAs': 'Author',
    },
    certIssuerSoftware: {
      type: 'TLCObject',
      name: 'IntelligibleSuite@0.1.0',
      '@eId': 'issuerSoftware',
      '@href': '/akn/eu/doc/object/software/IntelligibleSuite/ver@0.1.0.akn',
      '@showAs': 'IssuerSoftware',
    },
    certReceiver: {
      type: 'TLCPerson',
      name: 'PersonY',
      '@eId': 'certReceiver',
      '@href': '/akn/eu/doc/intelligibleIdentity/person/PersonY/',
      '@showAs': 'Receiver',
    },
    certEntity: {
      type: 'TLCObject',
      name: 'softwareX',
      documentHashDigest: 'bO8GOuyG8g76FI7f65DtfYHG67a7fe67',
      '@eId': 'certEntity',
      '@href': '/some/uri/softwareX',
      '@showAs': 'CertifiedEntity',
    },
  };

  const c = new ice.IntelligibleCertificate();
  await c.prepareNewCertificateWeb3(
    web3Provider,
    0,
    intelligibleCertArtifact,
    networkId,
    o.web3.address
  );
  c.setCertificateInformation(certificateInformation, certificateReferences);
  c.newCertificateAKN();
  const pSignatture = await p.web3.signData(
    c.akn.finalizeNoConclusions(),
    false
  );
  c.akn.addSignature(pSignatture, 'providerSignature');
  await c.finalizeNewCertificateWeb3('certificateHash');

  // receiver signature
  const oSignatture = await o.web3.signData(
    c.akn.finalizeNoConclusions(),
    false
  );
  c.akn.addSignature(oSignatture, 'ownerSignature');

  await verifySignature(c.akn.finalize(), p.akn.finalize(), o.akn.finalize());
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

//simpleNoAlgo();
//onlyAlgo();
newCertificate();
