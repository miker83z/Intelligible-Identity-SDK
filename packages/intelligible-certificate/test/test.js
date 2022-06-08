/* eslint-disable no-undef */
const { IntelligibleCertificate } = require('./..');
const { IntelligibleIdentity } = require('intelligible-identity');
const { IPFSWrapper } = require('intelligible-storage-ipfs');
const fs = require('fs');
const assert = require('assert').strict;

//Web3 Setup info////////////////////////
const web3Provider = 'http://127.0.0.1:8545';
const networkId = '5778';
const ipfsProvider = {
  host: '127.0.0.1',
  port: '5001',
  protocol: 'http',
};
//////////////////////////////////////

//Certificate info//////////////////////
const didIssuer = `DID:NFT:oadnaoisndoiansoi`;
const hrefIssuer = `/akn/eu/doc/2020-03-10/${didIssuer}/eng@.akn`;
const todayDate = new Date().toISOString().slice(0, 10);
const certificateInformation = {
  certificateDate: todayDate,
  didReceiver: `DID:NFT:oadnaoisndoiansoi`,
  icertId: `GDPRcomplianceX`,
  FRBRWork: {},
  FRBRExpression: {},
  FRBRManifestation: {
    componentInfo: {
      componentData: [
        {
          '@eId': 'msoftware',
          '@href': 'IntelligibleCertificate1.0.1.hashdigest.json',
          '@name': 'IntelligibleCertificate1.0.1',
          '@showAs': 'IntelligibleCertificate 1.0.1 Software',
        },
        {
          '@eId': 'msmartcontract',
          '@href': 'IntelligibleCertificate.sol',
          '@name': 'IntelligibleCertificate',
          '@showAs': 'IntelligibleCertificate Smart Contract',
        },
      ],
    },
  },
  additionalBody: {},
};
const path = `/akn/eu/doc/${certificateInformation.certificateDate}/${certificateInformation.didReceiver}:${certificateInformation.icertId}/eng@/`;
const certificateReferences = {
  icert: {
    entity: `${certificateInformation.didReceiver}:${certificateInformation.icertId}`,
    href: `${path.slice(0, -1)}@.akn`,
  },
  icertVCDoc: {
    entity: 'vcdoc.json',
    href: `${path}vcdoc.json`,
  },
  icertReceiver: {
    entity: `${certificateInformation.didReceiver}`,
    href: `/akn/eu/doc/${certificateInformation.certificateDate}/${certificateInformation.didReceiver}/eng@.akn`,
  },
  icertIssuer: {
    entity: `${didIssuer}`,
    href: `${hrefIssuer}`,
  },
  gdpr: {
    entity: 'EU 2016/679',
    href: `/akn/eu/doc/2016-05-04/2016_6791/eng@.akn`,
  },
  icertIssuerSoftware: {
    type: 'TLCObject',
    entity: 'IntelligibleCertificate1.0.1.hashdigest.json',
    href: `${path}IntelligibleCertificate1.0.1.hashdigest.json`,
  },
  nftSmartContract: {
    type: 'TLCObject',
    entity: 'IntelligibleCertificate.sol',
    href: `${path}IntelligibleCertificate.sol`,
  },
};
//////////////////////////////////////

