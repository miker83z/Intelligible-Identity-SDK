/* eslint-disable no-undef */
const assert = require('assert').strict;
const { IntelligibleIdentity } = require('intelligible-identity');
const { IntelligibleCertificate } = require('./..');

//Web3 Setup info////////////////////////
const web3Provider = 'http://127.0.0.1:8545';
const networkId = '5777';
//////////////////////////////////////

//Certificate info//////////////////////
const didIssuer = `DID:NFT:oadnaoisndoiansoi`;
const hrefIssuer = `/ank/eu/doc/2020-03-10/${didIssuer}/eng@.akn`;
const todayDate = new Date().toISOString().slice(0, 10);
const certificateInformation = {
  certificateDate: todayDate,
  didReceiver: `DID:NFT:oadnaoisndoiansoi`,
  icertId: `GDPRcomplianceX`,
  FRBRWork: {},
  FRBRExpression: {},
  FRBRManifestation: {},
  additionalBody: {},
};
const certificateReferences = {
  icert: {
    entity: `${certificateInformation.didReceiver}:${certificateInformation.icertId}`,
    href: `/ank/eu/doc/${certificateInformation.certificateDate}/${certificateInformation.didReceiver}:${certificateInformation.icertId}/eng@.akn`,
  },
  icertVCDoc: {
    entity: 'IPFS:Qm3n6aosdosidno',
    href: `/ank/eu/doc/${certificateInformation.certificateDate}/IPFS:Qm3n6aosdosidno/eng@.akn`,
  },
  icertReceiver: {
    entity: `${certificateInformation.didReceiver}`,
    href: `/ank/eu/doc/${certificateInformation.certificateDate}/${certificateInformation.didReceiver}/eng@.akn`,
  },
  icertIssuer: {
    entity: `${didIssuer}`,
    href: `${hrefIssuer}`,
  },
  gdpr: {
    entity: 'EU 2016/679',
    href: `/ank/eu/doc/2016-05-04/2016_6791/IPFS:Qm6n5ayhgfsidns/eng@.akn`,
  },
  icertIssuerSoftware: {
    type: 'TLCObject',
    entity: 'IntelligibleCertificate@1.0.1',
    href: `/ank/eu/doc/${certificateInformation.certificateDate}/IPFS:Qm9n6ayhgfsidns/eng@.akn`,
  },
  nftSmartContract: {
    type: 'TLCObject',
    entity: 'IntelligibleCertificate.sol',
    href: `/ank/eu/doc/${certificateInformation.certificateDate}/IPFS:Qm2nayhgf7sidns/eng@.akn`,
  },
};
//////////////////////////////////////

//Identity1 info//////////////////////
const information1 = {
  //identityType: 'person',
  identityDate: todayDate,
  //identityExpression: `DID@${todayDate}`,
  did: didIssuer,
  FRBRWork: {},
  FRBRExpression: {},
  FRBRManifestation: {},
  additionalBody: {},
};
const identityReferences1 = {
  iid: {
    entity: `${information1.did}`,
    href: hrefIssuer,
  },
  iidDIDDoc: {
    entity: 'IPFS:Qm3n7aosdosidno',
    href: `/ank/eu/doc/${information1.identityDate}/IPFS:Qm3n7aosdosidno/eng@.akn`,
  },
  iidIssuer: {
    entity: `${information1.did}`,
    href: hrefIssuer,
  },
  eidas: {
    entity: 'EU COM/2021/281 final',
    href: `/ank/eu/doc/2021-03-06/2021_281/IPFS:Qm6n7ayhgfsidns/eng@.akn`,
  },
  iidIssuerSoftware: {
    type: 'TLCObject',
    entity: 'IntelligibleIdentity@1.0.1',
    href: `/ank/eu/doc/${information1.identityDate}/IPFS:Qm4n6ayhgfsidns/eng@.akn`,
  },
  nftSmartContract: {
    type: 'TLCObject',
    entity: 'IntelligibleIdentity.sol',
    href: `/ank/eu/doc/${information1.identityDate}/IPFS:Qm2nayhgf4sidns/eng@.akn`,
  },
};
//////////////////////////////////////

//Identity2 info//////////////////////
const information2 = {
  //identityType: 'person',
  identityDate: todayDate,
  //identityExpression: `DID@${todayDate}`,
  did: `DID:NFT:oadnaoilndgiansoi`,
  FRBRWork: {},
  FRBRExpression: {},
  FRBRManifestation: {},
  additionalBody: {},
};
const identityReferences2 = {
  iid: {
    entity: `${information2.did}`,
    href: `/ank/eu/doc/${information2.identityDate}/${information2.did}/eng@.akn`,
  },
  iidDIDDoc: {
    entity: 'IPFS:Qm3n7aosdosidno',
    href: `/ank/eu/doc/${information2.identityDate}/IPFS:Qm3n7aosdosidno/eng@.akn`,
  },
  iidIssuer: {
    entity: `${information2.did}`,
    href: `/ank/eu/doc/${information2.identityDate}/${information2.did}/eng@.akn`,
  },
  eidas: {
    entity: 'EU COM/2021/281 final',
    href: `/ank/eu/doc/2021-03-06/2021_281/IPFS:Qm6n7ayhgfsidns/eng@.akn`,
  },
  iidIssuerSoftware: {
    type: 'TLCObject',
    entity: 'IntelligibleIdentity@1.0.1',
    href: `/ank/eu/doc/${information2.identityDate}/IPFS:Qm4n6ayhgfsidns/eng@.akn`,
  },
  nftSmartContract: {
    type: 'TLCObject',
    entity: 'IntelligibleIdentity.sol',
    href: `/ank/eu/doc/${information2.identityDate}/IPFS:Qm2nayhgf4sidns/eng@.akn`,
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
    '#icertIssuer',
    certificateReferences.icertIssuer.entity,
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
    '#icertReceiver',
    certificateReferences.icertReceiver.entity,
    Date.now(),
    receiverSignature
  );

  await verifySignature(
    c.meta.finalize(),
    issuerR.meta.finalize(),
    issuerR.web3.address, //TODO get from DIDDoc
    receiver.meta.finalize(),
    receiver.web3.address
  );
};

const verifySignature = async (
  certMeta,
  issuerMeta,
  issuerWeb3Address,
  receiverMeta,
  receiverWeb3Address
) => {
  const c = new IntelligibleCertificate();
  c.fromStringMeta(certMeta);
  const signedPayload = c.meta.finalizeNoConclusions();

  const issuer = new IntelligibleIdentity();
  issuer.fromStringMeta(issuerMeta, web3Provider, issuerWeb3Address);
  const issuerSignature = c.meta.findValueByEId(
    'signature_icertIssuer_digitalSignature'
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
  receiver.fromStringMeta(receiverMeta, web3Provider, receiverWeb3Address);
  const receiverSignature = c.meta.findValueByEId(
    'signature_icertReceiver_digitalSignature'
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
