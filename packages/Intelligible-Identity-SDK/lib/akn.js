const { AKNDoc } = require('@intelligiblesuite/akomantoso-doc');

class IdentityAKN extends AKNDoc {
  constructor(information, references, web3Information) {
    super();

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

  static aknUriFrom(name) {
    return `/akn/eu/intelligibleIdentity/person/${name}/decentralizedIdentity/nonFungible.akn`;
  }
}

module.exports = { IdentityAKN };
