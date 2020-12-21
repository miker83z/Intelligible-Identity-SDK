const { create, convert } = require('xmlbuilder2');
const utils = require('./templates');

const newAKNDocument = (
  identityAknURI,
  personalInformation,
  publicKey,
  scAddress,
  tokenId
) => {
  const template = JSON.parse(JSON.stringify(utils.template));

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
    '@href': '/akn/eu/intelligibleIdentity/person/' + personalInformation.name,
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
        smartContractAddress: scAddress,
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
};

const ultimate = (data, signature) => {
  const obj = convert(data, { format: 'object' });
  obj.akomaNtoso.doc.conclusions.signatures.identitySignature['#'] = signature;

  // Create
  const doc = create(obj);
  const xml = doc.end({ prettyPrint: true });

  return xml;
};

const AKNUriString = (name) => {
  return `/akn/eu/intelligibleIdentity/person/${name}/decentralizedIdentity/nonFungible.akn`;
};

module.exports = { newAKNDocument, ultimate, AKNUriString };
