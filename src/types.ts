export interface SimpleOptions {
  topologyData?: string;
  themeSettings?: ThemeSettings;
}

export interface ThemeSettings {
  bgColor: string;
  sidebarColor: string;
  nodeBgColor: string;
  edgeColor: string;
  language: string;
}

export interface TopoState {
  editMode: boolean;
  linkMode: boolean;
  zoomEnabled: boolean;
  sourceNodeId: string | null;
  targetNodeId: string | null;
  editingEdgeId: string | null;
  editingNodeId: string | null;
  history: string[];
  historyIdx: number;
  selectedIcon: string;
  isFetching: boolean;
}

export interface CtxMenu {
  visible: boolean;
  x: number;
  y: number;
  canvasPos: { x: number; y: number } | null;
  targetId: string;
  targetIsNode: boolean;
}

export interface InfoModalData {
  visible: boolean;
  type: 'node' | 'edge';
  targetId: string;
}

export interface DeleteConfirmData {
  visible: boolean;
  targetId: string;
  name: string;
}

export interface EdgeMetric {
  name: string;
  icon: string;
  enabled: boolean;
}

export interface ZabbixInterfaceMetric {
  value: number | string;
  units: string;
  itemid: string;
}

export interface ZabbixInterfaceData {
  [metricName: string]: ZabbixInterfaceMetric;
}

export interface ZabbixHost {
  name: string;
  ip: string;
  ping: number | string;
  loss: number | string;
  latency: number | string;
  interfaces: Record<string, ZabbixInterfaceData>;
  items: Record<string, number | string>;
}

export interface TrafficPoint {
  clock: number;
  tx: number;
  rx: number;
}
