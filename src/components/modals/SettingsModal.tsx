import React, { useState, useEffect } from 'react';
import { ThemeSettings } from '../../types';
import { DEFAULT_THEME } from '../../constants';

interface SettingsModalProps {
  visible: boolean;
  themeSettings: ThemeSettings;
  setThemeSettings: (settings: ThemeSettings) => void;
  onClose: () => void;
  t: (key: string) => string;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  themeSettings,
  setThemeSettings,
  onClose,
  t,
  onExportBackup,
  onImportBackup,
}) => {
  const [settingsForm, setSettingsForm] = useState<ThemeSettings>(DEFAULT_THEME);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setSettingsForm(themeSettings);
    }
  }, [visible, themeSettings]);

  if (!visible) return null;

  return (
    <div className="noc-modal-overlay" onClick={() => setOpenDropdown(null)}>
      <div className="noc-modal-content" style={{ width: 450 }} onClick={(e: any) => e.stopPropagation()}>
        <h3 className="noc-modal-title">{t('themeSettings')}</h3>

        <div className="noc-field-group">
          <label className="noc-field-label">{t('bgColor')}</label>
          <input
            type="color"
            style={{ width: '100%', height: 40, padding: 0, border: 'none', borderRadius: 6, cursor: 'pointer' }}
            value={settingsForm.bgColor}
            onChange={(e) => setSettingsForm({ ...settingsForm, bgColor: e.target.value })}
          />
        </div>

        <div className="noc-field-group">
          <label className="noc-field-label">{t('sidebarColorLabel')}</label>
          <input
            type="color"
            style={{ width: '100%', height: 40, padding: 0, border: 'none', borderRadius: 6, cursor: 'pointer' }}
            value={settingsForm.sidebarColor}
            onChange={(e) => setSettingsForm({ ...settingsForm, sidebarColor: e.target.value })}
          />
        </div>

        <div className="noc-field-group">
          <label className="noc-field-label">{t('nodeBgColorLabel')}</label>
          <input
            type="color"
            style={{ width: '100%', height: 40, padding: 0, border: 'none', borderRadius: 6, cursor: 'pointer' }}
            value={settingsForm.nodeBgColor}
            onChange={(e) => setSettingsForm({ ...settingsForm, nodeBgColor: e.target.value })}
          />
        </div>

        <div className="noc-field-group">
          <label className="noc-field-label">{t('edgeColorLabel')}</label>
          <input
            type="color"
            style={{ width: '100%', height: 40, padding: 0, border: 'none', borderRadius: 6, cursor: 'pointer' }}
            value={settingsForm.edgeColor}
            onChange={(e) => setSettingsForm({ ...settingsForm, edgeColor: e.target.value })}
          />
        </div>

        <div className="noc-field-group">
          <label className="noc-field-label">{t('languageLabel')}</label>
          <div className={`noc-custom-select ${openDropdown === 'lang' ? 'open' : ''}`}>
            <div
              className="noc-cs-header"
              onClick={(e: any) => {
                e.stopPropagation();
                setOpenDropdown(openDropdown === 'lang' ? null : 'lang');
              }}
            >
              <span>
                {settingsForm.language === 'pt-br'
                  ? t('portuguese')
                  : settingsForm.language === 'en'
                    ? t('english')
                    : t('spanish')}
              </span>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {openDropdown === 'lang' && (
              <div className="noc-cs-dropdown">
                <ul className="noc-cs-options">
                  <li
                    onClick={() => {
                      setSettingsForm({ ...settingsForm, language: 'pt-br' });
                      setOpenDropdown(null);
                    }}
                  >
                    {t('portuguese')}
                  </li>
                  <li
                    onClick={() => {
                      setSettingsForm({ ...settingsForm, language: 'en' });
                      setOpenDropdown(null);
                    }}
                  >
                    {t('english')}
                  </li>
                  <li
                    onClick={() => {
                      setSettingsForm({ ...settingsForm, language: 'es' });
                      setOpenDropdown(null);
                    }}
                  >
                    {t('spanish')}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="noc-field-group" style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="noc-mod-btn confirm" style={{ flex: 1, padding: '10px 0' }} onClick={onExportBackup}>
              {t('exportBackup') || 'Export Backup (JSON)'}
            </button>
            <label
              className="noc-mod-btn confirm"
              style={{ flex: 1, padding: '10px 0', textAlign: 'center', cursor: 'pointer', margin: 0 }}
            >
              {t('importBackup') || 'Restore Backup (JSON)'}
              <input type="file" accept=".json" style={{ display: 'none' }} onChange={onImportBackup} />
            </label>
          </div>
        </div>

        <div className="noc-modal-actions" style={{ marginTop: 30 }}>
          <button className="noc-mod-btn cancel" onClick={onClose} title={t('cancel')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <button
            className="noc-mod-btn cancel"
            title={t('restoreDefault')}
            onClick={() => setSettingsForm(DEFAULT_THEME)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <polyline points="3 3 3 8 8 8"></polyline>
            </svg>
          </button>
          <button
            className="noc-mod-btn confirm"
            title={t('save')}
            onClick={() => {
              setThemeSettings(settingsForm);
              onClose();
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
