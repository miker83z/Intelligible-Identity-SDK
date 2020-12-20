const { create, convert } = require('xmlbuilder2');
const Web3 = require('web3');
//const Web3 = require('./dist/web3.min.js');

const schemaLocation =
  'http://docs.oasis-open.org/legaldocml/ns/akn/3.0 ../schemas/akomantoso30.xsd';
const template = {
  akomaNtoso: {
    '@xsi:schemaLocation': schemaLocation,
    doc: {
      '@name': 'identity',
      '@contains': 'originalVersion',
      meta: {
        identification: {
          '@source': 'software',
          FRBRWork: {
            FRBRthis: {
              '@eId': 'frbrwork__frbrthis',
              '@value': '/akn/eu/intelligibleIdentity/person/MilesDavis',
            },
            FRBRuri: { '@eId': 'frbrwork__frbruri', '@value': '' },
            FRBRdate: {
              '@eId': 'frbrwork__frbrdate_1',
              '@date': '2013-09-17',
              '@name': 'ADP_byCOM',
            },
            FRBRauthor: {
              '@eId': 'frbrwork__frbrauthor_1',
              '@href': '#miles',
              '@as': '#author',
            },
            FRBRcountry: { '@eId': 'frbrwork__frbrcountry', '@value': 'eu' },
            /*
            FRBRprescriptive: {
              '@eId': 'frbrwork__frbrprescriptive',
              '@value': 'false',
            },
            FRBRauthoritative: {
              '@eId': 'frbrwork__frbrauthoritative',
              '@value': 'false',
            },*/
          },
          FRBRExpression: {
            FRBRthis: {
              '@eId': 'frbrexpression__frbrthis',
              '@value':
                '/akn/eu/intelligibleIdentity/person/MilesDavis/decentralizedIdentity',
            },
            FRBRuri: { '@eId': 'frbrexpression__frbruri', '@value': '' },
            FRBRdate: {
              '@eId': 'frbrexpression__frbrdate_1',
              '@date': '2013-09-17',
              '@name': 'ADP_byCOM',
            },
            FRBRauthor: {
              '@eId': 'frbrexpression__frbrauthor_1',
              '@href': '#miles',
            },
            FRBRlanguage: {
              '@eId': 'frbrexpression__frbrlanguage_1',
              '@language': 'eng',
            },
          },
          FRBRManifestation: {
            FRBRthis: {
              '@eId': 'frbrmanifestation__frbrthis',
              '@value':
                '/akn/eu/intelligibleIdentity/person/MilesDavis/decentralizedIdentity/nonFungible.akn',
            },
            FRBRuri: { '@eId': 'frbrmanifestation__frbruri', '@value': '' },
            FRBRdate: {
              '@eId': 'frbrmanifestation__frbrdate_1',
              '@date': '2014-10-25',
              '@name': 'instantiation',
            },
            FRBRauthor: {
              '@eId': 'frbrmanifestation__frbrauthor_1',
              '@href': '#miles',
              '@as': '#author',
            },
          },
        },
        references: {
          '@source': 'software',
        },
      },
      preface: {
        '@eId': 'preface',
        longTitle: {
          '@eId': 'preface__longTitle_1',
          p: 'Miles Davis Identity',
        },
      },
      mainBody: {
        '@eId': 'mainBody',
      },
      conclusions: {
        '@eId': 'conclusions',
        signatures: {
          '@eId': 'conclusions__signatures_1',
          softwareSignature: {
            '@eId': 'conclusions__signatures_1_softwareSignature',
            '#': 'softwareSignature',
          },
          identitySignature: {
            '@eId': 'conclusions__signatures_1_identitySignature',
            '#': 'identitySignature',
          },
        },
      },
    },
  },
};

class IntelligibleIdentity {
  async initWeb3(web3Provider, intelligibleIdArtifact, networkId) {
    this.web3 = new Web3(web3Provider);

    //const intelligibleIdArtifact = await JSON.parse(contractArtifactRaw);
    this.contract = new this.web3.eth.Contract(
      intelligibleIdArtifact.abi,
      intelligibleIdArtifact.networks[networkId].address
    );

    this.contract.setProvider(web3Provider);

    /*
    const totalSupply = await this.contract.methods.totalSupply().call();
    console.log(totalSupply);
    */
  }

  async newIdentityTokenWeb3(data) {
    if (
      this.web3 === 'undefined' &&
      this.contract === 'undefined' &&
      data.name === 'undefined'
    )
      return;

    const identityAknURI = this.AKNUriString(data.name);
    const accounts = await this.web3.eth.getAccounts();
    const publicKey = accounts[0];

    try {
      const res = await this.contract.methods
        .newIdentity(publicKey, identityAknURI)
        .send({ from: publicKey, gas: 1000000 });
      const tokenId = res.events['Transfer'].returnValues['tokenId'];
      console.log('Token Id:' + tokenId);

      return { identityAknURI, publicKey, tokenId };
    } catch (error) {
      console.log('Token Creation Error: ' + error);
    }
  }

