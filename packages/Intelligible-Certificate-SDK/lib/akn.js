const { AKNWrapper, utils } = require('@intelligiblesuite/wrappers');

class CertificateAKN extends AKNWrapper {
  constructor(certificateElements) {
    super();

    this.newCertificateAKNDocument(certificateElements);
  }

  static aknUriFrom(name) {
    return `/akn/eu/intelligibleCertificate/document/${name}/decentralizedCertificate/nonFungible.akn`;
  }

  newCertificateAKNDocument(certificateElements) {
    const xml = JSON.parse(JSON.stringify(utils.templates.metaAndMainTemplate));
    //meta
    ////Identification
    //////FRBRWork
    Object.keys(certificateElements.identification.FRBRWork).forEach((e) => {
      if (e in xml.akomaNtoso.doc.meta.identification.FRBRWork) {
        xml.akomaNtoso.doc.meta.identification.FRBRWork[e] = {
          ...xml.akomaNtoso.doc.meta.identification.FRBRWork[e],
          ...certificateElements.identification.FRBRWork[e],
        };
      } else {
        xml.akomaNtoso.doc.meta.identification.FRBRWork[e] = {
          ...certificateElements.identification.FRBRWork[e],
        };
      }
    });
    //////
    //////FRBRExpression
    Object.keys(certificateElements.identification.FRBRExpression).forEach(
      (e) => {
        if (e in xml.akomaNtoso.doc.meta.identification.FRBRExpression) {
          xml.akomaNtoso.doc.meta.identification.FRBRExpression[e] = {
            ...xml.akomaNtoso.doc.meta.identification.FRBRExpression[e],
            ...certificateElements.identification.FRBRExpression[e],
          };
        } else {
          xml.akomaNtoso.doc.meta.identification.FRBRExpression[e] = {
            ...certificateElements.identification.FRBRExpression[e],
          };
        }
      }
    );
    //////
    //////FRBRManifestation
    Object.keys(certificateElements.identification.FRBRManifestation).forEach(
      (e) => {
        if (e in xml.akomaNtoso.doc.meta.identification.FRBRManifestation) {
          xml.akomaNtoso.doc.meta.identification.FRBRManifestation[e] = {
            ...xml.akomaNtoso.doc.meta.identification.FRBRManifestation[e],
            ...certificateElements.identification.FRBRManifestation[e],
          };
        } else {
          xml.akomaNtoso.doc.meta.identification.FRBRManifestation[e] = {
            ...certificateElements.identification.FRBRManifestation[e],
          };
        }
      }
    );
    //////
    ////
    ////Reference
    Object.keys(certificateElements.references).forEach((r) => {
      if (
        xml.akomaNtoso.doc.meta.references[
          certificateElements.references[r].type
        ] === undefined
      )
        xml.akomaNtoso.doc.meta.references[
          certificateElements.references[r].type
        ] = [];
      console.log(certificateElements.references[r].type);
      xml.akomaNtoso.doc.meta.references[
        certificateElements.references[r].type
      ].push({
        '@eId': certificateElements.references[r]['@eId'],
        '@href': certificateElements.references[r]['@href'],
        '@showAs': certificateElements.references[r]['@showAs'],
      });
    });
    ////
    //
    //preface
    xml.akomaNtoso.doc.preface.longTitle.p = certificateElements.prefaceTitle;
    //
    //mainBody
    xml.akomaNtoso.doc.mainBody['tblock'] = [];
    let iBlock = 0;
    Object.keys(certificateElements.mainBody).forEach((b) => {
      xml.akomaNtoso.doc.mainBody['tblock'].push({
        '@eId': `tblock_${iBlock}`,
        heading: {
          '@eId': `tblock_${iBlock}__heading`,
          '#': certificateElements.mainBody[b].blockTitle,
        },
        p: {
          '@eId': `tblock_${iBlock}__p_${iBlock++}`,
          ...certificateElements.mainBody[b].p,
        },
      });
    });
    //

    this.metaAndMain = xml;
  }
}

module.exports = { CertificateAKN };
