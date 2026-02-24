import { ThemeSettings } from './types';

export const DEFAULT_THEME: ThemeSettings = {
  bgColor: '#030712',
  sidebarColor: '#111827',
  nodeBgColor: '#1f2937',
  edgeColor: '#4b5563',
  language: 'pt-br',
};

export const NODE_SIZES: Record<string, { w: number; h: number; iconScale: number }> = {
  small: { w: 35, h: 35, iconScale: 20 },
  medium: { w: 50, h: 50, iconScale: 28 },
  large: { w: 70, h: 70, iconScale: 40 },
};

export const EDGE_WIDTH_LABELS: Record<string, string> = { '1': 'Fina', '2.5': 'Normal', '5': 'Grossa' };
export const EDGE_STYLE_LABELS: Record<string, string> = { solid: 'Sólida', dashed: 'Tracejada', dotted: 'Pontilhada' };

export const CSS = `
  .noc-root {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    background: #030712;
    font-family: 'Inter', system-ui, sans-serif;
    border-radius: 8px;
    border: 1px solid #1f2937;
    overflow: hidden;
  }

  .noc-sidebar {
    width: 65px;
    min-width: 65px;
    flex-shrink: 0;
    background: #111827;
    border-right: 1px solid #1f2937;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 0;
    z-index: 20;
    box-shadow: 2px 0 15px rgba(0, 0, 0, 0.5);
  }

  .noc-sb-menu {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    align-items: center;
    flex: 1;
  }

  .noc-btn {
    background: #1f2937;
    color: #d1d5db;
    border: 1px solid #374151;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    padding: 0;
  }

  .noc-btn svg {
    width: 20px;
    height: 20px;
  }

  .noc-btn:hover {
    background: #374151;
    color: #fff;
  }

  .noc-btn.active {
    background: #3b82f6;
    color: #fff;
    border-color: #60a5fa;
  }

  .noc-btn.save {
    background: #065f46;
    border-color: #059669;
    color: #fff;
    margin-top: auto;
  }

  .noc-btn.save:hover {
    background: #047857;
  }

  .noc-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .noc-edit-tools {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    align-items: center;
    flex: 1;
  }

  .noc-canvas {
    flex: 1;
    position: relative;
    background: radial-gradient(circle at center, #111827 0%, #030712 100%);
  }

  .noc-cy {
    width: 100%;
    height: 100%;
    display: block;
  }

  .noc-legend {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 10;
    background: rgba(17, 24, 39, 0.85);
    padding: 15px 25px;
    border-radius: 8px;
    border: 1px solid #374151;
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    gap: 15px;
    font-size: 13px;
    color: #d1d5db;
    font-weight: 700;
  }

  .noc-leg-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .noc-st-ok {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 10px #10b981;
  }

  .noc-st-fail {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 10px #ef4444;
  }

  .noc-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .noc-modal-content {
    background: #1f2937;
    padding: 25px;
    border-radius: 12px;
    border: 1px solid #374151;
    width: 550px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    color: #fff;
  }

  .noc-modal-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 15px;
    margin-top: 0;
  }

  .noc-field-group {
    margin-bottom: 15px;
    text-align: left;
  }

  .noc-field-label {
    display: block;
    color: #9ca3af;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  .noc-icon-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2px;
    max-height: 250px;
    overflow-y: auto;
    padding-right: 5px;
  }

  .noc-icon-opt {
    background: #111827;
    border: 1px solid #374151;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .noc-icon-opt svg {
    fill: #9ca3af;
    width: 24px;
    height: 24px;
    margin-bottom: 5px;
  }

  .noc-icon-opt:hover {
    border-color: #6b7280;
  }

  .noc-icon-opt.selected {
    background: #1e3a8a;
    border-color: #3b82f6;
  }

  .noc-icon-opt.selected svg {
    fill: #60a5fa;
  }

  .noc-modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  .noc-mod-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    transition: all 0.2s;
  }

  .noc-mod-btn.cancel {
    background: #ef4444;
    color: #fff;
  }

  .noc-mod-btn.confirm {
    background: #10b981;
    color: #fff;
  }

  .noc-mod-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .noc-custom-select {
    position: relative;
    width: 100%;
  }

  .noc-cs-header {
    background: #111827;
    border: 1px solid #374151;
    color: #fff;
    padding: 10px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .noc-custom-select.open .noc-cs-header {
    border-color: #3b82f6;
  }

  .noc-cs-header span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .noc-cs-dropdown {
    display: none;
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    right: 0;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 6px;
    z-index: 100;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    flex-direction: column;
  }

  .noc-custom-select.open .noc-cs-dropdown {
    display: flex;
  }

  .noc-cs-search-wrap {
    padding: 8px;
    border-bottom: 1px solid #374151;
    background: #111827;
  }

  .noc-cs-search {
    width: 100%;
    background: #030712;
    border: 1px solid #374151;
    color: #fff;
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    outline: none;
    box-sizing: border-box;
  }

  .noc-cs-options {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 180px;
    overflow-y: auto;
  }

  .noc-cs-options li {
    padding: 8px 12px;
    font-size: 12px;
    color: #d1d5db;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  }

  .noc-cs-options li:hover {
    background: #3b82f6;
    color: #fff;
  }

  .noc-cs-options li.hidden {
    display: none;
  }

  .noc-edge-prop {
    display: flex;
    gap: 10px;
  }

  .noc-ctx-menu {
    position: absolute;
    z-index: 1000;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 6px;
    padding: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }

  .noc-ctx-remove {
    background: transparent;
    border: none;
    color: #ef4444;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px 12px;
    font-family: Inter, sans-serif;
    font-weight: 600;
    font-size: 12px;
    width: 100%;
    border-radius: 4px;
  }

  .noc-ctx-remove:hover {
    background: #374151;
  }

  .noc-divider {
    width: 100%;
    height: 1px;
    background: #374151;
    margin: 5px 0;
  }
`;
