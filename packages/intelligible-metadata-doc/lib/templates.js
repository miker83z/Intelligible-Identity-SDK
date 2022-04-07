const templates = {
  metaAndMainTemplate: {
    akomaNtoso: {
      '@xmlns': 'http://docs.oasis-open.org/legaldocml/ns/akn/3.0/CSD06',
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@xsi:schemaLocation':
        'http://akomantoso.googlecode.com/svn/release/trunk/schema/akomantoso30.xsd',
      doc: {
        '@name': 'certificate',
        '@contains': 'originalVersion',
        meta: {
          identification: {
            '@source': '#issuerSoftware',
            FRBRWork: {
              FRBRthis: {
                '@eId': 'frbrwork__frbrthis',
                '@value': '/meta/eu/intelligibleIdentity/person/MilesDavis',
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
              componentInfo: {
                componentData: [
                  {
                    '@eId': 'wmain',
                    '@href': '#emain',
                    '@name': 'main',
                    '@showAs': 'Main document',
                  },
                ],
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
                  '/meta/eu/intelligibleIdentity/person/MilesDavis/decentralizedIdentity',
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
              componentInfo: {
                componentData: [
                  {
                    '@eId': 'emain',
                    '@href': '#mmain',
                    '@name': 'main',
                    '@showAs': 'Main document',
                  },
                ],
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
                  '/meta/eu/intelligibleIdentity/person/MilesDavis/decentralizedIdentity/nonFungible.meta',
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
              componentInfo: {
                componentData: [
                  {
                    '@eId': 'mmain',
                    '@href': 'main.xml',
                    '@name': 'main',
                    '@showAs': 'Main document',
                  },
                ],
              },
            },
          },
          references: {
            '@source': '#issuerSoftware',
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
      },
    },
  },
  conclTemplate: {
    conclusions: {
      '@eId': 'conclusions',
      signature: [],
    },
  },
};

module.exports = { templates };
