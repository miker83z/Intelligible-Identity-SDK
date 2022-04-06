const { IntelligibleIdentity } = require('./..');

// Setup info////////////////////////
const web3Provider = 'http://127.0.0.1:8545';
const networkId = '5777';
//////////////////////////////////////

//Identity info//////////////////////
const todayDate = new Date().toISOString().slice(0, 10);
const information = {
  //identityType: 'person',
  identityDate: todayDate,
  //identityExpression: `DID@${todayDate}`,
  did: `DID:NFT:oadnaoisndoiansoi`,
  FRBRWork: {},
  FRBRExpression: {},
  FRBRManifestation: {},
  additionalBody: {},
};
const identityReferences = {
  iid: {
    entity: `${information.did}`,
    href: `/ank/eu/doc/${information.identityDate}/${information.did}/eng@.akn`,
  },
  iidDIDDoc: {
    entity: 'IPFS:Qm3n7aosdosidno',
    href: `/ank/eu/doc/${information.identityDate}/IPFS:Qm3n7aosdosidno/eng@.akn`,
  },
  iidIssuer: {
    entity: `${information.did}`,
    href: `/ank/eu/doc/${information.identityDate}/${information.did}/eng@.akn`,
  },
  eidas: {
    entity: 'EU COM/2021/281 final',
    href: `/ank/eu/doc/2021-03-06/2021_281/IPFS:Qm6n7ayhgfsidns/eng@.akn`,
  },
  iidIssuerSoftware: {
    type: 'TLCObject',
    entity: 'IntelligibleIdentity@1.0.1',
    href: `/ank/eu/doc/${information.identityDate}/IPFS:Qm4n6ayhgfsidns/eng@.akn`,
  },
  nftSmartContract: {
    type: 'TLCObject',
    entity: 'IntelligibleIdentity.sol',
    href: `/ank/eu/doc/${information.identityDate}/IPFS:Qm2nayhgf4sidns/eng@.akn`,
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
