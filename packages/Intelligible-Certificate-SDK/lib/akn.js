const { AKNDoc } = require('@intelligiblesuite/akomantoso-doc');

class CertificateAKN extends AKNDoc {
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

    const certificateElements = {
      identification: {
        FRBRWork: {
          FRBRthis: {
            '@value': `/akn/eu/doc/intelligibleCertificate/${references.certIssuer.name}/${information.certificateType}/${information.certifiedEntityType}/${references.certEntity.name}/!main`,
          },
          FRBRuri: {
            '@value': `/akn/eu/doc/intelligibleCertificate/${references.certIssuer.name}/${information.certificateType}/${information.certifiedEntityType}/${references.certEntity.name}/`,
          },
          FRBRdate: { '@date': information.certificateDate },
          FRBRauthor: {
            '@href': references.certIssuerRepresentative['@eId'],
          },
          ...tmpFRBRWork,
        },
        FRBRExpression: {
          FRBRthis: {
            '@value': `/akn/eu/doc/intelligibleCertificate/${references.certIssuer.name}/${information.certificateType}/${information.certifiedEntityType}/${references.certEntity.name}/${information.certificateExpression}/!main`,
          },
          FRBRuri: {
            '@value': `/akn/eu/doc/intelligibleCertificate/${references.certIssuer.name}/${information.certificateType}/${information.certifiedEntityType}/${references.certEntity.name}/${information.certificateExpression}/`,
          },
          FRBRdate: { '@date': information.certificateDate },
          FRBRauthor: {
            '@href': references.certIssuerRepresentative['@eId'],
          },
          ...tmpFRBRExpression,
        },
        FRBRManifestation: {
          FRBRthis: {
            '@value': `/akn/eu/doc/intelligibleCertificate/${references.certIssuer.name}/${information.certificateType}/${information.certifiedEntityType}/${references.certEntity.name}/${information.certificateExpression}/!main.xml`,
          },
          FRBRuri: {
            '@value': `/akn/eu/doc/intelligibleCertificate/${references.certIssuer.name}/${information.certificateType}/${information.certifiedEntityType}/${references.certEntity.name}/${information.certificateExpression}.akn`,
          },
          FRBRdate: { '@date': information.certificateDate },
          FRBRauthor: {
            '@href': references.certIssuerRepresentative['@eId'],
          },
          ...tmpFRBRManifestation,
        },
      },
      references: references,
      prefaceTitle: `${information.certificateType} Certificate issued by ${references.certIssuer.name} to ${references.certReceiver.name} in reference to ${references.certEntity.name}`,
      mainBody: {
        information: {
          blockTitle: 'Certified Entity Information',
          p: {
            certificateType: information.certificateType,
            certifiedEntityType: information.certifiedEntityType,
            certificateExpression: information.certificateExpression,
            docDate: {
              '@eId': 'cert_ent_info_cert_date',
              '@date': information.certificateDate,
              '#': information.certificateDate,
            },
            certificateEntity: {
              object: {
                '@eId': 'cert_ent_info_cert_entity',
                '@refersTo': references.certEntity['@eId'],
                '#': references.certEntity.name,
              },
              documentHashDigest: references.certEntity.documentHashDigest,
            },
          },
        },
        web3: {
          blockTitle: 'Ethereum Token Reference',
          p: web3Information,
        },
        identities: {
          blockTitle: 'Identities',
          p: {
            mod: [
              {
                '@eId': 'identities_mod_cert_issuer',
                organization: {
                  '@eId': 'identities_cert_issuer',
                  '@refersTo': references.certIssuer['@eId'],
                  '#': references.certIssuer.name,
                },
                role: {
                  '@eId': 'identities_cert_issuer_role',
                  '@refersTo': references.certIssuerRole['@eId'],
                  '#': references.certIssuerRole.name,
                },
              },
              {
                '@eId': 'identities_mod_cert_issuer_repr',
                person: {
                  '@eId': 'identities_cert_issuer_repr',
                  '@refersTo': references.certIssuerRepresentative['@eId'],
                  '#': references.certIssuerRepresentative.name,
                },
                role: {
                  '@eId': 'identities_cert_issuer_repr_role',
                  '@refersTo': references.certIssuerRepresentativeRole['@eId'],
                  '#': references.certIssuerRepresentativeRole.name,
                },
              },
              {
                '@eId': 'identities_mod_cert_issuer_repr',
                person: {
                  '@eId': 'identities_cert_issuer_repr',
                  '@refersTo': references.certReceiver['@eId'],
                  '#': references.certReceiver.name,
                },
                role: {
                  '@eId': 'identities_cert_issuer_repr_role',
                  '@refersTo': references.certReceiverRole['@eId'],
                  '#': references.certReceiverRole.name,
                },
              },
            ],
          },
        },
        ...tmpAdditionalBody,
      },
    };

    this.newAKNDocument(certificateElements);
  }

  static aknUriFrom(name) {
    return `/akn/eu/intelligibleCertificate/document/${name}/decentralizedCertificate/nonFungible.akn`;
  }
}

module.exports = { CertificateAKN };
