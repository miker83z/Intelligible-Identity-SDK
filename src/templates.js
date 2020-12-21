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

module.exports = { template };
