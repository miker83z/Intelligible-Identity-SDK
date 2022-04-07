const { MetaDoc } = require('intelligible-metadata-doc');

/**
 * @description Provides the means to create and manage an intelligible identity
 * metadata document.
 * @extends {MetaDoc}
 */
class IdentityMeta extends MetaDoc {
  /**
   * @description Creates an instance of IdentityMeta. If the information object is not passed as a parameter,
   * the instance will be created empty and a string can be inserted for later parsing.
   * @param {Object} [information] The information regarding the identity (e.g. type, name, etc.)
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

      if (
        !(
          Object.keys(references).includes('iid') &&
          Object.keys(references).includes('iidDIDDoc') &&
          Object.keys(references).includes('iidIssuer')
        )
      ) {
        throw new Error('Needs iid && iidDIDDoc && iidIssuer');
      }
      const informationBlock = {
        blockTitle: 'Identity Information',
        p: {},
      };
      Object.keys(references).forEach((r) => {
        if (references[r]['@eId'] === undefined)
          references[r]['@eId'] = '#' + r;
        if (references[r]['@showAs'] === undefined)
          references[r]['@showAs'] = r;
        informationBlock.p[r] = {
          '#': {
            entity: {
              '@eId': 'ii_block_' + r,
              '@refersTo': references[r]['@eId'],
              '#': references[r].entity,
            },
          },
        };
      });

      const identityElements = {
        identification: {
          FRBRWork: {
            FRBRthis: {
              '@value': `/ank/eu/doc/${information.identityDate}/${information.did}/!main`,
            },
            FRBRuri: {
              '@value': `/ank/eu/doc/${information.identityDate}/${information.did}`,
            },
            FRBRdate: { '@date': information.identityDate },
            FRBRauthor: {
              '@href': references.iidIssuer['@eId'],
            },
            ...tmpFRBRWork,
          },
          FRBRExpression: {
            FRBRthis: {
              '@value': `/ank/eu/doc/${information.identityDate}/${information.did}/eng@!main`,
            },
            FRBRuri: {
              '@value': `/ank/eu/doc/${information.identityDate}/${information.did}/eng@`,
            },
            FRBRdate: { '@date': information.identityDate },
            FRBRauthor: {
              '@href': references.iidIssuer['@eId'],
            },
            ...tmpFRBRExpression,
          },
          FRBRManifestation: {
            FRBRthis: {
              '@value': `/ank/eu/doc/${information.identityDate}/${information.did}/eng@/!main.xml`,
            },
            FRBRuri: {
              '@value': `/ank/eu/doc/${information.identityDate}/${information.did}/eng@.akn`,
            },
            FRBRdate: { '@date': information.identityDate },
            FRBRauthor: {
              '@href': references.iidIssuer['@eId'],
            },
            ...tmpFRBRManifestation,
          },
        },
        references: references,
        prefaceTitle: `Identity issued by ${references.iidIssuer.entity} for ${references.iid.entity}`,
        mainBody: {
          information: informationBlock,
          ...tmpAdditionalBody,
        },
      };

      this.newMetaDocument(identityElements);
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
      identityDate:
        this.metaAndMain.metaDoc.doc.meta.identification.FRBRManifestation
          .FRBRdate['@date'],
      did: informationInfo.iid.entity['#'],
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

    Object.keys(informationInfo).forEach((key) => {
      const v = informationInfo[key];
      if (
        typeof v === 'object' &&
        v.entity !== undefined &&
        v.entity['@refersTo'] !== undefined
      ) {
        const ref = this.findValueByEId(v.entity['@refersTo']).toObject();
        const receiverType = Object.keys(ref)[0];
        references[key] = {
          type: receiverType,
          entity: v.entity['#'],
          '@eId': v.entity['@refersTo'],
          href: ref[receiverType]['@href'],
          '@showAs': ref[receiverType]['@showAs'],
        };
      }
    });

    const othersBody =
      this.findValueByEId('mainBody').toObject().mainBody.tblock;

    if (Array.isArray(othersBody)) {
      othersBody.forEach((block) => {
        if (block['@eId'] !== 'tblock_1') {
          information.additionalBody[block['@eId']] = {
            blockTitle: block.heading['#'],
            p: block.p,
          };
        }
      });
    }

    return { information, references };
  }
}

module.exports = { IdentityMeta };
