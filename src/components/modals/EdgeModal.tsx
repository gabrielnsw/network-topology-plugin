import React, { useState, useMemo, useEffect } from 'react';
import { ZabbixHost, EdgeMetric } from '../../types';
import { EDGE_WIDTH_LABELS, EDGE_STYLE_LABELS } from '../../constants';

interface EdgeModalProps {
  visible: boolean;
  edgeData: any;
  zabbixMetrics: Record<string, ZabbixHost>;
  onClose: () => void;
  onSave: (data: any) => void;
  t: (key: string) => string;
}

export const EdgeModal: React.FC<EdgeModalProps> = ({
  visible, edgeData, zabbixMetrics, onClose, onSave, t
}) => {
  const [eMainDevice, setEMainDevice] = useState('');
  const [eInterface, setEInterface] = useState('');
  const [eMonitored, setEMonitored] = useState(false);
  const [eWidth, setEWidth] = useState('2.5');
  const [eStyle, setEStyle] = useState('solid');
  const [eMetrics, setEMetrics] = useState<EdgeMetric[]>([]);
  const [eFormatTraffic, setEFormatTraffic] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (visible && edgeData) {
      setEMainDevice(edgeData.eMainDevice || '');
      setEInterface(edgeData.eInterface || '');
      setEMonitored(edgeData.eMonitored || false);
      setEWidth(String(edgeData.eWidth || '2.5'));
      setEStyle(edgeData.eStyle || 'solid');
      setEMetrics(edgeData.eMetrics || []);
      setEFormatTraffic(edgeData.eFormatTraffic !== false);
      setOpenDropdown(null);
    }
  }, [visible, edgeData]);

  const sourceNodeId = edgeData?.source;
  const targetNodeId = edgeData?.target;

  const availableIfaces = useMemo(() => {
    if (!eMonitored || !eMainDevice) return [];
    const h = (zabbixMetrics || {})[eMainDevice];
    if (!h || !h.interfaces) return [];
    return Object.keys(h.interfaces).sort();
  }, [eMonitored, eMainDevice, zabbixMetrics]);

  useEffect(() => {
    if (eMonitored && eMainDevice && eInterface) {
      const h = (zabbixMetrics || {})[eMainDevice];
      if (h && h.interfaces && h.interfaces[eInterface]) {
        const iData = h.interfaces[eInterface];
        const allItemNames = Object.keys(iData).filter((k) => k !== 'Status operacional' && k !== 'Tipo de interface');
        const defaultMetrics = [
          { name: 'Bits recebidos', icon: '⬇️', enabled: true },
          { name: 'Bits enviados', icon: '⬆️', enabled: true },
        ];
        const newMetrics = allItemNames.map((n) => {
          const existing = eMetrics.find((m) => m.name === n);
          if (existing) return existing;
          const def = defaultMetrics.find((d) => d.name === n);
          if (def) return def;
          return { name: n, icon: '📊', enabled: false };
        });
        if (JSON.stringify(newMetrics) !== JSON.stringify(eMetrics)) {
          setEMetrics(newMetrics);
        }
      }
    }
  }, [eMonitored, eMainDevice, eInterface, zabbixMetrics, eMetrics]);

  if (!visible) return null;

  return (
    <div className="noc-modal-overlay" onClick={() => setOpenDropdown(null)}>
      <div className="noc-modal-content" style={{ width: 500 }} onClick={(e: any) => e.stopPropagation()}>
        <h3 className="noc-modal-title">{t('edgeConfig')}</h3>
        <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 20 }}>
          De <strong>{sourceNodeId}</strong> para <strong>{targetNodeId}</strong>
        </p>

        <div className="noc-field-group">
          <label className="noc-field-label">
            <input
              type="checkbox"
              checked={eMonitored}
              onChange={(e: any) => setEMonitored(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Link Monitorado via Zabbix?
          </label>
        </div>

        {eMonitored && (
          <div className="noc-field-group" style={{ marginBottom: 15 }}>
            <label className="noc-field-label">
              <input
                type="checkbox"
                checked={eFormatTraffic}
                onChange={(e: any) => setEFormatTraffic(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              {t('formatBits') || 'Formatar Bitrate (Kbps/Mbps/Gbps)?'}
            </label>
          </div>
        )}

        {eMonitored && (
          <div style={{ background: '#111827', padding: 15, borderRadius: 8, marginBottom: 15 }}>
            <div className="noc-field-group">
              <label className="noc-field-label">{t('mainDevice')}</label>
              <div className={`noc-custom-select ${openDropdown === 'mainDevice' ? 'open' : ''}`}>
                <div
                  className="noc-cs-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === 'mainDevice' ? null : 'mainDevice');
                  }}
                >
                  <span>
                    {eMainDevice ? (zabbixMetrics?.[eMainDevice]?.name || eMainDevice) : t('selectDevice')}
                  </span>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                {openDropdown === 'mainDevice' && (
                  <div className="noc-cs-dropdown">
                    <ul className="noc-cs-options">
                      <li
                        onClick={() => {
                          setEMainDevice('');
                          setEInterface('');
                          setEMetrics([]);
                          setOpenDropdown(null);
                        }}
                        style={{ fontStyle: 'italic', opacity: 0.7 }}
                      >
                        {t('selectDevice')}
                      </li>
                      {sourceNodeId && (
                        <li
                          onClick={() => {
                            setEMainDevice(sourceNodeId);
                            setEInterface('');
                            setEMetrics([]);
                            setOpenDropdown(null);
                          }}
                        >
                          {zabbixMetrics?.[sourceNodeId]?.name || sourceNodeId}
                        </li>
                      )}
                      {targetNodeId && (
                        <li
                          onClick={() => {
                            setEMainDevice(targetNodeId);
                            setEInterface('');
                            setEMetrics([]);
                            setOpenDropdown(null);
                          }}
                        >
                          {zabbixMetrics?.[targetNodeId]?.name || targetNodeId}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="noc-field-group">
              <label className="noc-field-label">{t('interface')}</label>
              <div className={`noc-custom-select ${openDropdown === 'iface' ? 'open' : ''}`}>
                <div
                  className="noc-cs-header"
                  style={{ opacity: (!eMainDevice || availableIfaces.length === 0) ? 0.5 : 1 }}
                  onClick={(e) => {
                    if (!eMainDevice || availableIfaces.length === 0) return;
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === 'iface' ? null : 'iface');
                  }}
                >
                  <span>{eInterface || 'Selecione a interface...'}</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                {openDropdown === 'iface' && (
                  <div className="noc-cs-dropdown" style={{ maxHeight: 200, overflowY: 'auto' }}>
                    <ul className="noc-cs-options">
                      <li
                        onClick={() => {
                          setEInterface('');
                          setOpenDropdown(null);
                        }}
                        style={{ fontStyle: 'italic', opacity: 0.7 }}
                      >
                        Selecione a interface...
                      </li>
                      {availableIfaces.map((ifc) => (
                        <li
                          key={ifc}
                          onClick={() => {
                            setEInterface(ifc);
                            setOpenDropdown(null);
                          }}
                        >
                          {ifc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {eInterface && eMetrics.length > 0 && (
              <div className="noc-field-group" style={{ marginTop: 15 }}>
                <label className="noc-field-label">{t('metricsToShow')}</label>
                <div style={{ maxHeight: 150, overflowY: 'auto', background: '#030712', borderRadius: 6, padding: 10 }}>
                  {eMetrics.map((m, idx) => (
                    <div key={m.name} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 10 }}>
                      <input
                        type="checkbox"
                        checked={m.enabled}
                        onChange={(e) => {
                          const nm = [...eMetrics];
                          nm[idx].enabled = e.target.checked;
                          setEMetrics(nm);
                        }}
                      />
                      <input
                        type="text"
                        value={m.icon}
                        onChange={(e) => {
                          const nm = [...eMetrics];
                          nm[idx].icon = e.target.value;
                          setEMetrics(nm);
                        }}
                        style={{ width: 40, background: '#1f2937', border: '1px solid #374151', color: '#fff', textAlign: 'center', padding: 4, borderRadius: 4 }}
                      />
                      <span style={{ fontSize: 12, color: '#d1d5db' }}>{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="noc-edge-prop" style={{ display: 'flex', gap: 15, marginTop: 15 }}>
          <div className="noc-field-group" style={{ flex: 1 }}>
            <label className="noc-field-label">{t('lineWidth')}</label>
            <div className={`noc-custom-select ${openDropdown === 'width' ? 'open' : ''}`}>
              <div
                className="noc-cs-header"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === 'width' ? null : 'width');
                }}
              >
                <span>{EDGE_WIDTH_LABELS[eWidth as keyof typeof EDGE_WIDTH_LABELS] || eWidth}</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {openDropdown === 'width' && (
                <div className="noc-cs-dropdown">
                  <ul className="noc-cs-options">
                    {Object.entries(EDGE_WIDTH_LABELS).map(([v, l]) => (
                      <li
                        key={v}
                        onClick={() => {
                          setEWidth(v);
                          setOpenDropdown(null);
                        }}
                      >
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="noc-field-group" style={{ flex: 1 }}>
            <label className="noc-field-label">{t('lineStyle')}</label>
            <div className={`noc-custom-select ${openDropdown === 'style' ? 'open' : ''}`}>
              <div
                className="noc-cs-header"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === 'style' ? null : 'style');
                }}
              >
                <span>{EDGE_STYLE_LABELS[eStyle as keyof typeof EDGE_STYLE_LABELS] || eStyle}</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {openDropdown === 'style' && (
                <div className="noc-cs-dropdown">
                  <ul className="noc-cs-options">
                    {Object.entries(EDGE_STYLE_LABELS).map(([v, l]) => (
                      <li
                        key={v}
                        onClick={() => {
                          setEStyle(v);
                          setOpenDropdown(null);
                        }}
                      >
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="noc-modal-actions">
          <button className="noc-mod-btn cancel" onClick={onClose} title={t('cancel')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <button
            className="noc-mod-btn confirm"
            title={t('save')}
            onClick={() => {
              onSave({ eMonitored, eMainDevice, eInterface, eMetrics, eWidth, eStyle, eFormatTraffic });
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