//Identity1 info//////////////////////
const information1 = {
  identityDate: todayDate,
  did: didIssuer,
  FRBRWork: {},
  FRBRExpression: {},
  FRBRManifestation: {
    componentInfo: {
      componentData: [
        {
          '@eId': 'msoftware',
          '@href': 'IntelligibleIdentity1.0.1.hashdigest.json',
          '@name': 'IntelligibleIdentity1.0.1',
          '@showAs': 'IntelligibleIdentity 1.0.1 Software',
        },
        {
          '@eId': 'msmartcontract',
          '@href': 'IntelligibleIdentity.sol',
          '@name': 'IntelligibleIdentity',
          '@showAs': 'IntelligibleIdentity Smart Contract',
        },
      ],
    },
  },
  additionalBody: {},
};
const path1 = `${hrefIssuer.slice(0, -4)}/`;
const identityReferences1 = {
  iid: {
    entity: `${information1.did}`,
    href: hrefIssuer,
  },
  iidDIDDoc: {
    entity: 'diddoc.json',
    href: `${path1}diddoc.json`,
  },
  iidIssuer: {
    entity: `${information1.did}`,
    href: hrefIssuer,
  },
  eidas: {
    entity: 'EU COM/2021/281 final',
    href: `/akn/eu/doc/2021-03-06/2021_281/eng@.akn`,
  },
  iidIssuerSoftware: {
    type: 'TLCObject',
    entity: 'IntelligibleIdentity1.0.1.hashdigest.json',
    href: `${path1}IntelligibleIdentity1.0.1.hashdigest.json`,
  },
  nftSmartContract: {
    type: 'TLCObject',
    entity: 'IntelligibleIdentity.sol',
    href: `${path1}IntelligibleIdentity.sol`,
  },
};
//////////////////////////////////////

//Identity2 info//////////////////////
const information2 = {
  identityDate: todayDate,
  did: `DID:NFT:oadnaoilndgiansoi`,
  FRBRWork: {},
  FRBRExpression: {},
  FRBRManifestation: {
    componentInfo: {
      componentData: [
        {
          '@eId': 'msoftware',
          '@href': 'IntelligibleIdentity1.0.1.hashdigest.json',
          '@name': 'IntelligibleIdentity1.0.1',
          '@showAs': 'IntelligibleIdentity 1.0.1 Software',
        },
        {
          '@eId': 'msmartcontract',
          '@href': 'IntelligibleIdentity.sol',
          '@name': 'IntelligibleIdentity',
          '@showAs': 'IntelligibleIdentity Smart Contract',
        },
      ],
    },
  },
  additionalBody: {},
};
const path2 = `/akn/eu/doc/${information2.identityDate}/${information2.did}/eng@/`;
const identityReferences2 = {
  iid: {
    entity: `${information2.did}`,
    href: `${path2.slice(0, -1)}.akn`,
  },
  iidDIDDoc: {
    entity: 'diddoc.json',
    href: `${path2}diddoc.json`,
  },
  iidIssuer: {
    entity: `${information2.did}`,
    href: `${path2.slice(0, -1)}.akn`,
  },
  eidas: {
    entity: 'EU COM/2021/281 final',
    href: `/akn/eu/doc/2021-03-06/2021_281/eng@.akn`,
  },
  iidIssuerSoftware: {
    type: 'TLCObject',
    entity: 'IntelligibleIdentity1.0.1.hashdigest.json',
    href: `${path2}IntelligibleIdentity1.0.1.hashdigest.json`,
  },
  nftSmartContract: {
    type: 'TLCObject',
    entity: 'IntelligibleIdentity.sol',
    href: `${path2}IntelligibleIdentity.sol`,
  },
};
//////////////////////////////////////

const getFileCID = async (ipfs, directory, fileName) => {
  const file = {
    path: fileName,
    content: fs.readFileSync(`${directory}${fileName}`, {
      encoding: 'utf8',
      flag: 'r',
    }),
  };
  const cidRes = await ipfs.getCIDs(path, [file]);
  const cid = cidRes.slice(-1)[0].cid.toString();
  return { file, cid };
};

const setupFilesForAKN = async (ipfs, directory, identityReferences) => {
  const files = [];
  for (let i = 0; i < Object.keys(identityReferences).length; i++) {
    const key = Object.keys(identityReferences)[i];
    if (
      key === 'iidDIDDoc' ||
      key === 'iidIssuerSoftware' ||
      key === 'nftSmartContract'
    ) {
      const res = await getFileCID(
        ipfs,
        directory,
        identityReferences[key].entity
      );
      identityReferences[
        key
      ].href = `${res.cid}${identityReferences[key].href}`;
      files.push(res.file);
    }
  }
  return files;
};

