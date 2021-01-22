const { AKNWrapper, utils } = require('@intelligiblesuite/wrappers');

class CertificateAKN extends AKNWrapper {
  constructor(
    certificateAknURI,
    certifiableEntityInformation,
    addressSmartContractWeb3,
    tokenIdWeb3,
    addressAlgo,
    tokenIdAlgo,
    certifiableEntityOwnerIdentityAknURI,
    certificateProviderIdentityAknURI
  ) {
    super();

    if (certificateAknURI !== undefined) {
      this.newCertificateAKNDocument(
        certificateAknURI,
        certifiableEntityInformation,
        addressSmartContractWeb3,
        tokenIdWeb3,
        addressAlgo,
        tokenIdAlgo,
        certifiableEntityOwnerIdentityAknURI,
        certificateProviderIdentityAknURI
      );
    }
  }
  static uriString =
    '/akn/eu/intelligibleIdentity/person/#/decentralizedIdentity/nonFungible.akn';

  newCertificateAKNDocument(
    certificateAknURI,
    certifiableEntityInformation,
    addressSmartContractWeb3,
    tokenIdWeb3,
    addressAlgo,
    tokenIdAlgo,
    certifiableEntityOwnerIdentityAknURI,
    certificateProviderIdentityAknURI
  ) {
    const xml = JSON.parse(JSON.stringify(utils.templates.metaAndMainTemplate));

    // global attr
    const hrefIdName = '#' + certifiableEntityInformation.name;
    const hrefIdAuthor = '#certificateProvider';
    const hrefIdOwner = '#certificateOwner';
    //meta
    ////Identification
    //////FRBRWork
    xml.akomaNtoso.doc.meta.identification.FRBRWork.FRBRthis['@value'] =
      '/akn/eu/intelligibleCertificate/document/' +
      certifiableEntityInformation.name;
    xml.akomaNtoso.doc.meta.identification.FRBRWork.FRBRdate[
      '@date'
    ] = new Date().toISOString().slice(0, 10);
    xml.akomaNtoso.doc.meta.identification.FRBRWork.FRBRauthor[
      '@href'
    ] = hrefIdAuthor;
    //////FRBRExpression
    xml.akomaNtoso.doc.meta.identification.FRBRExpression.FRBRthis['@value'] =
      '/akn/eu/intelligibleCertificate/document/' +
      certifiableEntityInformation.name +
      '/decentralizedCertificate';
    xml.akomaNtoso.doc.meta.identification.FRBRExpression.FRBRdate[
      '@date'
    ] = new Date().toISOString().slice(0, 10);
    xml.akomaNtoso.doc.meta.identification.FRBRExpression.FRBRauthor[
      '@href'
    ] = hrefIdAuthor;
    //////FRBRManifestation
    xml.akomaNtoso.doc.meta.identification.FRBRManifestation.FRBRthis[
      '@value'
    ] = certificateAknURI;
    xml.akomaNtoso.doc.meta.identification.FRBRManifestation.FRBRdate[
      '@date'
    ] = new Date().toISOString().slice(0, 10);
    xml.akomaNtoso.doc.meta.identification.FRBRManifestation.FRBRauthor[
      '@href'
    ] = hrefIdAuthor;
    ////Reference
    xml.akomaNtoso.doc.meta.references['TLCPerson'] = [
      {
        '@eId': hrefIdAuthor.slice(1),
        '@href': certificateProviderIdentityAknURI,
        '@showAs': 'Author',
      },
      {
        '@eId': hrefIdOwner.slice(1),
        '@href': certifiableEntityOwnerIdentityAknURI,
        '@showAs': 'EntityOwner',
      },
    ];

    //preface
    xml.akomaNtoso.doc.preface.longTitle.p =
      certifiableEntityInformation.name + ' Certificate';

    //mainBody
    xml.akomaNtoso.doc.mainBody['tblock'] = [
      {
        '@eId': 'tblock_1',
        heading: {
          '@eId': 'tblock_1__heading',
          '#': 'Certified Entity Information',
        },
        p: {
          '@eId': 'tblock_1__p_1',
          name: certifiableEntityInformation.name,
          uri: certifiableEntityInformation.uri,
          documentDigest: certifiableEntityInformation.documentDigest,
        },
      },
      {
        '@eId': 'tblock_2',
        heading: {
          '@eId': 'tblock_2__heading',
          '#': 'Ethereum Token Reference',
        },
        p: {
          '@eId': 'tblock_2__p_1',
          smartContractAddress: addressSmartContractWeb3,
          tokenId: tokenIdWeb3,
        },
      },
      {
        '@eId': 'tblock_3',
        heading: {
          '@eId': 'tblock_3__heading',
          '#': 'Algorand Token Reference',
        },
        p: {
          '@eId': 'tblock_3__p_1',
          addressAlgo,
          tokenId: tokenIdAlgo,
        },
      },
      {
        '@eId': 'tblock_4',
        heading: {
          '@eId': 'tblock_4__heading',
          '#': 'Identities',
        },
        p: {
          '@eId': 'tblock_4__p_1',
          certifiedEntityOwner: hrefIdOwner,
          certificateProvider: hrefIdAuthor,
        },
      },
    ];

    this.metaAndMain = xml;
  }
}

module.exports = { CertificateAKN };
