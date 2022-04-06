const { create, convert } = require('xmlbuilder2');
const utils = require('./templates');

/**
 * @description Wraps an XML document into a class. Allows to export an
 * XML document to a string and to import a new one from a string,
 */
class MetaDoc {
  /**
   * @description Creates an instance of MetaDoc.
   */
  constructor() {
    this.metaAndMain = {};
    this.conclusions = {};

    this.create = create;
  }

  /**
   * @description Creates a new XML document and stores it in this.metaAndMain
   * @param {Object} docElements An object used to create the document.
   */
  newMetaDocument(docElements) {
    const xml = JSON.parse(JSON.stringify(utils.templates.metaAndMainTemplate));
    //meta
    ////Identification
    //////FRBRWork
    Object.keys(docElements.identification.FRBRWork).forEach((e) => {
      if (e in xml.metaDoc.doc.meta.identification.FRBRWork) {
        xml.metaDoc.doc.meta.identification.FRBRWork[e] = {
          ...xml.metaDoc.doc.meta.identification.FRBRWork[e],
          ...docElements.identification.FRBRWork[e],
        };
      } else {
        xml.metaDoc.doc.meta.identification.FRBRWork[e] = {
          ...docElements.identification.FRBRWork[e],
        };
      }
    });
    //////
    //////FRBRExpression
    Object.keys(docElements.identification.FRBRExpression).forEach((e) => {
      if (e in xml.metaDoc.doc.meta.identification.FRBRExpression) {
        xml.metaDoc.doc.meta.identification.FRBRExpression[e] = {
          ...xml.metaDoc.doc.meta.identification.FRBRExpression[e],
          ...docElements.identification.FRBRExpression[e],
        };
      } else {
        xml.metaDoc.doc.meta.identification.FRBRExpression[e] = {
          ...docElements.identification.FRBRExpression[e],
        };
      }
    });
    //////
    //////FRBRManifestation
    Object.keys(docElements.identification.FRBRManifestation).forEach((e) => {
      if (e in xml.metaDoc.doc.meta.identification.FRBRManifestation) {
        xml.metaDoc.doc.meta.identification.FRBRManifestation[e] = {
          ...xml.metaDoc.doc.meta.identification.FRBRManifestation[e],
          ...docElements.identification.FRBRManifestation[e],
        };
      } else {
        xml.metaDoc.doc.meta.identification.FRBRManifestation[e] = {
          ...docElements.identification.FRBRManifestation[e],
        };
      }
    });
    //////
    ////
    ////Reference
    if (
      !(
        Object.keys(docElements.references).includes('iid') &&
        Object.keys(docElements.references).includes('iidDIDDoc') &&
        Object.keys(docElements.references).includes('iidIssuer')
      )
    ) {
      throw new Error('Needs iid && iidDIDDoc && iidIssuer');
    }
    Object.keys(docElements.references).forEach((r) => {
      if (docElements.references[r].href === undefined)
        throw new Error('Needs href');
      if (docElements.references[r].type === undefined)
        docElements.references[r].type = 'TLCReference';
      if (
        xml.metaDoc.doc.meta.references[docElements.references[r].type] ===
        undefined
      )
        xml.metaDoc.doc.meta.references[docElements.references[r].type] = [];
      const eid =
        docElements.references[r]['@eId'] === undefined
          ? '#' + r
          : docElements.references[r]['@eId'];
      const showAs =
        docElements.references[r]['@showAs'] === undefined
          ? r
          : docElements.references[r]['@showAs'];

      xml.metaDoc.doc.meta.references[docElements.references[r].type].push({
        '@eId': eid,
        '@href': docElements.references[r].href,
        '@showAs': showAs,
      });
    });
    ////
    //
    //preface
    xml.metaDoc.doc.preface.longTitle.p = docElements.prefaceTitle;
    //
    //mainBody
    xml.metaDoc.doc.mainBody['tblock'] = [];
    let iBlock = 1;
    Object.keys(docElements.mainBody).forEach((b) => {
      xml.metaDoc.doc.mainBody['tblock'].push({
        '@eId': `tblock_${iBlock}`,
        heading: {
          '@eId': `tblock_${iBlock}__heading`,
          '#': docElements.mainBody[b].blockTitle,
        },
        p: {
          '@eId': `tblock_${iBlock}__p_${iBlock++}`,
          ...docElements.mainBody[b].p,
        },
      });
    });
    //

    this.metaAndMain = xml;
  }

