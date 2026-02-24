import React, { useState, useEffect } from 'react';
import { ZabbixHost, TrafficPoint, InfoModalData } from '../../types';
import { extractTrafficHistory } from '../../api';
import { DataFrame } from '@grafana/data';

interface InfoModalProps {
  infoModal: InfoModalData;
  cyRef: React.MutableRefObject<any>;
  zabbixMetrics: Record<string, ZabbixHost>;
  dataSeries: DataFrame[];
  onClose: () => void;
  t: (key: string) => string;
}

export const InfoModal: React.FC<InfoModalProps> = ({ infoModal, cyRef, zabbixMetrics, dataSeries, onClose, t }) => {
  const [trafficHistory, setTrafficHistory] = useState<TrafficPoint[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (infoModal.visible && infoModal.type === 'edge') {
      const cy = cyRef.current;
      if (!cy) return;
      const tEdge = cy.getElementById(infoModal.targetId);
      if (tEdge && tEdge.length) {
        const d = tEdge.data();
        if (d.eMonitored && d.eMainDevice && d.eInterface) {
          setLoadingHistory(true);
          const history = extractTrafficHistory(dataSeries, d.eMainDevice, d.eInterface);
          setTrafficHistory(history || []);
          setLoadingHistory(false);
        } else {
          setTrafficHistory([]);
        }
      }
    }
  }, [infoModal.visible, infoModal.type, infoModal.targetId, cyRef, dataSeries]);

  if (!infoModal.visible) return null;

  const renderContent = () => {
    const cy = cyRef.current;
    if (!cy) return null;

    if (infoModal.type === 'node') {
      const node = cy.getElementById(infoModal.targetId);
      if (!node.length) return null;
      const id = node.id();
      const metric = zabbixMetrics[id];

      return (
        <div style={{ marginBottom: 20, fontSize: '13px', color: '#d1d5db' }}>
          <p>
            <strong style={{ color: '#9ca3af' }}>{t('name')}:</strong> {metric?.name || id}
          </p>
          <p>
            <strong style={{ color: '#9ca3af' }}>{t('ip')}:</strong>{' '}
            {metric?.ip || (metric?.interfaces && Object.keys(metric.interfaces)[0]) || 'N/A'}
          </p>
          <p>
            <strong style={{ color: '#9ca3af' }}>{t('ping')}:</strong>{' '}
            {metric?.ping !== undefined ? `${metric.ping} ms` : 'N/A'}
          </p>
          <p>
            <strong style={{ color: '#9ca3af' }}>{t('loss')}:</strong>{' '}
            {metric?.loss !== undefined ? `${metric.loss}%` : 'N/A'}
          </p>
        </div>
      );
    } else {
      const edge = cy.getElementById(infoModal.targetId);
      if (!edge.length) return null;
      const d = edge.data();

      let historyMax = 0;
      if (trafficHistory.length > 0) {
        historyMax = Math.max(...trafficHistory.map((pt) => Math.max(pt.tx, pt.rx)));
        if (historyMax === 0) historyMax = 1;
      }

      const resolveNode = (startNodeId: string, currentEdgeId: string): string => {
        let currNodeId = startNodeId;
        let prevEdgeId = currentEdgeId;
        let safeCounter = 0;
        while (currNodeId.includes('anchor') && safeCounter < 20) {
          safeCounter++;
          const aNode = cy.getElementById(currNodeId);
          if (!aNode.length) break;
          const edges = aNode.connectedEdges();
          const nextEdge = edges.find((e: any) => e.id() !== prevEdgeId);
          if (!nextEdge) break;
          const s = nextEdge.data('source');
          const t = nextEdge.data('target');
          currNodeId = s === currNodeId ? t : s;
          prevEdgeId = nextEdge.id();
        }
        return currNodeId;
      };

      const realSource = resolveNode(d.source, edge.id());
      const realTarget = resolveNode(d.target, edge.id());

      const getHostName = (nodeId: string) => {
        const n = cy.getElementById(nodeId);
        if (n && n.length) {
          return n.data('alias') || n.data('label')?.split('\n')[0] || nodeId;
        }
        return nodeId;
      };

      const sourceName = getHostName(realSource);
      const targetName = getHostName(realTarget);

      return (
        <div style={{ marginBottom: 20, fontSize: '13px', color: '#d1d5db' }}>
          <p>
            <strong style={{ color: '#9ca3af' }}>{t('origin')}:</strong> {sourceName}
          </p>
          <p>
            <strong style={{ color: '#9ca3af' }}>{t('destination')}:</strong> {targetName}
          </p>
          {d.eMonitored ? (
            <p>
              <strong style={{ color: '#9ca3af' }}>{t('monitoredIface')}:</strong> {d.eInterface} ({t('onHost')}{' '}
              {d.eMainDevice})
            </p>
          ) : (
            <p style={{ fontStyle: 'italic', color: '#6b7280' }}>{t('unmonitoredConn')}</p>
          )}

          {d.eMonitored && trafficHistory.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <strong style={{ color: '#9ca3af', display: 'block', marginBottom: 10 }}>
                {t('trafficHistory')} <span style={{ fontSize: 10, fontWeight: 'normal' }}>({t('last30')})</span>
              </strong>
              <div
                style={{
                  height: 120,
                  background: '#111827',
                  borderRadius: 6,
                  border: '1px solid #374151',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ width: '100%', height: '100%', display: 'block' }}
                >
                  {/* Grid / Guidelines */}
                  <line x1="0" y1="25" x2="100" y2="25" stroke="#374151" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#374151" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="75" x2="100" y2="75" stroke="#374151" strokeWidth="0.5" strokeDasharray="2,2" />

                  {/* TX Polygon Fill */}
                  <polygon
                    fill="rgba(59, 130, 246, 0.1)"
                    points={`0,100 ${trafficHistory.map((pt, i) => `${(i / Math.max(1, trafficHistory.length - 1)) * 100},${100 - (pt.tx / historyMax) * 100}`).join(' ')} 100,100`}
                  />
                  {/* RX Polygon Fill */}
                  <polygon
                    fill="rgba(16, 185, 129, 0.1)"
                    points={`0,100 ${trafficHistory.map((pt, i) => `${(i / Math.max(1, trafficHistory.length - 1)) * 100},${100 - (pt.rx / historyMax) * 100}`).join(' ')} 100,100`}
                  />

                  {/* TX Line */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    points={trafficHistory
                      .map(
                        (pt, i) =>
                          `${(i / Math.max(1, trafficHistory.length - 1)) * 100},${100 - (pt.tx / historyMax) * 100}`
                      )
                      .join(' ')}
                  />
                  {/* RX Line */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    points={trafficHistory
                      .map(
                        (pt, i) =>
                          `${(i / Math.max(1, trafficHistory.length - 1)) * 100},${100 - (pt.rx / historyMax) * 100}`
                      )
                      .join(' ')}
                  />
                </svg>
              </div>
              <div style={{ display: 'flex', gap: 15, marginTop: 8, fontSize: 11, justifyContent: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 10, height: 10, background: '#3b82f6' }}></div> TX
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 10, height: 10, background: '#10b981' }}></div> RX
                </span>
                <span style={{ color: '#6b7280', marginLeft: 'auto' }}>
                  {t('max')}: {(historyMax / 1000000).toFixed(1)} Mbps
                </span>
              </div>
            </div>
          )}
          {d.eMonitored && trafficHistory.length === 0 && !loadingHistory && (
            <p style={{ marginTop: 20, fontStyle: 'italic', color: '#6b7280' }}>{t('noHistory')}</p>
          )}
          {loadingHistory && <p style={{ marginTop: 20, color: '#fcd34d' }}>{t('loading')}</p>}
        </div>
      );
    }
  };

  return (
    <div className="noc-modal-overlay">
      <div className="noc-modal-content" style={{ width: 450 }}>
        <h3 className="noc-modal-title">
          {t('details')} ({infoModal.type === 'node' ? t('equipment') : t('connection')})
        </h3>
        {renderContent()}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
          <button className="noc-mod-btn cancel" onClick={onClose} title={t('close')} style={{ padding: '8px 12px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
