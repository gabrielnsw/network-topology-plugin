import cytoscape from 'cytoscape';
import { SVG_ICONS, getIconDataUri } from '../components/icons';

export const cleanElementsForSaving = (cy: cytoscape.Core): any[] => {
  return cy.elements().map((ele) => {
    const d = { ...ele.data() };
    delete d.icon;
    delete d.iconH;
    delete d.label;
    delete d.statusColor;
    delete d.trafficLabel;
    delete d.nodeWidth;
    delete d.nodeHeight;

    return {
      group: ele.isNode() ? 'nodes' : 'edges',
      data: d,
      position: ele.isNode() ? { ...ele.position() } : undefined,
      classes: ele.classes().join(' '),
    };
  });
};

export const restoreIcons = (elements: any[]) => {
  if (!Array.isArray(elements)) {return;}
  elements.forEach((el) => {
    if (el.group === 'nodes' && el.data.iconType && SVG_ICONS[el.data.iconType]) {
      el.data.icon = getIconDataUri(el.data.iconType);
    }
  });
};
