/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Insert, Remove, Update } from '@openscd/open-scd-core';

import { getReference } from './scldata.js';

type TrgOpsAttributes = {
  dchg?: string | null;
  qchg?: string | null;
  dupd?: string | null;
  period?: string | null;
  gi?: string | null;
};

type OptFieldsAttributes = {
  seqNum?: string | null;
  timeStamp?: string | null;
  reasonCode?: string | null;
  dataRef?: string | null;
  entryID?: string | null;
  configRef?: string | null;
  bufOvfl?: string | null;
};

function createElement(
  doc: XMLDocument,
  tag: string,
  attrs: Record<string, string | null>
): Element {
  const element = doc.createElementNS(doc.documentElement.namespaceURI, tag);
  Object.entries(attrs)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value !== null)
    .forEach(([name, value]) => element.setAttribute(name, value!));
  return element;
}

/** @returns action array to update all `OptFields` attributes */
export function updateOptFields(
  optFields: Element,
  attributes: OptFieldsAttributes
): Update {
  return { element: optFields, attributes };
}

/** @returns action array to update all `TrgOps` attributes */
export function updateTrgOps(
  trgOps: Element,
  attributes: TrgOpsAttributes
): Update {
  return { element: trgOps, attributes };
}

/** @returns action to update max clients in ReportControl element */
export function updateMaxClients(
  reportControl: Element,
  max: string | null
): Remove | Update | Insert | null {
  const rptEnabled = reportControl.querySelector(':scope > RptEnabled');

  if (rptEnabled && !max) return { node: rptEnabled };
  if (!rptEnabled && !max) return null;
  if (!rptEnabled && max) {
    const newRptEnabled = createElement(
      reportControl.ownerDocument,
      'RptEnabled',
      { max }
    );

    return {
      parent: reportControl,
      node: newRptEnabled,
      reference: getReference(reportControl, 'RptEnabled'),
    };
  }

  return { element: rptEnabled!, attributes: { max } };
}
