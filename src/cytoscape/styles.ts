export const getBaseStyle = (themeSettings: any, ICON_KEYS: string[]): any[] => {
  return [
    {
      selector: 'node',
      style: {
        shape: 'roundrectangle',
        'background-color': 'transparent',
        'background-image': 'data(icon)',
        'background-fit': 'contain',
        'background-clip': 'none',
        'bounds-expansion': '0px',
        width: 'data(nodeWidth)',
        height: 'data(nodeHeight)',
        'border-width': 2,
        'border-color': 'data(statusColor)',
        label: 'data(label)',
        color: '#d1d5db',
        'font-size': '11px',
        'font-weight': '600',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 8,
        'text-wrap': 'wrap',
        'text-max-width': '120px',
        'font-family': 'Inter, sans-serif',
      },
    },
    ...ICON_KEYS.map(
      (k) =>
        ({
          selector: `node[iconType="${k}"]`,
          style: { 'background-image': 'data(icon)' },
        })
    ),
    {
      selector: 'node.selected',
      style: {
        'border-width': 3,
        'border-color': '#60a5fa',
        'box-shadow': '0 0 15px #3b82f6',
      },
    },
    {
      selector: 'edge',
      style: {
        'text-wrap': 'wrap',
        width: 'data(eWidth)',
        'line-color': 'data(eColor)',
        'line-style': 'data(eStyle)' as any,
        'curve-style': 'bezier',
        label: 'data(trafficLabel)',
        'font-size': '10px',
        color: '#ffffff',
        'text-background-color': '#2563eb',
        'text-background-opacity': 1,
        'text-background-padding': '4px',
        'text-background-shape': 'round-rectangle',
        'text-rotation': 'autorotate',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': 'data(eColor)',
        'arrow-scale': 1.2,
      },
    },
    {
      selector: 'edge[target *= "anchor"]',
      style: {
        'target-arrow-shape': 'none',
      },
    },
    {
      selector: 'edge.selected',
      style: {
        'line-color': '#60a5fa',
        'target-arrow-color': '#60a5fa',
        width: 4,
      },
    },
    {
      selector: 'edge.hover',
      style: {
        'line-color': '#fcd34d',
        'target-arrow-color': '#fcd34d',
        width: 4,
      },
    },
    {
      selector: 'edge.temp',
      style: {
        'line-color': '#3b82f6',
        'line-style': 'dashed',
        width: 3,
        'target-arrow-shape': 'none',
      },
    },
    {
      selector: 'node.anchor',
      style: {
        width: 12,
        height: 12,
        'background-color': '#111827',
        'border-width': 2,
        'border-color': (ele: any) => ele.data('anchorColor') || '#3b82f6',
        'background-image': 'none',
      },
    },
    {
      selector: 'node.anchor.selected',
      style: {
        'background-color': '#3b82f6',
        width: 12,
        height: 12,
      },
    },
  ];
};
