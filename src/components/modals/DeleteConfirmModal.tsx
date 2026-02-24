import React from 'react';
import { DeleteConfirmData } from '../../types';

interface DeleteConfirmModalProps {
  deleteConfirm: DeleteConfirmData;
  onClose: () => void;
  onConfirm: () => void;
  t: (key: string) => string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ deleteConfirm, onClose, onConfirm, t }) => {
  if (!deleteConfirm.visible) {
    return null;
  }

  return (
    <div className="noc-modal-overlay">
      <div className="noc-modal-content" style={{ width: 400 }}>
        <h3 className="noc-modal-title">{t('confirmDelete')}</h3>
        <p style={{ marginBottom: 20 }}>
          {t('confirmDeleteMsg')} <strong>{deleteConfirm.name}</strong>?
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="noc-btn" onClick={onClose}>
            {t('cancel')}
          </button>
          <button
            className="noc-btn save"
            style={{ background: '#ef4444', borderColor: '#ef4444', color: '#fff' }}
            onClick={onConfirm}
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};
