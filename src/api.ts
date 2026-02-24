import { TrafficPoint, ZabbixHost } from './types';
import { DataFrame, FieldType } from '@grafana/data';

const getUnit = (field: any) => field.config?.unit || '';

/**
 * Parses raw Grafana DataFrames containing Zabbix metrics and aggregates them into a structured host map.
 * Extracts interface traffic metadata, ping statistics, and stores raw item values for dynamic UI binding.
 *
 * @param seriesList - The array of DataFrames provided by the Grafana query response.
 * @returns A normalized dictionary of configured Zabbix components indexing core metrics and active network interfaces.
 */
export const parseZabbixDataFrame = (seriesList: DataFrame[]): Record<string, ZabbixHost> => {
  const parsedMetrics: Record<string, ZabbixHost> = {};

  if (!seriesList) {
    return parsedMetrics;
  }

  seriesList.forEach((series: any) => {
    for (const field of series.fields) {
      if (field.type === FieldType.number || (field.type as unknown as string) === 'number') {
        let hostName = field.labels?.host || field.labels?.hostname;
        let item = field.labels?.item;

        let fieldName = field.config?.displayName || field.config?.displayNameFromDS || field.name;

        if (!hostName && fieldName) {
          const parts = fieldName.split(':').map((s: string) => s.trim());
          if (parts.length >= 2) {
            hostName = parts[0];
            item = parts.slice(1).join(': ');
          }
        }

        hostName = hostName || 'Unknown Device';
        item = item || fieldName || 'Unknown Metric';

        if (!parsedMetrics[hostName]) {
          parsedMetrics[hostName] = { name: hostName, ip: '', ping: 1, loss: 0, latency: 0, interfaces: {}, items: {} };
        }

        const vals = field.values.toArray ? field.values.toArray() : field.values;
        let val: any = 0;
        for (let i = vals.length - 1; i >= 0; i--) {
          if (vals[i] != null) {
            val = vals[i];
            break;
          }
        }

        const unit = getUnit(field);
        parsedMetrics[hostName].items[item] = val;

        const itemLower = item.toLowerCase();

        if (itemLower.includes('loss') || itemLower.includes('perda')) {
          parsedMetrics[hostName].loss = val;
        } else if (itemLower.includes('ping') || itemLower.includes('icmp ping')) {
          parsedMetrics[hostName].ping = val;
        } else if (
          itemLower.includes('latency') ||
          itemLower.includes('latência') ||
          itemLower.includes('response time') ||
          itemLower.includes('tempo de resposta')
        ) {
          parsedMetrics[hostName].latency = val;
        }

        let ifaceName = 'Default';
        let metricName = item;

        const ifaceMatch = item.match(/Interface\s+([a-zA-Z0-9\-\.\/]+):\s+(.*)/i);
        if (ifaceMatch) {
          ifaceName = ifaceMatch[1].trim();
          metricName = ifaceMatch[2].trim();
        } else if (item.includes(':')) {
          const parts = item.split(':').map((p: string) => p.trim());
          ifaceName = parts[0];
          metricName = parts.slice(1).join(': ');
        }

        if (!parsedMetrics[hostName].interfaces[ifaceName]) {
          parsedMetrics[hostName].interfaces[ifaceName] = {};
        }

        parsedMetrics[hostName].interfaces[ifaceName][metricName] = {
          value: val,
          units: unit === 'bps' ? 'bps' : unit,
          itemid: '',
        };
      }
    }
  });

  if (Object.keys(parsedMetrics).length > 0 && parsedMetrics['Unknown Device']) {
    if (Object.keys(parsedMetrics['Unknown Device'].interfaces).length === 0) {
      delete parsedMetrics['Unknown Device'];
    }
  }

  return parsedMetrics;
};

/**
 * Isolates and chronologically compiles high-resolution traffic point histories from raw DataFrames
 * mapping exclusively to designated Host/Interface boundaries for chart rendering implementations.
 *
 * @param seriesList - The full dataset payload from Grafana backend.
 * @param hostName - The target Zabbix host alias bound to the query block.
 * @param iface - The specific network interface to filter inbound/outbound histories against.
 * @returns Array of sorted metric frames aggregating time intervals mapped tightly to TX/RX values.
 */
export const extractTrafficHistory = (seriesList: DataFrame[], hostName: string, iface: string): TrafficPoint[] => {
  if (!seriesList) {
    return [];
  }

  const trafficPointsMap: Record<number, any> = {};

  seriesList.forEach((series: any) => {
    let timeField: any = null;

    for (const field of series.fields) {
      if (field.type === FieldType.time || (field.type as unknown as string) === 'time') {
        timeField = field;
        break;
      }
    }

    if (!timeField) {
      return;
    }

    for (const field of series.fields) {
      if (field.type === FieldType.number || (field.type as unknown as string) === 'number') {
        let sHostName = field.labels?.host || field.labels?.hostname;
        let sItem = field.labels?.item;
        let fieldName = field.config?.displayName || field.config?.displayNameFromDS || field.name;

        if (!sHostName && fieldName) {
          const parts = fieldName.split(':').map((s: string) => s.trim());
          if (parts.length >= 2) {
            sHostName = parts[0];
            sItem = parts.slice(1).join(': ');
          }
        }

        sHostName = sHostName || 'Unknown Device';
        sItem = sItem || fieldName || 'Unknown Metric';

        if (sHostName !== hostName || !sItem) {
          continue;
        }
        if (!sItem.includes(iface)) {
          continue;
        }

        const itemLower = sItem.toLowerCase();
        const isRx = itemLower.includes('recebid') || itemLower.includes('in') || itemLower.includes('received');
        const isTx = itemLower.includes('enviad') || itemLower.includes('out') || itemLower.includes('sent');

        if (!isRx && !isTx) {
          continue;
        }

        const tVals = timeField.values.toArray ? timeField.values.toArray() : timeField.values;
        const vVals = field.values.toArray ? field.values.toArray() : field.values;

        const len = Math.min(tVals.length, vVals.length);
        for (let i = 0; i < len; i++) {
          const t = tVals[i];
          const v = vVals[i];
          if (t != null && v != null) {
            if (!trafficPointsMap[t]) {
              trafficPointsMap[t] = { clock: t, tx: 0, rx: 0 };
            }
            if (isRx) {
              trafficPointsMap[t].rx = v;
            }
            if (isTx) {
              trafficPointsMap[t].tx = v;
            }
          }
        }
      }
    }
  });

  return Object.values(trafficPointsMap).sort((a: any, b: any) => a.clock - b.clock);
};
