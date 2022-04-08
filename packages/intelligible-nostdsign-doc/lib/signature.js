const { create, convert } = require('xmlbuilder2');

/**
 * @description Wraps an XML document into a class. Allows to export an
 * XML signature document (not standard) to a string and to import a new
 * one from a string,
 */
class NoStandardSignatureDoc {
  /**
   * @description Creates an instance of NoStandardSignatureDoc.
   */
  constructor() {
    this.main = {
      NoStandardSignatureDoc: {
        signature: [],
      },
    };
    this.create = create;
  }

  /**
   * @description Creates an instance of NoStandardSignatureDoc from a string.
   * @static
   * @param {string} string The string representing a valid XML document.
   * @return {string}
   */
  static fromString(string) {
    const xml = convert(string, { format: 'object' });
    if (!('NoStandardSignatureDoc' in xml)) return;
    const temp = new this();

    temp.main = xml;
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
    this.main.NoStandardSignatureDoc.signature.push({
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
   * @description Returns the value of a node with eid attribute equal to eId
   * @return {string} The value or undefined
   */
  findValueByEId(eId) {
    if (this.main.NoStandardSignatureDoc.signature === 0) return;
    const xml = JSON.parse(JSON.stringify(this.main));

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
   * represents the XML document.
   * @return {string} The XML document string representation
   */
  finalize() {
    if (this.main.NoStandardSignatureDoc.signature === 0) return;
    const xml = JSON.parse(JSON.stringify(this.main));

    const final = this.create(xml);
    return final.end({ prettyPrint: true });
  }
}

module.exports = { NoStandardSignatureDoc };
