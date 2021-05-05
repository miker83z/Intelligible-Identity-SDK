const { MetaDoc } = require('@intelligiblesuite/metadata-doc');

/**
 * @description Provides the means to create and manage an intelligible certificate
 * metadata document.
 * @extends {MetaDoc}
 */
class CertificateMeta extends MetaDoc {
  /**
   * @description Creates an instance of CertificateMeta. If the information object is not passed as a parameter,
   * the instance will be created empty and a string can be inserted for later parsing.
   * @param {Object} [information] The information regarding the certificate (e.g. type, name, etc.)
   * @param {Object} [references] The references to other persons, organizations, objects
   * @param {Object} [web3Information] The the information regarding the Ethereum representation (token)
   */
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
              block: [
                {
                  '@eId': 'identities_block_cert_issuer',
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
                  '@eId': 'identities_block_cert_issuer_repr',
                  person: {
                    '@eId': 'identities_cert_issuer_repr',
                    '@refersTo': references.certIssuerRepresentative['@eId'],
                    '#': references.certIssuerRepresentative.name,
                  },
                  role: {
                    '@eId': 'identities_cert_issuer_repr_role',
                    '@refersTo':
                      references.certIssuerRepresentativeRole['@eId'],
                    '#': references.certIssuerRepresentativeRole.name,
                  },
                },
                {
                  '@eId': 'identities_block_cert_receiver',
                  person: {
                    '@eId': 'identities_cert_receiver',
                    '@refersTo': references.certReceiver['@eId'],
                    '#': references.certReceiver.name,
                  },
                  role: {
                    '@eId': 'identities_cert_receiver_role',
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

      this.newMetaDocument(certificateElements);
    }
  }

  /**
   * @description Parses the document string after it has been created from a string
   * @return {Object} An object containing the information object and references object
   */
  parseInformationAndReferences() {
    if (Object.keys(this.metaAndMain).length === 0) return;
    var information = {},
      references = {};

    const informationInfo = this.findValueByEId('tblock_1__p_1').toObject().p;
    information = {
      certificateType: informationInfo.certificateType,
      certifiedEntityType: informationInfo.certifiedEntityType,
      certificateExpression: informationInfo.certificateExpression,
      certificateDate: informationInfo.docDate['#'],
      FRBRWork: JSON.parse(
        JSON.stringify(
          this.metaAndMain.metaDoc.doc.meta.identification.FRBRWork
        )
      ),
      FRBRExpression: JSON.parse(
        JSON.stringify(
          this.metaAndMain.metaDoc.doc.meta.identification.FRBRExpression
        )
      ),
      FRBRManifestation: JSON.parse(
        JSON.stringify(
          this.metaAndMain.metaDoc.doc.meta.identification.FRBRManifestation
        )
      ),
      additionalBody: {},
    };
    Object.values(informationInfo.certificateEntity).forEach((v) => {
      if (typeof v === 'object' && v['@refersTo'] !== undefined) {
        const ref = this.findValueByEId(v['@refersTo']).toObject();
        const receiverType = Object.keys(ref)[0];

        references[v['@refersTo'].slice(1)] = {
          type: receiverType,
          name: v['#'],
          documentHashDigest:
            informationInfo.certificateEntity.documentHashDigest,
          '@eId': v['@refersTo'],
          '@href': ref[receiverType]['@href'],
          '@showAs': ref[receiverType]['@showAs'],
        };
      }
    });

    const identitiesInfo = this.findValueByEId('tblock_3__p_3').toObject().p
      .block;
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

module.exports = { CertificateMeta };
