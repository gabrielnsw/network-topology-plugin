import React from 'react';
import { CtxMenu } from '../types';

interface ContextMenuProps {
  ctxMenu: CtxMenu;
  editMode: boolean;
  t: (key: string) => string;
  onEdit: () => void;
  onRemove: () => void;
  onAddAnchor: () => void;
  onDetails: () => void;
}

/**
 * Represents the floating custom context logic triggered by user Right-Clicks 
 * over the Cytoscape canvas elements (Nodes, Edges, Anchors).
 * It relies on the absolute pointer positions and exposes standard graph manipulation actions.
 * 
 * @param ctxMenu - State tracking the visibility toggle and target ID of the clicked element 
 * @param editMode - Grants access to destructive triggers (Removals, Edge Configs) when true
 * @param t - Translation callback for i18n support
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({
  ctxMenu, editMode, t, onEdit, onRemove, onAddAnchor, onDetails
}) => {
  if (!ctxMenu.visible) {
    return null;
  }

  return (
    <div className="noc-ctx-menu" style={{ left: ctxMenu.x, top: ctxMenu.y }}>
      {!ctxMenu.targetIsNode && (
        <button
          style={{ color: '#d1d5db' }}
          className="noc-ctx-remove"
          onClick={onDetails}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>{t('details') || 'Detalhes'}</span>
        </button>
      )}

      {editMode && !(ctxMenu.targetIsNode && ctxMenu.targetId.includes('anchor')) && (
        <button
          style={{ color: '#d1d5db' }}
          className="noc-ctx-remove"
          onClick={onEdit}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>{ctxMenu.targetIsNode ? t('edit') : t('edgeConfig')}</span>
        </button>
      )}
      
      {editMode && !ctxMenu.targetIsNode && (
        <button
          style={{ color: '#d1d5db' }}
          className="noc-ctx-remove"
          onClick={onAddAnchor}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          {t('addAnchor')}
        </button>
      )}

      {editMode && (
        <>
          <div className="noc-divider"></div>
          <button className="noc-ctx-remove" onClick={onRemove}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            {(ctxMenu.targetIsNode && ctxMenu.targetId.includes('anchor')) ? t('removeAnchor') : t('remove')}
          </button>
        </>
      )}
    </div>
  );
};
