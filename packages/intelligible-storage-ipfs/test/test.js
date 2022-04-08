const { IPFSWrapper } = require('./..');
const fs = require('fs');

const path = '/akn/eu/doc/2022-04-07/DID:NFT:oadnaoisndoiansoi/eng@/';

const main = async () => {
  try {
    const ipfs = new IPFSWrapper({
      host: '127.0.0.1',
      port: '5001',
      protocol: 'http',
    });
    const files = [];
    const data = fs.readdirSync('data');
    for (let i = 0; i < data.length; i++) {
      files.push({
        path: data[i],
        content: fs.readFileSync(`./data/${data[i]}`, {
          encoding: 'utf8',
          flag: 'r',
        }),
      });
    }
    const CIDsingle = await ipfs.getCIDs('', [files[0]]);
    //console.log(CIDsingle);
    const single = await ipfs.storeIPFSFile(path, files[0]);
    //console.log(single);
    const res = await ipfs.storeIPFSDirectory(path, files);
    //console.log(res);
    const cid = res.slice(-1)[0].cid.toString();
    //console.log(cid);

    const nftCid = `${cid}${path}main.xml`;
    const resGet = await ipfs.getIPFSFile(nftCid);
    //console.log(resGet);
    const resGetDir = await ipfs.getIPFSDirectory(`${cid}${path}`);
    //console.log(resGetDir);
  } catch (error) {
    console.log(error);
  }
};

main();
