/* eslint-disable no-undef */
const assert = require('assert').strict;
const { IntelligibleIdentity } = require('intelligible-identity');
const { IntelligibleCertificate } = require('./..');

//Web3 Setup info////////////////////////
const web3Provider = 'http://127.0.0.1:8545';
const networkId = '5777';
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
    '@href': '/meta/eu/doc/intelligibleIdentity/organization/CompanyX/',
    '@showAs': 'Issuer',
  },
  certIssuerRole: {
    type: 'TLCRole',
    name: 'Issuer',
    '@eId': '#certIssuerRole',
    '@href': '/meta/ontology/roles/intelligibleCertificate/issuer',
    '@showAs': 'IssuerRole',
  },
  certIssuerRepresentative: {
    type: 'TLCPerson',
    name: 'PersonX',
    '@eId': '#certIssuerRepresentative',
    '@href': '/meta/eu/doc/intelligibleIdentity/person/PersonX/',
    '@showAs': 'Author',
  },
  certIssuerRepresentativeRole: {
    type: 'TLCRole',
    name: 'IssuerRepresentative',
    '@eId': '#certIssuerRepresentativeRole',
    '@href':
      '/meta/ontology/roles/intelligibleCertificate/issuerRepresentative',
    '@showAs': 'IssuerRepresentativeRole',
  },
  certIssuerSoftware: {
    type: 'TLCObject',
    name: 'IntelligibleSuite@0.1.0',
    '@eId': '#certIssuerSoftware',
    '@href': '/meta/eu/doc/object/software/IntelligibleSuite/ver@0.1.0.meta',
    '@showAs': 'IssuerSoftware',
  },
  certReceiver: {
    type: 'TLCPerson',
    name: 'PersonY',
    '@eId': '#certReceiver',
    '@href': '/meta/eu/doc/intelligibleIdentity/person/PersonY/',
    '@showAs': 'Receiver',
  },
  certReceiverRole: {
    type: 'TLCRole',
    name: 'Receiver',
    '@eId': '#certReceiverRole',
    '@href': '/meta/ontology/roles/intelligibleCertificate/receiver',
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
    '@href': '/meta/eu/doc/intelligibleIdentity/person/PersonX/',
    '@showAs': 'Issuer',
  },
  idIssuerRole: {
    type: 'TLCRole',
    name: 'Issuer',
    '@eId': '#idIssuerRole',
    '@href': '/meta/ontology/roles/intelligibleIdentity/issuer',
    '@showAs': 'IssuerRole',
  },
  idIssuerRepresentative: {
    type: 'TLCPerson',
    name: 'PersonX',
    '@eId': '#idIssuerRepresentative',
    '@href': '/meta/eu/doc/intelligibleIdentity/person/PersonX/',
    '@showAs': 'Author',
  },
  idIssuerRepresentativeRole: {
    type: 'TLCRole',
    name: 'IssuerRepresentative',
    '@eId': '#idIssuerRepresentativeRole',
    '@href': '/meta/ontology/roles/intelligibleIdentity/issuerRepresentative',
    '@showAs': 'IssuerRepresentativeRole',
  },
  idIssuerSoftware: {
    type: 'TLCObject',
    name: 'IntelligibleSuite@0.1.0',
    '@eId': '#idIssuerSoftware',
    '@href': '/meta/eu/doc/object/software/IntelligibleSuite/ver@0.1.0.meta',
    '@showAs': 'IssuerSoftware',
  },
  idReceiver: {
    type: 'TLCPerson',
    name: 'PersonX',
    '@eId': '#idReceiver',
    '@href': '/meta/eu/doc/intelligibleIdentity/person/PersonX/',
    '@showAs': 'Receiver',
  },
  idReceiverRole: {
    type: 'TLCRole',
    name: 'Receiver',
    '@eId': '#idReceiverRole',
    '@href': '/meta/ontology/roles/intelligibleIdentity/receiver',
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
    '@href': '/meta/eu/doc/intelligibleIdentity/person/PersonY/',
    '@showAs': 'Issuer',
  },
  idIssuerRole: {
    type: 'TLCRole',
    name: 'Issuer',
    '@eId': '#issuerRole',
    '@href': '/meta/ontology/roles/intelligibleIdentity/issuer',
    '@showAs': 'IssuerRole',
  },
  idIssuerRepresentative: {
    type: 'TLCPerson',
    name: 'PersonY',
    '@eId': '#idIssuerRepresentative',
    '@href': '/meta/eu/doc/intelligibleIdentity/person/PersonY/',
    '@showAs': 'Author',
  },
  idIssuerRepresentativeRole: {
    type: 'TLCRole',
    name: 'IssuerRepresentative',
    '@eId': '#issuerRepresentativeRole',
    '@href': '/meta/ontology/roles/intelligibleIdentity/issuerRepresentative',
    '@showAs': 'IssuerRepresentativeRole',
  },
  idIssuerSoftware: {
    type: 'TLCObject',
    name: 'IntelligibleSuite@0.1.0',
    '@eId': '#issuerSoftware',
    '@href': '/meta/eu/doc/object/software/IntelligibleSuite/ver@0.1.0.meta',
    '@showAs': 'IssuerSoftware',
  },
  idReceiver: {
    type: 'TLCPerson',
    name: 'PersonY',
    '@eId': '#idReceiver',
    '@href': '/meta/eu/doc/intelligibleIdentity/person/PersonY/',
    '@showAs': 'Receiver',
  },
  idReceiverRole: {
    type: 'TLCRole',
    name: 'Receiver',
    '@eId': '#receiverRole',
    '@href': '/meta/ontology/roles/intelligibleIdentity/receiver',
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
  a.newIdentityMeta(false);
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
  c.newCertificateMeta();

  const issuerSignature = await issuerR.web3.signData(
    c.meta.finalizeNoConclusions(),
    false
  );
  c.meta.addSignature(
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
    c.meta.finalizeNoConclusions(),
    false
  );
  c.meta.addSignature(
    certificateReferences.certReceiver['@eId'],
    certificateReferences.certReceiver.name,
    certificateReferences.certReceiverRole['@eId'],
    certificateReferences.certReceiverRole.name,
    certificateReferences.certReceiver['@href'], //TODO
    receiver.web3.mainAddress,
    Date.now(),
    receiverSignature
  );

  await verifySignature(
    c.meta.finalize(),
    issuerR.meta.finalize(),
    receiver.meta.finalize()
  );
};

const verifySignature = async (certMeta, issuerMeta, receiverMeta) => {
  const c = new IntelligibleCertificate();
  c.fromStringMeta(certMeta);
  const signedPayload = c.meta.finalizeNoConclusions();

  const issuer = new IntelligibleIdentity();
  issuer.fromStringMeta(issuerMeta, web3Provider);
  const issuerSignature = c.meta.findValueByEId(
    `conclusion_signature_${certificateReferences.certIssuerRepresentative[
      '@eId'
    ].slice(1)}_signature`
  );
  assert.equal(
    await issuer.web3.verifySignedData(
      signedPayload,
      issuerSignature.node.textContent,
      false
    ),
    true
  );

  const receiver = new IntelligibleIdentity();
  receiver.fromStringMeta(receiverMeta, web3Provider);
  const receiverSignature = c.meta.findValueByEId(
    `conclusion_signature_${certificateReferences.certReceiver['@eId'].slice(
      1
    )}_signature`
  );
  assert.equal(
    await receiver.web3.verifySignedData(
      signedPayload,
      receiverSignature.node.textContent,
      false
    ),
    true
  );

  console.log('Signatures verified!');
};

//simpleNoAlgo();
//onlyAlgo();
simpleNewCertificate();
