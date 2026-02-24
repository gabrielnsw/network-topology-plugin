import { useCallback } from 'react';

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  'pt-br': {
    edit: 'Editar', remove: 'Remover', cancel: 'Cancelar', confirm: 'Confirmar', save: 'Salvar', close: 'Fechar',
    editMode: 'Ativar/Desativar Edição', zoom: 'Ativar/Desativar Zoom', center: 'Centralizar Mapa', settings: 'Configurações',
    addDevice: 'Adicionar Dispositivo', linkMode: 'Modo Link', saveMap: 'Salvar Mapa', undo: 'Desfazer', redo: 'Refazer',
    confirmDelete: 'Confirmar Exclusão', confirmDeleteMsg: 'Tem certeza que deseja remover',
    details: 'Detalhes', equipment: 'Equipamento', connection: 'Conexão',
    name: 'Nome', origin: 'Origem', destination: 'Destino', monitoredIface: 'Interface Monitorada',
    onHost: 'no host', connectionMetrics: 'Métricas da Conexão', noData: 'Sem dados disponíveis',
    mappedIfaces: 'Interfaces Mapeadas', zabbixPreview: 'Métricas Zabbix (Preview)', others: 'outras',
    noTraffic: 'Sem tráfego registrado', trafficHistory: 'Histórico de Tráfego', loading: 'Carregando...',
    noHistory: 'Sem histórico disponível', last30: 'Últimos 30 pontos',
    themeSettings: 'Configurações de Tema', bgColor: 'Cor de Fundo da Topologia', sidebarColorLabel: 'Cor do Menu Lateral',
    nodeBgColorLabel: 'Cor de Fundo dos Hosts', edgeColorLabel: 'Cor Padrão das Conexões',
    languageLabel: 'Idioma', restoreDefault: 'Restaurar Padrão',
    addAnchor: 'Adicionar Âncora', removeAnchor: 'Remover Âncora', anchor: 'Âncora',
    lineStyle: 'Estilo da Linha', lineWidth: 'Espessura',
    searchDevice: 'Buscar dispositivo...', selectDevice: 'Selecione...', mainDevice: 'Dispositivo Principal',
    interface: 'Interface', edgeConfig: 'Configurar Conexão',
    connectionExists: 'Já existe uma conexão entre esses hosts',
    accessDenied: 'Acesso Negado', ip: 'IP', ping: 'Ping', loss: 'Perda', unmonitoredConn: 'Conexão não monitorada pelo Zabbix', max: 'Max',
    editDevice: 'Editar Equipamento', newIcon: 'Novo Ícone', iconSize: 'Tamanho do Ícone', aliasOptional: 'Apelido (Opcional)',
    metricsToShow: 'Métricas para exibir no link', chooseDevice: 'Selecione o Dispositivo', noDeviceFound: 'Nenhum dispositivo encontrado',
    deviceIcon: 'Ícone do Dispositivo', visualSize: 'Tamanho Visual', operational: 'Operacional', lossAlert: 'Perda / Alerta',
    offline: 'Offline', noDataLegend: 'Sem Dados', portuguese: 'Português (Brasil)', english: 'English', spanish: 'Español',
    latency: 'Latência', formatBits: 'Formatar Bitrate (Kbps/Mbps/Gbps)', customPing: 'Item de Ping', customLatency: 'Item de Latência', customLoss: 'Item de Perda', warnHostChange: 'Aviso: Mudar o Host irá destruir todos os links e âncoras conectadas ao mesmo. Deseja continuar?',
    icon_router: 'Roteador', icon_server: 'Servidor', icon_switch: 'Switch', icon_cgnat: 'CGNAT', icon_olt: 'OLT', icon_db: 'Banco de Dados', icon_camera: 'Câmera', icon_vm: 'Máquina Virtual', icon_firewall: 'Firewall', icon_retificadora: 'Retificadora', icon_impressora: 'Impressora',
    exportBackup: 'Exportar Backup (JSON)', importBackup: 'Restaurar Backup (JSON)'
  },
  'en': {
    edit: 'Edit', remove: 'Remove', cancel: 'Cancel', confirm: 'Confirm', save: 'Save', close: 'Close',
    editMode: 'Toggle Edit Mode', zoom: 'Toggle Zoom', center: 'Center Map', settings: 'Settings',
    addDevice: 'Add Device', linkMode: 'Link Mode', saveMap: 'Save Map', undo: 'Undo', redo: 'Redo',
    confirmDelete: 'Confirm Deletion', confirmDeleteMsg: 'Are you sure you want to remove',
    details: 'Details', equipment: 'Equipment', connection: 'Connection',
    name: 'Name', origin: 'Origin', destination: 'Destination', monitoredIface: 'Monitored Interface',
    onHost: 'on host', connectionMetrics: 'Connection Metrics', noData: 'No data available',
    mappedIfaces: 'Mapped Interfaces', zabbixPreview: 'Zabbix Metrics (Preview)', others: 'others',
    noTraffic: 'No traffic recorded', trafficHistory: 'Traffic History', loading: 'Loading...',
    noHistory: 'No history available', last30: 'Last 30 points',
    themeSettings: 'Theme Settings', bgColor: 'Topology Background Color', sidebarColorLabel: 'Sidebar Color',
    nodeBgColorLabel: 'Host Background Color', edgeColorLabel: 'Default Edge Color',
    languageLabel: 'Language', restoreDefault: 'Restore Default',
    addAnchor: 'Add Anchor', removeAnchor: 'Remove Anchor', anchor: 'Anchor',
    lineStyle: 'Line Style', lineWidth: 'Width',
    searchDevice: 'Search device...', selectDevice: 'Select...', mainDevice: 'Main Device',
    interface: 'Interface', edgeConfig: 'Configure Connection',
    connectionExists: 'A connection already exists between these hosts',
    accessDenied: 'Access Denied', ip: 'IP', ping: 'Ping', loss: 'Loss', unmonitoredConn: 'Connection not monitored by Zabbix', max: 'Max',
    editDevice: 'Edit Device', newIcon: 'New Icon', iconSize: 'Icon Size', aliasOptional: 'Alias (Optional)',
    metricsToShow: 'Metrics to show on link', chooseDevice: 'Select the Device', noDeviceFound: 'No device found',
    deviceIcon: 'Device Icon', visualSize: 'Visual Size', operational: 'Operational', lossAlert: 'Loss / Alert',
    offline: 'Offline', noDataLegend: 'No Data', portuguese: 'Português (Brasil)', english: 'English', spanish: 'Español',
    latency: 'Latency', formatBits: 'Format Bitrate (Kbps/Mbps/Gbps)', customPing: 'Ping Item', customLatency: 'Latency Item', customLoss: 'Loss Item', warnHostChange: 'Warning: Changing the Host will wipe all connected links and anchors. Continue?',
    icon_router: 'Router', icon_server: 'Server', icon_switch: 'Switch', icon_cgnat: 'CGNAT', icon_olt: 'OLT', icon_db: 'Database', icon_camera: 'Camera', icon_vm: 'Virtual Machine', icon_firewall: 'Firewall', icon_retificadora: 'Rectifier', icon_impressora: 'Printer',
    exportBackup: 'Export Backup (JSON)', importBackup: 'Restore Backup (JSON)'
  },
  'es': {
    edit: 'Editar', remove: 'Eliminar', cancel: 'Cancelar', confirm: 'Confirmar', save: 'Guardar', close: 'Cerrar',
    editMode: 'Activar/Desactivar Edición', zoom: 'Activar/Desactivar Zoom', center: 'Centrar Mapa', settings: 'Configuración',
    addDevice: 'Agregar Dispositivo', linkMode: 'Modo Enlace', saveMap: 'Guardar Mapa', undo: 'Deshacer', redo: 'Rehacer',
    confirmDelete: 'Confirmar Eliminación', confirmDeleteMsg: '¿Estás seguro de que deseas eliminar',
    details: 'Detalles', equipment: 'Equipo', connection: 'Conexión',
    name: 'Nombre', origin: 'Origen', destination: 'Destino', monitoredIface: 'Interfaz Monitoreada',
    onHost: 'en host', connectionMetrics: 'Métricas de Conexión', noData: 'Sin datos disponibles',
    mappedIfaces: 'Interfaces Mapeadas', zabbixPreview: 'Métricas Zabbix (Vista previa)', others: 'otras',
    noTraffic: 'Sin tráfico registrado', trafficHistory: 'Historial de Tráfico', loading: 'Cargando...',
    noHistory: 'Sin historial disponible', last30: 'Últimos 30 puntos',
    themeSettings: 'Configuración de Tema', bgColor: 'Color de Fondo de Topología', sidebarColorLabel: 'Color de Barra Lateral',
    nodeBgColorLabel: 'Color de Fondo de Hosts', edgeColorLabel: 'Color Predeterminado de Conexiones',
    languageLabel: 'Idioma', restoreDefault: 'Restaurar Predeterminado',
    addAnchor: 'Agregar Ancla', removeAnchor: 'Eliminar Ancla', anchor: 'Ancla',
    lineStyle: 'Estilo de Línea', lineWidth: 'Grosor',
    searchDevice: 'Buscar dispositivo...', selectDevice: 'Seleccionar...', mainDevice: 'Dispositivo Principal',
    interface: 'Interfaz', edgeConfig: 'Configurar Conexión',
    connectionExists: 'Ya existe una conexión entre estos hosts',
    accessDenied: 'Acceso Denegado', ip: 'IP', ping: 'Ping', loss: 'Pérdida', unmonitoredConn: 'Conexión no monitoreada por Zabbix', max: 'Max',
    editDevice: 'Editar Dispositivo', newIcon: 'Nuevo Icono', iconSize: 'Tamaño del Icono', aliasOptional: 'Alias (Opcional)',
    metricsToShow: 'Métricas para mostrar en el enlace', chooseDevice: 'Seleccione el Dispositivo', noDeviceFound: 'Ningún dispositivo encontrado',
    deviceIcon: 'Icono del Dispositivo', visualSize: 'Tamaño Visual', operational: 'Operativo', lossAlert: 'Pérdida / Alerta',
    offline: 'Desconectado', noDataLegend: 'Sin Datos', portuguese: 'Português (Brasil)', english: 'English', spanish: 'Español',
    latency: 'Latencia', formatBits: 'Formato de Bitrate (Kbps/Mbps/Gbps)', customPing: 'Ítem de Ping', customLatency: 'Ítem de Latencia', customLoss: 'Ítem de Pérdida', warnHostChange: 'Advertencia: Cambiar el host eliminará todos los enlaces y anclas conectados. ¿Continuar?',
    icon_router: 'Enrutador', icon_server: 'Servidor', icon_switch: 'Switch', icon_cgnat: 'CGNAT', icon_olt: 'OLT', icon_db: 'Base de Datos', icon_camera: 'Cámara', icon_vm: 'Máquina Virtual', icon_firewall: 'Cortafuegos', icon_retificadora: 'Rectificador', icon_impressora: 'Impresora',
    exportBackup: 'Exportar Copia (JSON)', importBackup: 'Restaurar Copia (JSON)'
  },
};

export const useTranslation = (language: string | undefined) => {
  return useCallback(
    (key: string) => {
      const lang = language || 'pt-br';
      return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['pt-br']?.[key] || key;
    },
    [language]
  );
};

