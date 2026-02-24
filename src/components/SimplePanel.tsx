import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import cytoscape from 'cytoscape';
import { PanelProps } from '@grafana/data';
import {
  SimpleOptions,
  ThemeSettings,
  TopoState,
  CtxMenu,
  InfoModalData,
  DeleteConfirmData,
  ZabbixHost,
} from '../types';
import { DEFAULT_THEME, CSS } from '../constants';
import { useTranslation } from '../translations';
import { parseZabbixDataFrame } from '../api';
import { getBaseStyle } from '../cytoscape/styles';
import { refreshMetricsCore } from '../cytoscape/metrics';
import { cleanElementsForSaving, restoreIcons } from '../cytoscape/helpers';
import { ICON_KEYS } from './icons';

import { Sidebar } from './Sidebar';
import { Legend } from './Legend';
import { ContextMenu } from './ContextMenu';
import { AddDeviceModal } from './modals/AddDeviceModal';
import { EditNodeModal } from './modals/EditNodeModal';
import { EdgeModal } from './modals/EdgeModal';
import { InfoModal } from './modals/InfoModal';
import { DeleteConfirmModal } from './modals/DeleteConfirmModal';
import { SettingsModal } from './modals/SettingsModal';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height, onOptionsChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  const [zabbixMetrics, setZabbixMetrics] = useState<Record<string, ZabbixHost>>({});

  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(DEFAULT_THEME);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const lastSavedIdx = useRef<number>(0);

  const [state, setState] = useState<TopoState>({
    editMode: false,
    linkMode: false,
    zoomEnabled: true,
    sourceNodeId: null,
    targetNodeId: null,
    editingEdgeId: null,
    editingNodeId: null,
    history: [],
    historyIdx: -1,
    selectedIcon: 'router',
    isFetching: false,
  });

  const [ctxMenu, setCtxMenu] = useState<CtxMenu>({
    visible: false,
    x: 0,
    y: 0,
    canvasPos: null,
    targetId: '',
    targetIsNode: false,
  });
  const [infoModal, setInfoModal] = useState<InfoModalData>({ visible: false, type: 'node', targetId: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmData>({ visible: false, targetId: '', name: '' });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEdgeModal, setShowEdgeModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedEdgeData, setSelectedEdgeData] = useState<any>(null);

  const t = useTranslation(themeSettings.language);

  const handleExportBackup = useCallback(() => {
    if (!cyRef.current) return;
    const elements = cyRef.current.elements().jsons();
    const backupData = {
      elements,
      themeSettings: options.themeSettings,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', url);
    downloadAnchorNode.setAttribute('target', '_blank');
    downloadAnchorNode.setAttribute('download', `topology_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();

    document.body.removeChild(downloadAnchorNode);
    URL.revokeObjectURL(url);
  }, [options.themeSettings]);

  const handleImportBackup = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (json && json.elements && cyRef.current) {
            cyRef.current.elements().remove();
            cyRef.current.add(json.elements);

            const cyData = cleanElementsForSaving(cyRef.current);
            const str = JSON.stringify(cyData);
            updateState({
              history: [str],
              historyIdx: 0,
            });

            const newTheme = json.themeSettings || options.themeSettings;
            setThemeSettings(newTheme);
            onOptionsChange({
              ...options,
              topologyData: str,
              themeSettings: newTheme,
            });
            setShowSettingsModal(false);
          } else {
            setAlertMessage('Arquivo de backup inválido: Faltam os elementos do mapa.');
          }
        } catch (err) {
          setAlertMessage(t('noDataLegend') + ': Invalid json.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [options, onOptionsChange, t]
  );

  const updateState = (updates: Partial<TopoState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const pushHistory = useCallback(
    (cy: cytoscape.Core) => {
      const cyData = cleanElementsForSaving(cy);
      const str = JSON.stringify(cyData);
      updateState({
        history: [...state.history.slice(0, state.historyIdx + 1), str],
        historyIdx: state.historyIdx + 1,
      });
    },
    [state.history, state.historyIdx]
  );

  const refreshMetrics = useCallback(
    (cy: cytoscape.Core) => {
      refreshMetricsCore(cy, zabbixMetrics, t);
    },
    [zabbixMetrics, t]
  );

  useEffect(() => {
    if (options.themeSettings) {
      setThemeSettings(options.themeSettings);
    }
  }, [options.themeSettings]);

  useEffect(() => {
    if (data.series) {
      const metrics = parseZabbixDataFrame(data.series);
      setZabbixMetrics(metrics);
      if (cyRef.current) refreshMetrics(cyRef.current);
    }
  }, [data.series, refreshMetrics]);
  useEffect(() => {
    if (!containerRef.current) return;
    const cy = cytoscape({
      container: containerRef.current,
      elements: [],
      style: getBaseStyle(themeSettings, ICON_KEYS),
      layout: { name: 'preset' },
      wheelSensitivity: 0.2,
    });
    cyRef.current = cy;

    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const id = node.id();
      const currState = stateRef.current;

      if (currState.editMode) {
        if (currState.linkMode) {
          if (!currState.sourceNodeId) {
            updateState({ sourceNodeId: id });
            node.addClass('selected');
          } else if (currState.sourceNodeId !== id) {
            updateState({ targetNodeId: id });
            node.addClass('selected');

            /**
             * Trace logic to uncover the real destination bounds during edge creation
             * to avoid generating loops internally over abstract Anchor elements.
             */
            const findTrueTarget = (startId: string, currentId: string, visited: Set<string>): string[] => {
              if (visited.has(currentId)) return [];
              visited.add(currentId);
              const n = cy.getElementById(currentId);
              if (!n.length) return [];
              if (!n.hasClass('anchor') && currentId !== startId) return [currentId];

              let endpoints: string[] = [];
              const connectedEdges = n.connectedEdges();
              connectedEdges.forEach((e) => {
                const src = e.data('source');
                const tgt = e.data('target');
                const nextNode = src === currentId ? tgt : src;
                endpoints.push(...findTrueTarget(startId, nextNode, visited));
              });
              return endpoints;
            };

            const srcEndpoints = findTrueTarget(currState.sourceNodeId, currState.sourceNodeId, new Set());
            if (srcEndpoints.includes(id)) {
              setDuplicateAlert(true);
              const srcNode = cy.getElementById(currState.sourceNodeId);
              if (srcNode.length) {
                srcNode.removeClass('selected');
              }
              node.removeClass('selected');
              updateState({ sourceNodeId: null, targetNodeId: null, linkMode: false });
            } else {
              setSelectedEdgeData({
                source: currState.sourceNodeId,
                target: id,
                eColor: themeSettings.edgeColor || '#4b5563',
                eWidth: 2.5,
                eStyle: 'solid',
                eMonitored: false,
                eMainDevice: '',
                eInterface: '',
                eMetrics: [],
              });
              setShowEdgeModal(true);
            }
          } else {
            updateState({ sourceNodeId: null });
            node.removeClass('selected');
          }
        }
      }
      setCtxMenu((prev) => ({ ...prev, visible: false }));
    });

    cy.on('tap', 'edge', (evt) => {
      setCtxMenu((prev) => ({ ...prev, visible: false }));
    });

    cy.on('cxttap', (evt: any) => {
      if (evt.target !== cy) {
        const tgt = evt.target;
        setCtxMenu({
          visible: true,
          x: evt.originalEvent.offsetX,
          y: evt.originalEvent.offsetY,
          canvasPos: evt.position || null,
          targetId: tgt.id(),
          targetIsNode: tgt.isNode(),
        });
      } else {
        setCtxMenu((prev) => ({ ...prev, visible: false }));
      }
    });

    cy.on('dragfree', 'node', () => pushHistory(cy));

    if (options.topologyData) {
      try {
        const elements = JSON.parse(options.topologyData);
        if (elements && elements.length > 0) {
          restoreIcons(elements);
          cy.add(elements);
          const str = JSON.stringify(cleanElementsForSaving(cy));
          updateState({ history: [str], historyIdx: 0 });
        }
      } catch (e) {}
    }

    return () => cy.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.userZoomingEnabled(state.zoomEnabled);
    }
  }, [state.zoomEnabled]);

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.autoungrabify(!state.editMode);
    }
  }, [state.editMode]);

  const saveMap = useCallback(async () => {
    if (!cyRef.current) return;
    setSaveStatus('saving');
    try {
      const cyData = cleanElementsForSaving(cyRef.current);
      onOptionsChange({
        ...options,
        topologyData: JSON.stringify(cyData),
        themeSettings,
      });
      setSaveStatus('success');
      lastSavedIdx.current = stateRef.current.historyIdx;
    } catch {
      setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [options, themeSettings, onOptionsChange]);

  const undo = useCallback(() => {
    if (!cyRef.current || state.historyIdx <= 0) return;
    const cy = cyRef.current;
    const prevIdx = state.historyIdx - 1;
    const str = state.history[prevIdx];
    cy.elements().remove();
    const els = JSON.parse(str);
    restoreIcons(els);
    cy.add(els);
    refreshMetrics(cy);
    updateState({ historyIdx: prevIdx });
  }, [state.history, state.historyIdx, refreshMetrics]);

  const redo = useCallback(() => {
    if (!cyRef.current || state.historyIdx >= state.history.length - 1) return;
    const cy = cyRef.current;
    const nextIdx = state.historyIdx + 1;
    const str = state.history[nextIdx];
    cy.elements().remove();
    const els = JSON.parse(str);
    restoreIcons(els);
    cy.add(els);
    refreshMetrics(cy);
    updateState({ historyIdx: nextIdx });
  }, [state.history, state.historyIdx, refreshMetrics]);

  const handleAddDeviceConfirm = useCallback(
    (
      deviceId: string,
      iconType: string,
      position?: { x: number; y: number },
      size?: string,
      alias?: string,
      customPing?: string,
      customLoss?: string,
      customLatency?: string
    ) => {
      if (!cyRef.current) return;

      const existing = cyRef.current.getElementById(deviceId);
      if (existing.length > 0) {
        setAlertMessage('Este dispositivo já está no mapa.');
        setShowAddModal(false);
        return;
      }

      const pos = position || { x: cyRef.current.width() / 2, y: cyRef.current.height() / 2 };
      const newNode: cytoscape.ElementDefinition = {
        group: 'nodes',
        data: {
          id: deviceId,
          alias: alias || '',
          iconType,
          nodeSize: size || 'medium',
          customPingItem: customPing || '',
          customLossItem: customLoss || '',
          customLatencyItem: customLatency || '',
        },
        position: pos,
      };
      restoreIcons([newNode]);
      cyRef.current.add(newNode);
      refreshMetrics(cyRef.current);
      pushHistory(cyRef.current);
      setShowAddModal(false);
    },
    [pushHistory, refreshMetrics]
  );

  const handleSaveEdge = (data: any) => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    if (state.editingEdgeId) {
      const edge = cy.getElementById(state.editingEdgeId);
      if (edge.length) {
        const linkId = edge.data('linkId') || edge.id();
        cy.edges(`[linkId = "${linkId}"]`).data(data);
        if (!edge.data('linkId')) {
          edge.data(data);
        }
        refreshMetrics(cy);
        pushHistory(cy);
      }
    } else if (state.sourceNodeId && state.targetNodeId) {
      const edgeId = `edge_${state.sourceNodeId}_${state.targetNodeId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      cy.add({
        group: 'edges',
        data: {
          id: edgeId,
          linkId: edgeId,
          source: state.sourceNodeId,
          target: state.targetNodeId,
          ...data,
        },
      });
      const srcNode = cy.getElementById(state.sourceNodeId);
      const tgtNode = cy.getElementById(state.targetNodeId);
      if (srcNode.length) srcNode.removeClass('selected');
      if (tgtNode.length) tgtNode.removeClass('selected');

      updateState({ sourceNodeId: null, targetNodeId: null, linkMode: false });
      refreshMetrics(cy);
      pushHistory(cy);
    }

    setShowEdgeModal(false);
    updateState({ editingEdgeId: null });
  };

  const cssStr = useMemo(() => {
    const dynamicCSS = `
      .noc-root { background-color: ${themeSettings.bgColor}; }
      .noc-canvas { background: radial-gradient(circle at center, ${themeSettings.bgColor} 0%, #000 100%); }
      .noc-sidebar { background-color: ${themeSettings.sidebarColor}; }
    `;
    return CSS + dynamicCSS;
  }, [themeSettings]);

  return (
    <div style={{ width, height }}>
      <style>{cssStr}</style>
      <div className="noc-root">
        <Sidebar
          editMode={state.editMode}
          linkMode={state.linkMode}
          zoomEnabled={state.zoomEnabled}
          saveStatus={saveStatus}
          historyIdx={state.historyIdx}
          historyLength={state.history.length}
          hasUnsavedChanges={state.historyIdx > 0 && state.historyIdx !== lastSavedIdx.current}
          t={t}
          onToggleEdit={() => {
            updateState({ editMode: !state.editMode, linkMode: false });
            setCtxMenu({ ...ctxMenu, visible: false });
          }}
          onToggleLink={() => updateState({ linkMode: !state.linkMode })}
          onToggleZoom={() => updateState({ zoomEnabled: !state.zoomEnabled })}
          onCenter={() => cyRef.current?.fit()}
          onSave={saveMap}
          onUndo={undo}
          onRedo={redo}
          onAddDevice={() => setShowAddModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
        />

        <div className={`noc-canvas ${state.linkMode ? 'link-mode-active' : ''}`}>
          <div ref={containerRef} className="noc-cy" style={{ cursor: state.linkMode ? 'crosshair' : 'default' }} />
          <Legend visible={true} t={t} />

          <ContextMenu
            ctxMenu={ctxMenu}
            editMode={state.editMode}
            t={t}
            onDetails={() => {
              if (ctxMenu.targetId && !ctxMenu.targetIsNode) {
                setInfoModal({
                  visible: true,
                  type: ctxMenu.targetIsNode ? 'node' : 'edge',
                  targetId: ctxMenu.targetId,
                });
              }
              setCtxMenu({ ...ctxMenu, visible: false });
            }}
            onEdit={() => {
              if (ctxMenu.targetIsNode) {
                if (ctxMenu.targetId.includes('anchor')) {
                  setCtxMenu({ ...ctxMenu, visible: false });
                  return;
                }
                updateState({
                  editingNodeId: ctxMenu.targetId,
                });
              } else {
                updateState({ editingEdgeId: ctxMenu.targetId });
                setSelectedEdgeData(cyRef.current!.getElementById(ctxMenu.targetId).data());
                setShowEdgeModal(true);
              }
              setCtxMenu({ ...ctxMenu, visible: false });
            }}
            onRemove={() => {
              if (ctxMenu.targetIsNode && ctxMenu.targetId.includes('anchor')) {
                const cy = cyRef.current;
                if (!cy) return;
                const anchorNode = cy.getElementById(ctxMenu.targetId);
                if (anchorNode.length) {
                  const connectedEdges = anchorNode.connectedEdges();
                  if (connectedEdges.length === 2) {
                    const edge1 = connectedEdges[0];
                    const edge2 = connectedEdges[1];
                    const src = edge1.data('source') === ctxMenu.targetId ? edge2.data('source') : edge1.data('source');
                    const tgt = edge1.data('target') === ctxMenu.targetId ? edge2.data('target') : edge1.data('target');

                    const edgeData = { ...edge1.data() };
                    delete edgeData.id;
                    delete edgeData.source;
                    delete edgeData.target;

                    cy.add({
                      group: 'edges',
                      data: {
                        id: `edge_${src}_${tgt}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                        source: src,
                        target: tgt,
                        ...edgeData,
                      },
                    });
                  }
                  anchorNode.remove();
                  pushHistory(cy);
                }
              } else {
                setDeleteConfirm({
                  visible: true,
                  targetId: ctxMenu.targetId,
                  name: cyRef.current?.getElementById(ctxMenu.targetId).data('label') || ctxMenu.targetId,
                });
              }
              setCtxMenu({ ...ctxMenu, visible: false });
            }}
            onAddAnchor={() => {
              const cy = cyRef.current;
              if (cy && !ctxMenu.targetIsNode) {
                const edge = cy.getElementById(ctxMenu.targetId);
                if (edge.length && ctxMenu.canvasPos) {
                  const src = edge.data('source');
                  const tgt = edge.data('target');
                  const edgeData = { ...edge.data() };
                  const linkId = edgeData.linkId || edge.id();

                  delete edgeData.id;
                  delete edgeData.source;
                  delete edgeData.target;
                  edgeData.linkId = linkId;

                  const anchorId = `anchor_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                  cy.add({
                    group: 'nodes',
                    data: { id: anchorId },
                    position: ctxMenu.canvasPos,
                    classes: 'anchor',
                  });

                  cy.add({
                    group: 'edges',
                    data: {
                      id: `edge_${src}_${anchorId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                      source: src,
                      target: anchorId,
                      ...edgeData,
                    },
                  });

                  cy.add({
                    group: 'edges',
                    data: {
                      id: `edge_${anchorId}_${tgt}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                      source: anchorId,
                      target: tgt,
                      ...edgeData,
                    },
                  });

                  edge.remove();
                  refreshMetrics(cy);
                  pushHistory(cy);
                }
                setCtxMenu({ ...ctxMenu, visible: false });
              }
            }}
          />
        </div>

        <AddDeviceModal
          visible={showAddModal}
          zabbixMetrics={zabbixMetrics}
          existingNodes={cyRef.current ? cyRef.current.nodes().map((n: any) => n.id()) : []}
          onClose={() => setShowAddModal(false)}
          onConfirm={handleAddDeviceConfirm}
          t={t}
        />

        <EditNodeModal
          cyNode={state.editingNodeId && cyRef.current ? cyRef.current.getElementById(state.editingNodeId) : null}
          zabbixMetrics={zabbixMetrics}
          existingNodes={cyRef.current ? cyRef.current.nodes().map((n: any) => n.id()) : []}
          onClose={() => updateState({ editingNodeId: null })}
          onSave={(newIcon, newSize, newAlias, newDeviceId, customPing, customLoss, customLatency) => {
            if (cyRef.current && state.editingNodeId) {
              const cy = cyRef.current;
              const node = cy.getElementById(state.editingNodeId);

              const nodeDataObj = { ...node.data() };
              nodeDataObj.iconType = newIcon;
              nodeDataObj.nodeSize = newSize;
              nodeDataObj.alias = newAlias;
              nodeDataObj.customPingItem = customPing;
              nodeDataObj.customLossItem = customLoss;
              nodeDataObj.customLatencyItem = customLatency;
              nodeDataObj.id = newDeviceId;

              restoreIcons([{ group: 'nodes', data: nodeDataObj }]);

              if (newDeviceId !== state.editingNodeId) {
                const pos = { ...node.position() };

                const q = [node];
                const toRemove = new Set<any>([node]);
                while (q.length > 0) {
                  const curr = q.shift();
                  if (curr) {
                    curr.connectedEdges().forEach((edge: any) => {
                      const src = edge.source();
                      const tgt = edge.target();
                      if (src.id() !== curr.id() && src.data('id').includes('anchor') && !toRemove.has(src)) {
                        toRemove.add(src);
                        q.push(src);
                      }
                      if (tgt.id() !== curr.id() && tgt.data('id').includes('anchor') && !toRemove.has(tgt)) {
                        toRemove.add(tgt);
                        q.push(tgt);
                      }
                    });
                  }
                }
                toRemove.forEach((n: any) => n.remove());

                cy.add({ group: 'nodes', data: nodeDataObj, position: pos });
              } else {
                node.data(nodeDataObj);
              }

              refreshMetrics(cy);
              pushHistory(cy);
            }
            updateState({ editingNodeId: null });
          }}
          t={t}
        />

        <EdgeModal
          visible={showEdgeModal}
          edgeData={selectedEdgeData}
          zabbixMetrics={zabbixMetrics}
          onClose={() => {
            updateState({ editingEdgeId: null });
            setShowEdgeModal(false);
          }}
          onSave={handleSaveEdge}
          t={t}
        />

        <InfoModal
          infoModal={infoModal}
          cyRef={cyRef}
          zabbixMetrics={zabbixMetrics}
          dataSeries={data.series}
          onClose={() => setInfoModal({ visible: false, type: 'node', targetId: '' })}
          t={t}
        />

        {duplicateAlert && (
          <div className="noc-modal-overlay">
            <div className="noc-modal-content" style={{ width: 350, textAlign: 'center' }}>
              <h3 className="noc-modal-title" style={{ color: '#f87171' }}>
                {t('accessDenied')}
              </h3>
              <p style={{ color: '#d1d5db', marginBottom: 20 }}>
                {t('connectionExists') || 'Já existe uma conexão entre esses componentes.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="noc-mod-btn confirm" onClick={() => setDuplicateAlert(false)}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {alertMessage && (
          <div className="noc-modal-overlay">
            <div className="noc-modal-content" style={{ width: 350, textAlign: 'center' }}>
              <h3 className="noc-modal-title" style={{ color: '#f87171' }}>
                Atenção
              </h3>
              <p style={{ color: '#d1d5db', marginBottom: 20 }}>{alertMessage}</p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="noc-mod-btn confirm" onClick={() => setAlertMessage(null)}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        <DeleteConfirmModal
          deleteConfirm={deleteConfirm}
          onClose={() => setDeleteConfirm({ visible: false, targetId: '', name: '' })}
          onConfirm={() => {
            if (cyRef.current) {
              const node = cyRef.current.getElementById(deleteConfirm.targetId);
              if (node.length) {
                const q = [node];
                const toRemove = new Set<any>([node]);
                while (q.length > 0) {
                  const curr = q.shift();
                  if (curr) {
                    curr.connectedEdges().forEach((edge: any) => {
                      const src = edge.source();
                      const tgt = edge.target();
                      if (src.id() !== curr.id() && src.data('id').includes('anchor') && !toRemove.has(src)) {
                        toRemove.add(src);
                        q.push(src);
                      }
                      if (tgt.id() !== curr.id() && tgt.data('id').includes('anchor') && !toRemove.has(tgt)) {
                        toRemove.add(tgt);
                        q.push(tgt);
                      }
                    });
                  }
                }
                toRemove.forEach((n: any) => n.remove());
              }
              pushHistory(cyRef.current);
            }
            setDeleteConfirm({ visible: false, targetId: '', name: '' });
          }}
          t={t}
        />

        <SettingsModal
          visible={showSettingsModal}
          themeSettings={themeSettings}
          setThemeSettings={(newSettings) => {
            setThemeSettings(newSettings);
            onOptionsChange({
              ...options,
              themeSettings: newSettings,
            });
          }}
          onClose={() => setShowSettingsModal(false)}
          t={t}
          onExportBackup={handleExportBackup}
          onImportBackup={handleImportBackup}
        />
      </div>
    </div>
  );
};
