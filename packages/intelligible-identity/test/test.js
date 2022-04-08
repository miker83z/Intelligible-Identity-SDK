const { IntelligibleIdentity } = require('./..');
const { IPFSWrapper } = require('intelligible-storage-ipfs');
const fs = require('fs');

// Setup info////////////////////////
const web3Provider = 'http://127.0.0.1:8545';
const networkId = '5777';
const ipfsProvider = {
  host: '127.0.0.1',
  port: '5001',
  protocol: 'http',
};
//////////////////////////////////////

//Identity info//////////////////////
const todayDate = new Date().toISOString().slice(0, 10);
const information = {
  identityDate: todayDate,
  did: `DID:NFT:oadnaoisndoiansoi`,
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
const path = `/akn/eu/doc/${information.identityDate}/${information.did}/eng@/`;
const identityReferences = {
  iid: {
    entity: `${information.did}`,
    href: `${path.slice(0, -1)}.akn`,
  },
  iidDIDDoc: {
    entity: 'diddoc.json',
    href: `${path}diddoc.json`,
  },
  iidIssuer: {
    entity: `${information.did}`,
    href: `${path.slice(0, -1)}.akn`,
  },
  eidas: {
    entity: 'EU COM/2021/281 final',
    href: `/akn/eu/doc/2021-03-06/2021_281/eng@.akn`,
  },
  iidIssuerSoftware: {
    type: 'TLCObject',
    entity: 'IntelligibleIdentity1.0.1.hashdigest.json',
    href: `${path}IntelligibleIdentity1.0.1.hashdigest.json`,
  },
  nftSmartContract: {
    type: 'TLCObject',
    entity: 'IntelligibleIdentity.sol',
    href: `${path}IntelligibleIdentity.sol`,
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

const setupFilesForAKN = async (ipfs, directory) => {
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

// Test starts
const simpleNewIdentity = async () => {
  // Setup
  const ipfs = new IPFSWrapper(ipfsProvider);
  const a = new IntelligibleIdentity();
  // Reserve NFT id
  await a.prepareNewIdentityWeb3(web3Provider, 0, undefined, networkId);
  // Get CIDs for referenced files
  const files = await setupFilesForAKN(ipfs, './data/');
  // Create main.xml and save it
  a.newIdentityMeta(information, identityReferences);
  fs.writeFileSync('./data/main.xml', a.meta.finalize());
  const res = await getFileCID(ipfs, './data/', 'main.xml');
  files.push(res.file);
  // Sign the .akn package and store the signature
  await a.signIdentity(false, res.cid);
  fs.writeFileSync('./data/signature.xml', a.signature.finalize());
  const res2 = await getFileCID(ipfs, './data/', 'signature.xml');
  files.push(res2.file);
  // Store the end result in IPFS
  const resFinal = await ipfs.storeIPFSDirectory(path, files);
  // Store the reference in IPFS
  const nftCid = `${resFinal.slice(-1)[0].cid.toString()}${path}main.xml`;
  await a.finalizeNewIdentityWeb3(nftCid);

  return a;
};

const fromAddress = async () => {
  const ipfs = new IPFSWrapper(ipfsProvider);
  // Create new Identity
  const a = await simpleNewIdentity();
  // Obtain the identity from the web3 address
  // (gets the last token in the contract list)
  const b = new IntelligibleIdentity();
  const nftCid = await b.fromWeb3Address(
    web3Provider,
    0,
    a.web3.address,
    networkId
  );
  // Gets the identity document from IPFS
  const resGet = await ipfs.getIPFSFile(nftCid);
  b.fromStringMeta(resGet);
  // Get the signature document and save it
  const signCid = nftCid.split('/').slice(0, -1).join('/') + '/signature.xml';
  const signGet = await ipfs.getIPFSFile(signCid);
  b.fromStringSignature(signGet);

  console.log(b.meta.finalize());
};

//simpleNewIdentity();
fromAddress();
