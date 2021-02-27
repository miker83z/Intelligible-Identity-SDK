/* eslint-disable no-undef */
const assert = require('assert').strict;
const {
  ecrecover,
  hashPersonalMessage,
  fromRpcSig,
  Address,
} = require('ethereumjs-util');
const { IntelligibleIdentity } = require('@intelligiblesuite/identity');
const { IntelligibleCertificate } = require('./..');

//Web3 Setup info////////////////////////
const web3Provider = 'http://127.0.0.1:8545';
const networkId = '5778';
//////////////////////////////////////

//Certificate info//////////////////////
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
  certIssuerRole: {
    type: 'TLCRole',
    name: 'Issuer',
    '@eId': '#issuerRole',
    '@href': '/akn/ontology/roles/intelligibleCertificate/issuer',
    '@showAs': 'IssuerRole',
  },
  certIssuerRepresentative: {
    type: 'TLCPerson',
    name: 'PersonX',
    '@eId': '#certIssuerRepresentative',
    '@href': '/akn/eu/doc/intelligibleIdentity/person/PersonX/',
    '@showAs': 'Author',
  },
  certIssuerRepresentativeRole: {
    type: 'TLCRole',
    name: 'IssuerRepresentative',
    '@eId': '#issuerRepresentativeRole',
    '@href': '/akn/ontology/roles/intelligibleCertificate/issuerRepresentative',
    '@showAs': 'IssuerRepresentativeRole',
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
  certReceiverRole: {
    type: 'TLCRole',
    name: 'Receiver',
    '@eId': '#receiverRole',
    '@href': '/akn/ontology/roles/intelligibleCertificate/receiver',
    '@showAs': 'ReceiverRole',
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
//////////////////////////////////////

//Identity1 info//////////////////////
const information1 = {
  identityType: 'person',
  identityDate: todayDate,
  identityExpression: `DID@${todayDate}`,
  name: 'Person X',
  email: 'person@x.com',
  FRBRWork: {},
  FRBRExpression: {},
  FRBRManifestation: {},
  additionalBody: {},
};
const identityReferences1 = {
  idIssuer: {
    type: 'TLCPerson',
    name: 'PersonX',
    '@eId': '#idIssuer',
    '@href': '/akn/eu/doc/intelligibleIdentity/person/PersonX/',
    '@showAs': 'Issuer',
  },
  idIssuerRole: {
    type: 'TLCRole',
    name: 'Issuer',
    '@eId': '#issuerRole',
    '@href': '/akn/ontology/roles/intelligibleIdentity/issuer',
    '@showAs': 'IssuerRole',
  },
  idIssuerRepresentative: {
    type: 'TLCPerson',
    name: 'PersonX',
    '@eId': '#idIssuerRepresentative',
    '@href': '/akn/eu/doc/intelligibleIdentity/person/PersonX/',
    '@showAs': 'Author',
  },
  idIssuerRepresentativeRole: {
    type: 'TLCRole',
    name: 'IssuerRepresentative',
    '@eId': '#issuerRepresentativeRole',
    '@href': '/akn/ontology/roles/intelligibleIdentity/issuerRepresentative',
    '@showAs': 'IssuerRepresentativeRole',
  },
  idIssuerSoftware: {
    type: 'TLCObject',
    name: 'IntelligibleSuite@0.1.0',
    '@eId': '#issuerSoftware',
    '@href': '/akn/eu/doc/object/software/IntelligibleSuite/ver@0.1.0.akn',
    '@showAs': 'IssuerSoftware',
  },
  idReceiver: {
    type: 'TLCPerson',
    name: 'PersonX',
    '@eId': '#idReceiver',
    '@href': '/akn/eu/doc/intelligibleIdentity/person/PersonX/',
    '@showAs': 'Receiver',
  },
  idReceiverRole: {
    type: 'TLCRole',
    name: 'Receiver',
    '@eId': '#receiverRole',
    '@href': '/akn/ontology/roles/intelligibleIdentity/receiver',
    '@showAs': 'ReceiverRole',
  },
};
//////////////////////////////////////

//Identity1 info//////////////////////
const information2 = {
  identityType: 'person',
  identityDate: todayDate,
  identityExpression: `DID@${todayDate}`,
  name: 'Person Y',
  email: 'person@y.com',
  FRBRWork: {},
  FRBRExpression: {},
  FRBRManifestation: {},
  additionalBody: {},
};
const identityReferences2 = {
  idIssuer: {
    type: 'TLCPerson',
    name: 'PersonY',
    '@eId': '#idIssuer',
    '@href': '/akn/eu/doc/intelligibleIdentity/person/PersonY/',
    '@showAs': 'Issuer',
  },
  idIssuerRole: {
    type: 'TLCRole',
    name: 'Issuer',
    '@eId': '#issuerRole',
    '@href': '/akn/ontology/roles/intelligibleIdentity/issuer',
    '@showAs': 'IssuerRole',
  },
  idIssuerRepresentative: {
    type: 'TLCPerson',
    name: 'PersonY',
    '@eId': '#idIssuerRepresentative',
    '@href': '/akn/eu/doc/intelligibleIdentity/person/PersonY/',
    '@showAs': 'Author',
  },
  idIssuerRepresentativeRole: {
    type: 'TLCRole',
    name: 'IssuerRepresentative',
    '@eId': '#issuerRepresentativeRole',
    '@href': '/akn/ontology/roles/intelligibleIdentity/issuerRepresentative',
    '@showAs': 'IssuerRepresentativeRole',
  },
  idIssuerSoftware: {
    type: 'TLCObject',
    name: 'IntelligibleSuite@0.1.0',
    '@eId': '#issuerSoftware',
    '@href': '/akn/eu/doc/object/software/IntelligibleSuite/ver@0.1.0.akn',
    '@showAs': 'IssuerSoftware',
  },
  idReceiver: {
    type: 'TLCPerson',
    name: 'PersonY',
    '@eId': '#idReceiver',
    '@href': '/akn/eu/doc/intelligibleIdentity/person/PersonY/',
    '@showAs': 'Receiver',
  },
  idReceiverRole: {
    type: 'TLCRole',
    name: 'Receiver',
    '@eId': '#receiverRole',
    '@href': '/akn/ontology/roles/intelligibleIdentity/receiver',
    '@showAs': 'ReceiverRole',
  },
};
//////////////////////////////////////

// Test starts
const simpleNewIdentity = async (
  information,
  identityReferences,
  mainAddress
) => {
  const a = new IntelligibleIdentity();
  await a.prepareNewIdentityWeb3(
    web3Provider,
    mainAddress,
    undefined,
    networkId
  );
  a.setIdentityInformation(information, identityReferences);
  a.newIdentityAKN(false);
  await a.finalizeNewIdentityWeb3('identityHash');

  return a;
};

const simpleNewCertificate = async () => {
  const issuerR = await simpleNewIdentity(information1, identityReferences1, 0);
  const receiver = await simpleNewIdentity(
    information2,
    identityReferences2,
    1
  );

  const c = new IntelligibleCertificate();
  await c.prepareNewCertificateWeb3(
    web3Provider,
    0,
    receiver.web3.address,
    networkId
  );
  c.setCertificateInformation(certificateInformation, certificateReferences);
  c.newCertificateAKN();

  const issuerSignature = await issuerR.web3.signData(
    c.akn.finalizeNoConclusions(),
    false
  );
  c.akn.addSignature(
    certificateReferences.certIssuerRepresentative['@eId'],
    certificateReferences.certIssuerRepresentative.name,
    certificateReferences.certIssuerRepresentativeRole['@eId'],
    certificateReferences.certIssuerRepresentativeRole.name,
    certificateReferences.certIssuerRepresentative['@href'], //TODO
    issuerR.web3.mainAddress,
    Date.now(),
    issuerSignature
  );
  await c.finalizeNewCertificateWeb3('certificateHash');

  // receiver signature
  const receiverSignature = await receiver.web3.signData(
    c.akn.finalizeNoConclusions(),
    false
  );
  c.akn.addSignature(
    certificateReferences.certReceiver['@eId'],
    certificateReferences.certReceiver.name,
    certificateReferences.certReceiverRole['@eId'],
    certificateReferences.certReceiverRole.name,
    certificateReferences.certReceiver['@href'], //TODO
    receiverSignature
  );

  //await verifySignature(c.akn.finalize(), p.akn.finalize(), o.akn.finalize());
};

const verifySignature = async (
  aknCertificateDocumentString,
  aknProviderIdentityDocumentString,
  aknOwnerIdentityDocumentString
) => {
  const c = new IntelligibleCertificate();
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
simpleNewCertificate();
