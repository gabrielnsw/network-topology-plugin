import React, { useState, useMemo } from 'react';
import { ZabbixHost } from '../../types';
import { ICON_KEYS, getIconDataUri } from '../icons';

interface AddDeviceModalProps {
  visible: boolean;
  zabbixMetrics: Record<string, ZabbixHost>;
  existingNodes: string[];
  onClose: () => void;
  onConfirm: (
    deviceId: string,
    iconType: string,
    position?: { x: number; y: number },
    size?: string,
    alias?: string,
    customPing?: string,
    customLoss?: string,
    customLatency?: string
  ) => void;
  t: (key: string) => string;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  visible,
  zabbixMetrics,
  existingNodes,
  onClose,
  onConfirm,
  t,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('router');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [alias, setAlias] = useState('');
  const [customPing, setCustomPing] = useState('');
  const [customLoss, setCustomLoss] = useState('');
  const [customLatency, setCustomLatency] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [searchQueryItems, setSearchQueryItems] = useState('');
  const [showPingError, setShowPingError] = useState(false);

  const currentHost = zabbixMetrics[selectedDevice || ''];
  const itemsList = currentHost && currentHost.items ? Object.keys(currentHost.items).sort() : [];

  const filteredHosts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return Object.entries(zabbixMetrics || {})
      .filter(
        ([id, h]) => !existingNodes.includes(id) && (id.toLowerCase().includes(q) || h.name.toLowerCase().includes(q))
      )
      .map(([id, h]) => ({ id, name: h.name }));
  }, [searchQuery, zabbixMetrics, existingNodes]);

  if (!visible) {
    return null;
  }

  const renderItemDropdown = (
    id: string,
    label: string,
    value: string,
    setValue: (v: string) => void,
    placeholder: string
  ) => {
    const isOpen = openDropdownId === id;
    const filtered = itemsList.filter((o) => o.toLowerCase().includes(searchQueryItems.toLowerCase()));

    return (
      <div className="noc-field-group" style={{ marginTop: id === 'ping' ? 0 : 15 }}>
        <label className="noc-field-label">{label}</label>
        <div className={`noc-custom-select ${isOpen ? 'open' : ''}`} onClick={(e: any) => e.stopPropagation()}>
          <div
            className="noc-cs-header"
            onClick={() => {
              setOpenDropdownId(isOpen ? null : id);
              if (!isOpen) {
                setSearchQueryItems('');
              }
              setDropdownOpen(false);
            }}
          >
            <span>{value || placeholder}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          {isOpen && (
            <div className="noc-cs-dropdown">
              <div className="noc-cs-search-wrap">
                <input
                  type="text"
                  className="noc-cs-search"
                  placeholder="Pesquisar item..."
                  value={searchQueryItems}
                  onChange={(e: any) => setSearchQueryItems(e.target.value)}
                />
              </div>
              <ul className="noc-cs-options" style={{ maxHeight: 200, overflowY: 'auto' }}>
                <li
                  onClick={() => {
                    setValue('');
                    setOpenDropdownId(null);
                    setSearchQueryItems('');
                    if (id === 'ping') {
                      setShowPingError(false);
                    }
                  }}
                  style={{ fontStyle: 'italic', background: value === '' ? '#374151' : 'transparent' }}
                >
                  -- Nenhum --
                </li>
                {filtered.map((o) => (
                  <li
                    key={o}
                    onClick={() => {
                      setValue(o);
                      setOpenDropdownId(null);
                      setSearchQueryItems('');
                      if (id === 'ping') {
                        setShowPingError(false);
                      }
                    }}
                  >
                    {o}
                  </li>
                ))}
                {filtered.length === 0 && <li style={{ textAlign: 'center', opacity: 0.5 }}>Nenhum item encontrado</li>}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleSaveAttempt = () => {
    if (!customPing && itemsList.length > 0) {
      setShowPingError(true);
      return;
    }
    onConfirm(selectedDevice, selectedIcon, undefined, selectedSize, alias, customPing, customLoss, customLatency);
    setSelectedDevice('');
    setSelectedIcon('router');
    setSelectedSize('medium');
    setAlias('');
    setCustomPing('');
    setCustomLoss('');
    setCustomLatency('');
    setShowPingError(false);
  };

  return (
    <div className="noc-modal-overlay">
      <div
        className="noc-modal-content"
        style={{ width: 750, maxWidth: '95vw', padding: 25 }}
        onClick={() => {
          setDropdownOpen(false);
          setOpenDropdownId(null);
        }}
      >
        <h3
          className="noc-modal-title"
          style={{ borderBottom: '1px solid #374151', paddingBottom: 10, marginBottom: 20 }}
        >
          {t('addDevice') || 'Adicionar Equipamento'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
          {/* LEFT COLUMN: HOST & ITEMS CONFIGURATION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div className="noc-field-group">
              <label className="noc-field-label">{t('chooseDevice') || 'Selecione o Host do Zabbix'}</label>
              <div className={`noc-custom-select ${dropdownOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div
                  className="noc-cs-header"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setOpenDropdownId(null);
                  }}
                >
                  <span>
                    {selectedDevice
                      ? `${zabbixMetrics[selectedDevice]?.name} (${selectedDevice})`
                      : t('selectDevice') || 'Selecione um host...'}
                  </span>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                {dropdownOpen && (
                  <div className="noc-cs-dropdown">
                    <div className="noc-cs-search-wrap">
                      <input
                        type="text"
                        className="noc-cs-search"
                        placeholder={t('searchDevice') || 'Pesquisar Host...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <ul className="noc-cs-options" style={{ maxHeight: 200, overflowY: 'auto' }}>
                      {filteredHosts.map((h) => (
                        <li
                          key={h.id}
                          onClick={() => {
                            setSelectedDevice(h.id);
                            setAlias(h.name);
                            setCustomPing('');
                            setCustomLoss('');
                            setCustomLatency('');
                            setDropdownOpen(false);
                            setSearchQuery('');
                          }}
                        >
                          {h.name} <span style={{ opacity: 0.5 }}>({h.id})</span>
                        </li>
                      ))}
                      {filteredHosts.length === 0 && (
                        <li style={{ textAlign: 'center', opacity: 0.5 }}>
                          {t('noDeviceFound') || 'Nenhum host disponível.'}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {selectedDevice && itemsList.length > 0 && (
              <div style={{ padding: 15, background: 'rgba(0,0,0,0.2)', borderRadius: 8, border: '1px solid #1f2937' }}>
                {showPingError && (
                  <div
                    style={{
                      padding: 8,
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid #ef4444',
                      color: '#fca5a5',
                      borderRadius: 4,
                      marginBottom: 15,
                      fontSize: 12,
                    }}
                  >
                    O item de Ping é obrigatório para verificar o status operacional do Host.
                  </div>
                )}

                {renderItemDropdown(
                  'ping',
                  t('customPing') || 'Item de Ping',
                  customPing,
                  setCustomPing,
                  '-- Selecione o item (Obrigatório) --'
                )}
                {renderItemDropdown(
                  'latency',
                  t('customLatency') || 'Item de Latência',
                  customLatency,
                  setCustomLatency,
                  `${t('auto') || 'Auto'} (Padrão)`
                )}
                {renderItemDropdown(
                  'loss',
                  t('customLoss') || 'Item de Perda (%)',
                  customLoss,
                  setCustomLoss,
                  `${t('auto') || 'Auto'} (Padrão)`
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: STYLING */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div className="noc-field-group">
              <label className="noc-field-label">{t('aliasOptional') || 'Nome de Exibição (Opcional)'}</label>
              <input
                type="text"
                className="noc-cs-search"
                placeholder="Ex: Roteador Central"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
              />
            </div>

            <div className="noc-field-group">
              <label className="noc-field-label">{t('newIcon') || 'Ícone'}</label>
              <div
                className="noc-icon-grid"
                style={{ gridTemplateColumns: 'repeat(4, 1fr)', maxHeight: 200, overflowY: 'auto', paddingRight: 5 }}
              >
                {ICON_KEYS.map((k) => (
                  <div
                    key={k}
                    className={`noc-icon-opt ${selectedIcon === k ? 'selected' : ''}`}
                    onClick={() => setSelectedIcon(k)}
                    style={{ padding: '8px 4px' }}
                  >
                    <div style={{ fontSize: '18px', marginBottom: 4 }}>
                      {(() => {
                        const uri = getIconDataUri(k);
                        return <img src={uri} alt={k} style={{ width: 30, height: 30 }} />;
                      })()}
                    </div>
                    <div style={{ fontSize: '9px', textTransform: 'capitalize' }}>{t(`icon_${k}`) || k}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="noc-field-group">
              <label className="noc-field-label">{t('iconSize') || 'Tamanho'}</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['small', 'medium', 'large'].map((sz) => (
                  <button
                    key={sz}
                    className={`noc-mod-btn ${selectedSize === sz ? 'confirm' : 'cancel'}`}
                    style={{ flex: 1, padding: '10px 0', fontSize: 13 }}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz.charAt(0).toUpperCase() + sz.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="noc-modal-actions" style={{ marginTop: 30, paddingTop: 15, borderTop: '1px solid #374151' }}>
          <button
            className="noc-mod-btn cancel"
            onClick={() => {
              onClose();
              setSelectedDevice('');
              setSelectedIcon('router');
              setSelectedSize('medium');
              setAlias('');
              setCustomPing('');
              setCustomLoss('');
              setCustomLatency('');
              setShowPingError(false);
            }}
            title={t('cancel')}
            style={{ padding: '10px 20px' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span style={{ marginLeft: 8 }}>{t('cancel') || 'Cancelar'}</span>
          </button>
          <button
            className="noc-mod-btn confirm"
            disabled={!selectedDevice}
            title={t('confirm')}
            style={{ padding: '10px 20px' }}
            onClick={handleSaveAttempt}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span style={{ marginLeft: 8 }}>{t('addDevice') || 'Adicionar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
