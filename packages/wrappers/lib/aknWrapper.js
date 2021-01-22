const { create, convert } = require('xmlbuilder2');
const utils = require('./templates');

class AKNWrapper {
  constructor() {
    this.metaAndMain = {};
    this.conclusions = {};

    this.create = create;
  }

  static fromString(document) {
    const xml = convert(document, { format: 'object' });
    if (!('akomaNtoso' in xml)) return;
    const temp = new AKNWrapper();

    temp.metaAndMain = xml;
    if (xml.akomaNtoso.doc.conclusions !== 'undefined') {
      temp.conclusions = xml.akomaNtoso.doc.conclusions;
      delete temp.metaAndMain.akomaNtoso.doc.conclusions;
    }

    return temp;
  }

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

  finalizeNoConclusions() {
    if (Object.keys(this.metaAndMain).length === 0) return;
    const xml = JSON.parse(JSON.stringify(this.metaAndMain));

    const final = this.create(xml);
    return final.end({ prettyPrint: true });
  }

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
