const { create, convert } = require('xmlbuilder2');
const utils = require('./templates');

/**
 * @description Wraps an Akoma Ntoso (AKN) document into a class. Allows to export an
 * AKN document to a string and to import a new one from a string,
 */
class AKNWrapper {
  /**
   * @description Creates an instance of AKNWrapper.
   */
  constructor() {
    this.metaAndMain = {};
    this.conclusions = {};

    this.create = create;
  }

  /**
   * @description Creates an instance of AKNWrapper from a string.
   * @static
   * @param {string} string The string representing a valid AKN document.
   * @return {string}
   */
  static fromString(string) {
    const xml = convert(string, { format: 'object' });
    if (!('akomaNtoso' in xml)) return;
    const temp = new AKNWrapper();

    temp.metaAndMain = xml;
    if (xml.akomaNtoso.doc.conclusions !== 'undefined') {
      temp.conclusions = xml.akomaNtoso.doc.conclusions;
      delete temp.metaAndMain.akomaNtoso.doc.conclusions;
    }

    return temp;
  }

  /**
   * @description Adds a signature to the AKN document.
   * @param {string} signature The signature to add
   * @param {string} id The id of the signature
   */
  addSignature(signature, id) {
    if (Object.keys(this.conclusions).length === 0) {
      this.conclusions = JSON.parse(
        JSON.stringify(utils.templates.conclTemplate)
      ).conclusions;
    }

    this.conclusions.signatures[id] = {
      '@eId': 'conclusions__signatures_1_' + id,
      '#': signature,
    };
  }

  /**
   * @description Finalizes the AKN document by returning the string that
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
   * @description Finalizes the AKN document by returning the string that
   * represents the XML document
   * @return {string} The XML document string representation
   */
  finalize() {
    if (Object.keys(this.metaAndMain).length === 0) return;
    const xml = JSON.parse(JSON.stringify(this.metaAndMain));
    if (Object.keys(this.conclusions).length !== 0) {
      xml.akomaNtoso.doc.conclusions = JSON.parse(
        JSON.stringify(this.conclusions)
      );
    }

    const final = this.create(xml);
    return final.end({ prettyPrint: true });
  }
}

module.exports = { AKNWrapper };
