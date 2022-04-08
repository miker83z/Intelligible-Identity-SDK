const { AKNDoc } = require('intelligible-akn-doc');

/**
 * @description Provides the means to create and manage an intelligible certificate
 * metadata document.
 * @extends {AKNDoc}
 */
class CertificateMeta extends AKNDoc {
  /**
   * @description Creates an instance of CertificateMeta. If the information object is not passed as a parameter,
   * the instance will be created empty and a string can be inserted for later parsing.
   * @param {Object} [information] The information regarding the certificate (e.g. type, name, etc.)
   * @param {Object} [references] The references to other persons, organizations, objects
   */
  constructor(information, references) {
    super();

    if (information !== undefined) {
      const tmpAdditionalBody =
        information.additionalBody !== undefined
          ? information.additionalBody
          : {};
      const tmpFRBRWork =
        information.FRBRWork !== undefined ? information.FRBRWork : {};
      if (tmpFRBRWork.componentInfo === undefined)
        tmpFRBRWork.componentInfo = {
          componentData: [{}],
        };
      const tmpFRBRWorkcomponentData = tmpFRBRWork.componentInfo.componentData;
      const tmpFRBRExpression =
        information.FRBRExpression !== undefined
          ? information.FRBRExpression
          : {};
      if (tmpFRBRExpression.componentInfo === undefined)
        tmpFRBRExpression.componentInfo = {
          componentData: [{}],
        };
      const tmpFRBRExpressioncomponentData =
        tmpFRBRExpression.componentInfo.componentData;
      const tmpFRBRManifestation =
        information.FRBRManifestation !== undefined
          ? information.FRBRManifestation
          : {};
      if (tmpFRBRManifestation.componentInfo === undefined)
        tmpFRBRManifestation.componentInfo = {
          componentData: [{}],
        };
      const tmpFRBRManifestationcomponentData =
        tmpFRBRManifestation.componentInfo.componentData;

      if (
        !(
          Object.keys(references).includes('icert') &&
          Object.keys(references).includes('icertVCDoc') &&
          Object.keys(references).includes('icertReceiver') &&
          Object.keys(references).includes('icertIssuer')
        )
      ) {
        throw new Error(
          'Needs icert && icertVCDoc && icertReceiver && icertIssuer'
        );
      }
      const informationBlock = {
        blockTitle: 'Certificate Information',
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
              '@eId': 'ci_block_' + r,
              '@refersTo': references[r]['@eId'],
              '#': references[r].entity,
            },
          },
        };
      });

      const certificateElements = {
        identification: {
          FRBRWork: {
            FRBRthis: {
              '@value': `/akn/eu/doc/${information.certificateDate}/${information.didReceiver}:${information.icertId}/main`,
            },
            FRBRuri: {
              '@value': `/akn/eu/doc/${information.certificateDate}/${information.didReceiver}:${information.icertId}`,
            },
            FRBRdate: { '@date': information.certificateDate },
            FRBRauthor: {
              '@href': references.icertIssuer['@eId'],
            },
            ...tmpFRBRWork,
            componentInfo: {
              componentData: [
                ...tmpFRBRWorkcomponentData,
                {
                  '@eId': 'wmain',
                  '@href': '#emain',
                  '@name': 'main',
                  '@showAs': 'Main document',
                },
                {
                  '@eId': 'wvcdoc',
                  '@href': '#evcdoc',
                  '@name': 'vcdoc',
                  '@showAs': 'VC Document',
                },
              ],
            },
          },
          FRBRExpression: {
            FRBRthis: {
              '@value': `/akn/eu/doc/${information.certificateDate}/${information.didReceiver}:${information.icertId}/eng@!main`,
            },
            FRBRuri: {
              '@value': `/akn/eu/doc/${information.certificateDate}/${information.didReceiver}:${information.icertId}/eng@`,
            },
            FRBRdate: { '@date': information.certificateDate },
            FRBRauthor: {
              '@href': references.icertIssuer['@eId'],
            },
            ...tmpFRBRExpression,
            componentInfo: {
              componentData: [
                ...tmpFRBRExpressioncomponentData,
                {
                  '@eId': 'emain',
                  '@href': '#mmain',
                  '@name': 'main',
                  '@showAs': 'Main document',
                },
                {
                  '@eId': 'evcdoc',
                  '@href': '#wvcdoc',
                  '@name': 'vcdoc',
                  '@showAs': 'VC Document',
                },
              ],
            },
          },
          FRBRManifestation: {
            FRBRthis: {
              '@value': `/akn/eu/doc/${information.certificateDate}/${information.didReceiver}:${information.icertId}/eng@/main.xml`,
            },
            FRBRuri: {
              '@value': `/akn/eu/doc/${information.certificateDate}/${information.didReceiver}:${information.icertId}/eng@.akn`,
            },
            FRBRdate: { '@date': information.certificateDate },
            FRBRauthor: {
              '@href': references.icertIssuer['@eId'],
            },
            ...tmpFRBRManifestation,
            componentInfo: {
              componentData: [
                ...tmpFRBRManifestationcomponentData,
                {
                  '@eId': 'mmain',
                  '@href': 'main.xml',
                  '@name': 'main',
                  '@showAs': 'Main document',
                },
                {
                  '@eId': 'mvcdoc',
                  '@href': 'vcdoc.json',
                  '@name': 'vcdoc',
                  '@showAs': 'VC Document',
                },
              ],
            },
          },
        },
        references: references,
        prefaceTitle: `Certificate issued by ${references.icertIssuer.entity} for ${references.icert.entity} to ${references.icertReceiver.entity}`,
        mainBody: {
          information: informationBlock,
          ...tmpAdditionalBody,
        },
      };

      this.newAKNDocument(certificateElements);
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
      certificateDate:
        this.metaAndMain.akomaNtoso.doc.meta.identification.FRBRManifestation
          .FRBRdate['@date'],
      didReceiver: informationInfo.icertReceiver.entity['#'],
      icertId: informationInfo.icert.entity['#'].split(':').slice(-1)[0],
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

module.exports = { CertificateMeta };