const setupFilesForAKNCert = async (ipfs, directory, certificateReferences) => {
  const files = [];
  for (let i = 0; i < Object.keys(certificateReferences).length; i++) {
    const key = Object.keys(certificateReferences)[i];
    if (
      key === 'icertVCDoc' ||
      key === 'icertIssuerSoftware' ||
      key === 'nftSmartContract'
    ) {
      const res = await getFileCID(
        ipfs,
        directory,
        certificateReferences[key].entity
      );
      certificateReferences[
        key
      ].href = `${res.cid}${certificateReferences[key].href}`;
      files.push(res.file);
    }
  }
  return files;
};

// Test starts
const simpleNewIdentity = async (
  ipfs,
  information,
  identityReferences,
  mainAddress,
  directory
) => {
  // Setup
  const a = new IntelligibleIdentity();
  // Reserve NFT id
  await a.prepareNewIdentityWeb3(
    web3Provider,
    mainAddress,
    undefined,
    networkId
  );
  // Get CIDs for referenced files
  const files = await setupFilesForAKN(ipfs, directory, identityReferences);
  // Create main.xml and save it
  a.newIdentityMeta(information, identityReferences);
  fs.writeFileSync(directory + 'main.xml', a.meta.finalize());
  const res = await getFileCID(ipfs, directory, 'main.xml');
  files.push(res.file);
  // Sign the .akn package and store the signature
  await a.signIdentity(false, res.cid);
  fs.writeFileSync(directory + 'signature.xml', a.signature.finalize());
  const res2 = await getFileCID(ipfs, directory, 'signature.xml');
  files.push(res2.file);
  // Store the end result in IPFS
  const resFinal = await ipfs.storeIPFSDirectory(path, files);
  // Store the reference in IPFS
  const nftCid = `${resFinal.slice(-1)[0].cid.toString()}${path}main.xml`;
  await a.finalizeNewIdentityWeb3(nftCid);

  return a;
};

const simpleNewCertificate = async () => {
  // Setup
  const ipfs = new IPFSWrapper(ipfsProvider);
  const issuer = await simpleNewIdentity(
    ipfs,
    information1,
    identityReferences1,
    0,
    './data1/'
  );
  const receiver = await simpleNewIdentity(
    ipfs,
    information2,
    identityReferences2,
    1,
    './data2/'
  );
  const c = new IntelligibleCertificate();
  // Reserve NFT id
  await c.prepareNewCertificateWeb3(
    web3Provider,
    0,
    receiver.web3.address,
    networkId
  );
  // Get CIDs for referenced files
  const files = await setupFilesForAKNCert(
    ipfs,
    './data/',
    certificateReferences
  );
  // Save reference to iids
  certificateReferences['icertIssuer'].href = issuer.web3.uri;
  certificateReferences['icertReceiver'].href = receiver.web3.uri;
  // Create main.xml and save it
  c.newCertificateMeta(certificateInformation, certificateReferences);
  fs.writeFileSync('./data/main.xml', c.meta.finalize());
  const res = await getFileCID(ipfs, './data/', 'main.xml');
  files.push(res.file);

  // Sign the .akn package and store the signature
  const issuerSignature = await issuer.web3.signData(res.cid, false);
  c.addSignatureToCertificate(
    'icertIssuer',
    certificateReferences.icertIssuer.entity,
    Date.now(),
    issuerSignature
  );
  fs.writeFileSync(
    `./data/signature-icertIssuer.xml`,
    c.signatures['icertIssuer'].finalize()
  );
  const res1 = await getFileCID(ipfs, './data/', 'signature-icertIssuer.xml');
  files.push(res1.file);
  // receiver signature
  const receiverSignature = await receiver.web3.signData(res1.cid, false);
  c.addSignatureToCertificate(
    'icertReceiver',
    certificateReferences.icertReceiver.entity,
    Date.now(),
    receiverSignature
  );
  fs.writeFileSync(
    `./data/signature-icertReceiver.xml`,
    c.signatures['icertReceiver'].finalize()
  );
  const res2 = await getFileCID(ipfs, './data/', 'signature-icertReceiver.xml');
  files.push(res2.file);
  // Store the end result in IPFS
  const resFinal = await ipfs.storeIPFSDirectory(path, files);
  // Store the reference in IPFS
  const nftCid = `${resFinal.slice(-1)[0].cid.toString()}${path}main.xml`;
  await c.finalizeNewCertificateWeb3(nftCid);

  await verifySignature(
    c.web3.tokenId,
    issuer.web3.address, //TODO get from DIDDoc
    receiver.web3.address //TODO get from DIDDoc
  );
};

