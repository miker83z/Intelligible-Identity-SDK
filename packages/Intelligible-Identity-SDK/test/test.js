const { IntelligibleIdentity } = require('./..');

// Setup info////////////////////////
const web3Provider = 'http://127.0.0.1:8545';
const networkId = '5777';
//////////////////////////////////////

//Identity info//////////////////////
const todayDate = new Date().toISOString().slice(0, 10);
const information = {
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
const identityReferences = {
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
    '@eId': '#issuerRole',
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
    name: 'PersonX',
    '@eId': '#idReceiver',
    '@href': '/meta/eu/doc/intelligibleIdentity/person/PersonX/',
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
const simpleNewIdentity = async () => {
  const a = new IntelligibleIdentity();
  await a.prepareNewIdentityWeb3(web3Provider, 0, undefined, networkId);
  a.setIdentityInformation(information, identityReferences);
  a.newIdentityMeta(false);
  await a.finalizeNewIdentityWeb3('identityHash');

  return a;
};

const fromAddress = async () => {
  const a = await simpleNewIdentity();
  const b = new IntelligibleIdentity();
  await b.fromWeb3Address(web3Provider, 0, a.web3.address, networkId);
  b.fromStringMeta(a.meta.finalize());

  console.log(b.meta.finalize());
};

//simpleNewIdentity();
fromAddress();
