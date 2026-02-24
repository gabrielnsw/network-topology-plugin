import React from 'react';

interface LegendProps {
  visible: boolean;
  t: (key: string) => string;
}

/**
 * Bottom-left visual canvas overlay dictating the color-coded rules mapping
 * for current node/edge monitored statuses.
 * 
 * @param visible - Controls internal component rendering
 * @param t - Function hooked to the i18n provider for dynamic multi-language texts
 */
export const Legend: React.FC<LegendProps> = ({ visible, t }) => {
  if (!visible) return null;

  return (
    <div className="noc-legend">
      <div className="noc-leg-item">
        <div className="noc-st-ok"></div>
        <span>{t('operational')}</span>
      </div>
      <div className="noc-leg-item">
        <div className="noc-st-fail"></div>
        <span>{t('offline')}</span>
      </div>
    </div>
  );
};