  newAKNDocument(identityAknURI, personalInformation, publicKey, tokenId) {
    // global attr
    const hrefId = '#' + personalInformation.name;
    //meta
    ////Identification
    //////FRBRWork
    template.akomaNtoso.doc.meta.identification.FRBRWork.FRBRthis['@value'] =
      '/akn/eu/intelligibleIdentity/person/' + personalInformation.name;
    template.akomaNtoso.doc.meta.identification.FRBRWork.FRBRdate[
      '@date'
    ] = new Date().toISOString().slice(0, 10);
    template.akomaNtoso.doc.meta.identification.FRBRWork.FRBRauthor[
      '@href'
    ] = hrefId;
    //////FRBRExpression
    template.akomaNtoso.doc.meta.identification.FRBRExpression.FRBRthis[
      '@value'
    ] =
      '/akn/eu/intelligibleIdentity/person/' +
      personalInformation.name +
      'decentralizedIdentity';
    template.akomaNtoso.doc.meta.identification.FRBRExpression.FRBRdate[
      '@date'
    ] = new Date().toISOString().slice(0, 10);
    template.akomaNtoso.doc.meta.identification.FRBRExpression.FRBRauthor[
      '@href'
    ] = hrefId;
    //////FRBRManifestation
    template.akomaNtoso.doc.meta.identification.FRBRManifestation.FRBRthis[
      '@value'
    ] = identityAknURI;
    template.akomaNtoso.doc.meta.identification.FRBRManifestation.FRBRdate[
      '@date'
    ] = new Date().toISOString().slice(0, 10);
    template.akomaNtoso.doc.meta.identification.FRBRManifestation.FRBRauthor[
      '@href'
    ] = hrefId;
    ////Reference
    template.akomaNtoso.doc.meta.references['TLCPerson'] = {
      '@eId': hrefId.slice(1),
      '@href':
        '/akn/eu/intelligibleIdentity/person/' + personalInformation.name,
      '@showAs': 'Author',
    };

    //preface
    template.akomaNtoso.doc.preface.longTitle.p =
      personalInformation.name + ' Identity';

    //mainBody
    template.akomaNtoso.doc.mainBody['tblock'] = [
      {
        '@eId': 'tblock_1',
        heading: {
          '@eId': 'tblock_1__heading',
          '#': 'Personal Information',
        },
        p: {
          '@eId': 'tblock_1__p_1',
          name: personalInformation.name,
          email: personalInformation.email,
        },
      },
      {
        '@eId': 'tblock_2',
        heading: {
          '@eId': 'tblock_2__heading',
          '#': 'Public Key',
        },
        p: {
          '@eId': 'tblock_2__p_1',
          publicKey,
        },
      },
      {
        '@eId': 'tblock_3',
        heading: {
          '@eId': 'tblock_3__heading',
          '#': 'Ethereum Token Reference',
        },
        p: {
          '@eId': 'tblock_3__p_1',
          smartContractAddress: this.contract._address,
          tokenId,
        },
      },
    ];
    //conclusions
    template.akomaNtoso.doc.conclusions.signatures.softwareSignature['#'] =
      'softwareSignature';
    // Software signature TODO

    // Create
    const doc = create(template);
    const xml = doc.end({ prettyPrint: true });

    return xml;
  }

  async signDataWeb3(data) {
    if (this.web3 === 'undefined') return;
    const signers = await this.web3.eth.getAccounts();
    if (signers.length < 1) return;

    //const signature = await this.web3.eth.personal.sign(data, signers[0]);
    const signature = await this.web3.eth.sign(data, signers[0]);

    return this.ultimate(data, signature);
  }

  ultimate(data, signature) {
    const obj = convert(data, { format: 'object' });
    obj.akomaNtoso.doc.conclusions.signatures.identitySignature[
      '#'
    ] = signature;

    // Create
    const doc = create(obj);
    const xml = doc.end({ prettyPrint: true });

    return xml;
  }

  async newAddress() {
    if (this.web3 === 'undefined' && this.contract === 'undefined') return;
    this.idAddress = this.web3.eth.accounts.create();

    //this.web3.eth.accounts.wallet.add(this.idAddress);
    //console.log(this.web3.eth.accounts.wallet.length);

    //console.log(await this.web3.eth.getAccounts());
    //const ac = await this.web3.eth.personal.newAccount('');
  }

  AKNUriString(name) {
    return `/akn/eu/intelligibleIdentity/person/${name}/decentralizedIdentity/nonFungible.akn`;
  }
}

module.exports = IntelligibleIdentity;
