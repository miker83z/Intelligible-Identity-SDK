const { AKNWrapper, utils } = require('@intelligiblesuite/wrappers');

class IdentityAKN extends AKNWrapper {
  constructor(
    identityAknURI,
    personalInformation,
    addressWeb3,
    addressSmartContractWeb3,
    tokenIdWeb3,
    addressAlgo,
    tokenIdAlgo
  ) {
    super();

    if (identityAknURI !== undefined) {
      this.newIdentityAKNDocument(
        identityAknURI,
        personalInformation,
        addressWeb3,
        addressSmartContractWeb3,
        tokenIdWeb3,
        addressAlgo,
        tokenIdAlgo
      );
    }
  }

  static aknUriFrom(name) {
    return `/akn/eu/intelligibleIdentity/person/${name}/decentralizedIdentity/nonFungible.akn`;
  }

  newIdentityAKNDocument(
    identityAknURI,
    personalInformation,
    addressWeb3,
    addressSmartContractWeb3,
    tokenIdWeb3,
    addressAlgo,
    tokenIdAlgo
  ) {
    this.identityAknURI = identityAknURI;

    const xml = JSON.parse(JSON.stringify(utils.templates.metaAndMainTemplate));

    // global attr
    const hrefId = '#' + personalInformation.name;
    //meta
    ////Identification
    //////FRBRWork
    xml.akomaNtoso.doc.meta.identification.FRBRWork.FRBRthis['@value'] =
      '/akn/eu/intelligibleIdentity/person/' + personalInformation.name;
    xml.akomaNtoso.doc.meta.identification.FRBRWork.FRBRdate[
      '@date'
    ] = new Date().toISOString().slice(0, 10);
    xml.akomaNtoso.doc.meta.identification.FRBRWork.FRBRauthor[
      '@href'
    ] = hrefId;
    //////FRBRExpression
    xml.akomaNtoso.doc.meta.identification.FRBRExpression.FRBRthis['@value'] =
      '/akn/eu/intelligibleIdentity/person/' +
      personalInformation.name +
      'decentralizedIdentity';
    xml.akomaNtoso.doc.meta.identification.FRBRExpression.FRBRdate[
      '@date'
    ] = new Date().toISOString().slice(0, 10);
    xml.akomaNtoso.doc.meta.identification.FRBRExpression.FRBRauthor[
      '@href'
    ] = hrefId;
    //////FRBRManifestation
    xml.akomaNtoso.doc.meta.identification.FRBRManifestation.FRBRthis[
      '@value'
    ] = identityAknURI;
    xml.akomaNtoso.doc.meta.identification.FRBRManifestation.FRBRdate[
      '@date'
    ] = new Date().toISOString().slice(0, 10);
    xml.akomaNtoso.doc.meta.identification.FRBRManifestation.FRBRauthor[
      '@href'
    ] = hrefId;
    ////Reference
    xml.akomaNtoso.doc.meta.references['TLCPerson'] = {
      '@eId': hrefId.slice(1),
      '@href':
        '/akn/eu/intelligibleIdentity/person/' + personalInformation.name,
      '@showAs': 'Author',
    };

    //preface
    xml.akomaNtoso.doc.preface.longTitle.p =
      personalInformation.name + ' Identity';

    //mainBody
    xml.akomaNtoso.doc.mainBody['tblock'] = [
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
          '#': 'Ethereum Address',
        },
        p: {
          '@eId': 'tblock_2__p_1',
          addressWeb3,
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
          smartContractAddress: addressSmartContractWeb3,
          tokenId: tokenIdWeb3,
        },
      },
      {
        '@eId': 'tblock_4',
        heading: {
          '@eId': 'tblock_4__heading',
          '#': 'Algorand Address',
        },
        p: {
          '@eId': 'tblock_4__p_1',
          addressAlgo,
        },
      },
      {
        '@eId': 'tblock_5',
        heading: {
          '@eId': 'tblock_5__heading',
          '#': 'Algorand Token Reference',
        },
        p: {
          '@eId': 'tblock_5__p_1',
          tokenId: tokenIdAlgo,
        },
      },
    ];

    this.metaAndMain = xml;
  }
}

module.exports = { IdentityAKN };