  /**
   * @description Creates an instance of MetaDoc from a string.
   * @static
   * @param {string} string The string representing a valid XML document.
   * @return {string}
   */
  static fromString(string) {
    const xml = convert(string, { format: 'object' });
    if (!('metaDoc' in xml)) return;
    const temp = new this();

    temp.metaAndMain = xml;
    if (xml.metaDoc.doc.conclusions !== 'undefined') {
      temp.conclusions = xml.metaDoc.doc.conclusions;
      delete temp.metaAndMain.metaDoc.doc.conclusions;
    }

    return temp;
  }

  /**
   * @description Adds a signature to the XML document.
   * @param {string} eId The eId of the signatory
   * @param {string} did The did of the signatory
   * @param {string} timestamp The timestamp to add
   * @param {string} signature The signature to add
   */
  addSignature(eId, did, timestamp, signature) {
    if (Object.keys(this.conclusions).length == 0)
      this.conclusions = JSON.parse(
        JSON.stringify(utils.templates.conclTemplate.conclusions)
      );

    this.conclusions.signature.push({
      iidSignatory: {
        '#': {
          entity: {
            '@eId': `signature_${eId.slice(1)}_iidSignatory`,
            '@refersTo': eId,
            '#': did,
          },
        },
      },
      digitalSignature: {
        '#': {
          entity: {
            '@eId': `signature_${eId.slice(1)}_digitalSignature`,
            '#': signature,
          },
        },
      },
      timestamp: {
        '@eId': `signature_${eId.slice(1)}_timestamp`,
        '@date': timestamp,
        '#': timestamp,
      },
    });
  }

  /**
   * @description Adds a software signature to the XML document.
   * @param {string} eId The eId of the software
   * @param {string} name The name of the software
   * @param {string} signature The signature to add
   */
  addSwSignature(eId, name, signature) {
    if (Object.keys(this.conclusions).length == 0)
      this.conclusions = JSON.parse(
        JSON.stringify(utils.templates.conclTemplate.conclusions)
      );

    this.conclusions.signature.push({
      object: {
        '@eId': `conclusion_signature_${eId.slice(1)}_sw`,
        '@refersTo': eId,
        '#': name,
      },
      digitalSignature: {
        '@eId': `conclusion_signature_${eId.slice(1)}_sw_signature`,
        '#': signature,
      },
    });
  }

  /**
   * @description Returns the value of a node with eid attribute equal to eId
   * @return {string} The value or undefined
   */
  findValueByEId(eId) {
    if (Object.keys(this.metaAndMain).length === 0) return;
    const xml = JSON.parse(JSON.stringify(this.metaAndMain));
    if (Object.keys(this.conclusions).length !== 0)
      xml.metaDoc.doc.conclusions = { ...this.conclusions };

    return this.create(xml).find(
      (n) => {
        var found = false;
        if (n.node.attributes !== undefined) {
          n.node.attributes.forEach((kl) => {
            if (kl.nodeName === 'eId') if (kl.nodeValue === eId) found = true;
          });
          return found;
        }
      },
      false,
      true
    );
  }

  /**
   * @description Finalizes the XML document by returning the string that
   * represents the XML document, omitting the conclusions part.
   * (Usually used for the signature payload).
   * @return {string} The XML document string representation
   */
  finalizeNoConclusions() {
    if (Object.keys(this.metaAndMain).length === 0) return;
    const xml = JSON.parse(JSON.stringify(this.metaAndMain));

    const final = this.create(xml);
    return final.end({ prettyPrint: true });
  }

  /**
   * @description Finalizes the XML document by returning the string that
   * represents the XML document
   * @return {string} The XML document string representation
   */
  finalize() {
    if (Object.keys(this.metaAndMain).length === 0) return;
    const xml = JSON.parse(JSON.stringify(this.metaAndMain));
    if (Object.keys(this.conclusions).length !== 0)
      xml.metaDoc.doc.conclusions = { ...this.conclusions };

    const final = this.create(xml);
    return final.end({ prettyPrint: true });
  }
}

module.exports = { MetaDoc };
