const { AKNDoc } = require('@intelligiblesuite/akomantoso-doc');

class IdentityAKN extends AKNDoc {
  constructor(information, references, web3Information) {
    super();

    if (information !== undefined) {
      const tmpAdditionalBody =
        information.additionalBody !== undefined
          ? information.additionalBody
          : {};
      const tmpFRBRWork =
        information.FRBRWork !== undefined ? information.FRBRWork : {};
      const tmpFRBRExpression =
        information.FRBRExpression !== undefined
          ? information.FRBRExpression
          : {};
      const tmpFRBRManifestation =
        information.FRBRManifestation !== undefined
          ? information.FRBRManifestation
          : {};

      const identityElements = {
        identification: {
          FRBRWork: {
            FRBRthis: {
              '@value': `/akn/eu/doc/intelligibleIdentity/${information.identityType}/${references.idReceiver.name}/!main`,
            },
            FRBRuri: {
              '@value': `/akn/eu/doc/intelligibleIdentity/${information.identityType}/${references.idReceiver.name}/`,
            },
            FRBRdate: { '@date': information.identityDate },
            FRBRauthor: {
              '@href': references.idIssuerRepresentative['@eId'],
            },
            ...tmpFRBRWork,
          },
          FRBRExpression: {
            FRBRthis: {
              '@value': `/akn/eu/doc/intelligibleIdentity/${information.identityType}/${references.idReceiver.name}/${references.idIssuer.name}/${information.identityExpression}/!main`,
            },
            FRBRuri: {
              '@value': `/akn/eu/doc/intelligibleIdentity/${information.identityType}/${references.idReceiver.name}/${references.idIssuer.name}/${information.identityExpression}/`,
            },
            FRBRdate: { '@date': information.identityDate },
            FRBRauthor: {
              '@href': references.idIssuerRepresentative['@eId'],
            },
            ...tmpFRBRExpression,
          },
          FRBRManifestation: {
            FRBRthis: {
              '@value': `/akn/eu/doc/intelligibleIdentity/${information.identityType}/${references.idReceiver.name}/${references.idIssuer.name}/${information.identityExpression}/!main.xml`,
            },
            FRBRuri: {
              '@value': `/akn/eu/doc/intelligibleIdentity/${information.identityType}/${references.idReceiver.name}/${references.idIssuer.name}/${information.identityExpression}.akn`,
            },
            FRBRdate: { '@date': information.identityDate },
            FRBRauthor: {
              '@href': references.idIssuerRepresentative['@eId'],
            },
            ...tmpFRBRManifestation,
          },
        },
        references: references,
        prefaceTitle: `Identity of type ${information.identityType} issued by ${references.idIssuer.name} to ${references.idReceiver.name}`,
        mainBody: {
          information: {
            blockTitle: 'Identity Information',
            p: {
              identityType: information.identityType,
              identityExpression: information.identityExpression,
              docDate: {
                '@eId': 'id_info_id_date',
                '@date': information.identityDate,
                '#': information.identityDate,
              },
              [information.identityType]: {
                '@eId': 'id_info_id_info',
                '@refersTo': references.idReceiver['@eId'],
                '#': {
                  name: information.name,
                  email: information.email,
                },
              },
            },
          },
          web3: {
            blockTitle: 'Ethereum Address',
            p: web3Information,
          },
          identities: {
            blockTitle: 'Identities',
            p: {
              mod: [
                {
                  '@eId': 'identities_mod_id_issuer',
                  [references.idIssuer.type.slice(3).toLowerCase()]: {
                    '@eId': 'identities_id_issuer',
                    '@refersTo': references.idIssuer['@eId'],
                    '#': references.idIssuer.name,
                  },
                  role: {
                    '@eId': 'identities_id_issuer_role',
                    '@refersTo': references.idIssuerRole['@eId'],
                    '#': references.idIssuerRole.name,
                  },
                },
                {
                  '@eId': 'identities_mod_id_issuer_repr',
                  [references.idIssuerRepresentative.type
                    .slice(3)
                    .toLowerCase()]: {
                    '@eId': 'identities_id_issuer_repr',
                    '@refersTo': references.idIssuerRepresentative['@eId'],
                    '#': references.idIssuerRepresentative.name,
                  },
                  role: {
                    '@eId': 'identities_id_issuer_repr_role',
                    '@refersTo': references.idIssuerRepresentativeRole['@eId'],
                    '#': references.idIssuerRepresentativeRole.name,
                  },
                },
                {
                  '@eId': 'identities_mod_id_issuer_repr',
                  [references.idReceiver.type.slice(3).toLowerCase()]: {
                    '@eId': 'identities_id_issuer_repr',
                    '@refersTo': references.idReceiver['@eId'],
                    '#': references.idReceiver.name,
                  },
                  role: {
                    '@eId': 'identities_id_issuer_repr_role',
                    '@refersTo': references.idReceiverRole['@eId'],
                    '#': references.idReceiverRole.name,
                  },
                },
              ],
            },
          },
          ...tmpAdditionalBody,
        },
      };

      this.newAKNDocument(identityElements);
    }
  }

  parseInformationAndReferences() {
    if (Object.keys(this.metaAndMain).length === 0) return;
    var information = {},
      references = {};

    const informationInfo = this.findValueByEId('tblock_1__p_1').toObject().p;
    information = {
      identityType: informationInfo.identityType,
      identityExpression: informationInfo.identityExpression,
      identityDate: informationInfo.docDate['#'],
      name: informationInfo[informationInfo.identityType].name,
      email: informationInfo[informationInfo.identityType].email,
      FRBRWork: JSON.parse(
        JSON.stringify(
          this.metaAndMain.akomaNtoso.doc.meta.identification.FRBRWork
        )
      ),
      FRBRExpression: JSON.parse(
        JSON.stringify(
          this.metaAndMain.akomaNtoso.doc.meta.identification.FRBRExpression
        )
      ),
      FRBRManifestation: JSON.parse(
        JSON.stringify(
          this.metaAndMain.akomaNtoso.doc.meta.identification.FRBRManifestation
        )
      ),
      additionalBody: {},
    };

    const identitiesInfo = this.findValueByEId('tblock_3__p_3').toObject().p
      .mod;
    identitiesInfo.forEach((id) => {
      Object.values(id).forEach((v) => {
        if (typeof v === 'object' && v['@refersTo'] !== undefined) {
          const ref = this.findValueByEId(v['@refersTo']).toObject();
          const receiverType = Object.keys(ref)[0];

          references[v['@refersTo'].slice(1)] = {
            type: receiverType,
            name: v['#'],
            '@eId': v['@refersTo'],
            '@href': ref[receiverType]['@href'],
            '@showAs': ref[receiverType]['@showAs'],
          };
        }
      });
    });

    return { information, references };
  }
}

module.exports = { IdentityAKN };