const verifySignature = async (
  tokenId,
  issuerWeb3Address,
  receiverWeb3Address
) => {
  const ipfs = new IPFSWrapper(ipfsProvider);
  // Reconstruct Certificate
  const c = new IntelligibleCertificate();
  // Obtain the certificate uri from the token id
  const nftCid = await c.fromWeb3TokenId(web3Provider, 0, tokenId, networkId);
  // Gets the certificate document from IPFS
  const resGet = await ipfs.getIPFSFile(nftCid);
  c.fromStringMeta(resGet);
  // Get the signature documents and save it
  const signIssuerCid =
    nftCid.split('/').slice(0, -1).join('/') + '/signature-icertIssuer.xml';
  const signIssuerGet = await ipfs.getIPFSFile(signIssuerCid);
  c.fromStringSignature('icertIssuer', signIssuerGet);
  const signReceiverCid =
    nftCid.split('/').slice(0, -1).join('/') + '/signature-icertReceiver.xml';
  const signReceiverGet = await ipfs.getIPFSFile(signReceiverCid);
  c.fromStringSignature('icertReceiver', signReceiverGet);
  // Reconstruct Identities
  const issuer = new IntelligibleIdentity();
  const resIssuerGet = await ipfs.getIPFSFile(c.references.icertIssuer.href);
  issuer.fromStringMeta(resIssuerGet, web3Provider, issuerWeb3Address); //TODO get address from DID
  const receiver = new IntelligibleIdentity();
  const resReceiverGet = await ipfs.getIPFSFile(
    c.references.icertReceiver.href
  );
  receiver.fromStringMeta(resReceiverGet, web3Provider, receiverWeb3Address); //TODO get address from DID
  // Verify issuer signature
  const fileX = {
    path: 'main.xml',
    content: c.meta.finalize(),
  };
  const cid1 = await ipfs.getCIDs(path, [fileX]);
  const issuerSignedPayload = cid1.slice(-1)[0].cid.toString();
  const issuerSignature = c.signatures['icertIssuer'].findValueByEId(
    'signature_icertIssuer_digitalSignature'
  );
  assert.equal(
    await issuer.web3.verifySignedData(
      issuerSignedPayload,
      issuerSignature.node.textContent,
      false
    ),
    true
  );
  // Verify receiver signature
  const fileY = {
    path: 'signature-icertIssuer.xml',
    content: c.signatures['icertIssuer'].finalize(),
  };
  const cid2 = await ipfs.getCIDs(path, [fileY]);
  const receiverSignedPayload = cid2.slice(-1)[0].cid.toString();
  const receiverSignature = c.signatures['icertReceiver'].findValueByEId(
    'signature_icertReceiver_digitalSignature'
  );
  assert.equal(
    await receiver.web3.verifySignedData(
      receiverSignedPayload,
      receiverSignature.node.textContent,
      false
    ),
    true
  );
  console.log('Signatures verified!');
};

simpleNewCertificate();
