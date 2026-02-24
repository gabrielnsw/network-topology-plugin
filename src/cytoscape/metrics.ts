import cytoscape from 'cytoscape';
import { ZabbixHost } from '../types';
import { NODE_SIZES } from '../constants';

/**
 * Formats a raw bit per second integer into a readable string scale (Kbps, Mbps, Gbps).
 *
 * @param bps - The raw traffic volume measured in bits per second.
 * @returns A formatted string containing the highest possible scale (e.g., "12.50 Mbps").
 */
export const formatTraffic = (bps: number): string => {
  if (bps === 0) return '0 bps';
  const units = ['bps', 'Kbps', 'Mbps', 'Gbps'];
  let i = 0;
  let val = bps;
  while (val >= 1000 && i < units.length - 1) {
    val /= 1000;
    i++;
  }
  return `${val.toFixed(2)} ${units[i]}`;
};

/**
 * Evaluates the Zabbix API payload and applies the status metrics (loss, latency, throughput)
 * directly into the Cytoscape graph nodes and edges via data properties. Also responsible
 * for translating edge color constraints dynamically.
 *
 * @param cy - The initialized Cytoscape core instance holding the active graph topology.
 * @param zabbixMetrics - A dictionary mapped by Node IDs containing their live query metrics.
 * @param t - The i18n translation hook used for appending multilingual 'No Data' labels etc.
 */
export const refreshMetricsCore = (
  cy: cytoscape.Core,
  zabbixMetrics: Record<string, ZabbixHost>,
  t: (key: string) => string
) => {
  cy.nodes().forEach((node) => {
    const id = node.id();
    const h = (zabbixMetrics || {})[id];
    if (h) {
      let loss = Number(h.loss) || 0;
      let ping = Number(h.ping) || 0;
      let latency = h.latency;

      const customLossItem = node.data('customLossItem');
      const customPingItem = node.data('customPingItem');
      const customLatencyItem = node.data('customLatencyItem');

      if (customLossItem && h.items && h.items[customLossItem] !== undefined) {
        loss = Number(h.items[customLossItem]) || 0;
      }
      if (customPingItem && h.items && h.items[customPingItem] !== undefined) {
        ping = Number(h.items[customPingItem]) || 0;
      }
      if (customLatencyItem && h.items && h.items[customLatencyItem] !== undefined) {
        let rawLatency = h.items[customLatencyItem];
        latency = `${rawLatency} ms`;
      }

      let color = '#10b981';
      if (loss >= 100 || ping === 0) {
        color = '#ef4444';
      } else if (loss > 1) {
        color = '#f97316';
      }
      node.data('statusColor', color);
      const hostName = node.data('alias') || h.name || id;
      const lblLatency = t('latency') || 'Latência';
      const lblLoss = t('loss') || 'Perda';
      node.data('label', `${hostName}\n\n${lblLatency}: ${latency}\n${lblLoss}: ${loss}%`);
      const sz = NODE_SIZES[node.data('nodeSize') || 'medium'];
      node.data('nodeWidth', sz.w);
      node.data('nodeHeight', sz.h);
      node.data('iconH', sz.iconScale);
    } else {
      if (node.hasClass('anchor')) return;
      node.data('statusColor', '#4b5563');
      const hostName = node.data('alias') || id;
      node.data('label', `${hostName}\n\n${t('noData')}`);
      const sz = NODE_SIZES[node.data('nodeSize') || 'medium'];
      node.data('nodeWidth', sz.w);
      node.data('nodeHeight', sz.h);
      node.data('iconH', sz.iconScale);
    }
  });

  cy.edges().forEach((edge) => {
    const d = edge.data();
    const metrics = d.eMetrics || [];
    let edgeColor = d.eColor || '#4b5563';
    edge.data('eColor', edgeColor);
    edge.data('eStyle', d.eStyle || 'solid');
    edge.data('eWidth', Number(d.eWidth) || 2.5);

    if (d.eMonitored && d.eMainDevice && d.eInterface) {
      const h = (zabbixMetrics || {})[d.eMainDevice];
      if (h && h.interfaces && h.interfaces[d.eInterface]) {
        const iData = h.interfaces[d.eInterface];
        let txt = '';
        let hasBits = false;
        let bitsValue = 0;

        metrics.forEach((m: any) => {
          if (m.enabled && iData[m.name]) {
            if (m.name.toLowerCase().includes('bits')) {
              hasBits = true;
              if (Number(iData[m.name].value) > bitsValue) {
                bitsValue = Number(iData[m.name].value);
              }
            }

            if (!edge.target().hasClass('anchor')) {
              const val = iData[m.name].value;
              const unit = iData[m.name].units === 'bps' ? 'bps' : iData[m.name].units;
              let displayVal = `${val}`;
              if (unit === 'bps' || m.name.toLowerCase().includes('bits')) {
                displayVal = d.eFormatTraffic !== false ? formatTraffic(Number(val)) : `${val} bps`;
              } else if (unit) {
                displayVal += ` ${unit}`;
              }
              if (!displayVal.includes('!ms')) {
                txt += `${m.icon} ${displayVal}\n`;
              } else {
                txt += `${m.icon} ${displayVal.replace('!ms', 'ms')}\n`;
              }
            }
          }
        });

        if (hasBits) {
          edgeColor = bitsValue > 0 ? '#10b981' : '#ef4444';
        }

        edge.data('eColor', edgeColor);
        if (edge.source().hasClass('anchor')) edge.source().data('anchorColor', edgeColor);
        if (edge.target().hasClass('anchor')) edge.target().data('anchorColor', edgeColor);

        if (!edge.target().hasClass('anchor')) {
          const finalTxt = txt.trim() ? `${txt.trim()}` : '';
          edge.data('trafficLabel', finalTxt);
        } else {
          edge.data('trafficLabel', '');
        }
      } else {
        if (!edge.target().hasClass('anchor')) {
          edge.data('trafficLabel', '');
        } else {
          edge.data('trafficLabel', '');
        }
        edge.data('eColor', edgeColor);
        if (edge.source().hasClass('anchor')) edge.source().data('anchorColor', edgeColor);
        if (edge.target().hasClass('anchor')) edge.target().data('anchorColor', edgeColor);
      }
    } else {
      edge.data('trafficLabel', '');
      edge.data('eColor', edgeColor);
      if (edge.source().hasClass('anchor')) edge.source().data('anchorColor', edgeColor);
      if (edge.target().hasClass('anchor')) edge.target().data('anchorColor', edgeColor);
    }
  });
};
