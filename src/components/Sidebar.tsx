import React from 'react';

interface SidebarProps {
  editMode: boolean;
  linkMode: boolean;
  zoomEnabled: boolean;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  historyIdx: number;
  historyLength: number;
  hasUnsavedChanges: boolean;
  t: (key: string) => string;
  onToggleEdit: () => void;
  onToggleLink: () => void;
  onToggleZoom: () => void;
  onCenter: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddDevice: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  editMode, linkMode, zoomEnabled, saveStatus, historyIdx, historyLength, hasUnsavedChanges, t,
  onToggleEdit, onToggleLink, onToggleZoom, onCenter, onSave, onUndo, onRedo, onAddDevice, onOpenSettings
}) => {
  return (
    <div className="noc-sidebar">
      <div className="noc-sb-menu">
        <button
          className={`noc-btn ${editMode ? 'active' : ''}`}
          onClick={onToggleEdit}
          title={t('editMode')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>

        <div className="noc-edit-tools">
          <button className="noc-btn" onClick={onAddDevice} disabled={!editMode} title={t('addDevice')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </button>
          <button
            className={`noc-btn ${linkMode ? 'active' : ''}`}
            onClick={onToggleLink}
            disabled={!editMode}
            title={t('linkMode')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </button>
          <button
            className="noc-btn"
            onClick={onUndo}
            disabled={!editMode || historyIdx <= 0}
            title={t('undo')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 14 4 9 9 4"></polyline>
              <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
            </svg>
          </button>
          <button
            className="noc-btn"
            onClick={onRedo}
            disabled={!editMode || historyIdx >= historyLength - 1}
            title={t('redo')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 14 20 9 15 4"></polyline>
              <path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>
            </svg>
          </button>
        </div>

        <button
          className={`noc-btn ${zoomEnabled ? 'active' : ''}`}
          onClick={onToggleZoom}
          title={t('zoom')}
          style={{ marginTop: editMode ? 'auto' : 0 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>

        <button className="noc-btn" onClick={onCenter} title={t('center')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 9V5h4M19 9V5h-4M5 15v4h4M19 15v4h-4M12 12v.01"></path>
          </svg>
        </button>

        <button className="noc-btn" onClick={onOpenSettings} title={t('settings')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>

        <div style={{ position: 'relative', marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {hasUnsavedChanges && saveStatus !== 'success' && (
            <div
              title="Alterações não salvas"
              style={{
                color: '#fcd34d',
                marginBottom: '8px',
                animation: 'pulse 2s infinite',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
          )}
          <button
          className={`noc-btn save ${saveStatus === 'success' ? 'noc-success' : ''}`}
          onClick={onSave}
          disabled={!editMode}
          title={t('saveMap')}
          style={{
            background: saveStatus === 'success' ? '#10b981' : saveStatus === 'error' ? '#ef4444' : '',
            borderColor: saveStatus === 'success' ? '#059669' : saveStatus === 'error' ? '#b91c1c' : '',
          }}
        >
          {saveStatus === 'saving' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="noc-spin">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
          ) : saveStatus === 'success' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : saveStatus === 'error' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
          )}
        </button>
        </div>
      </div>
    </div>
  );
};
