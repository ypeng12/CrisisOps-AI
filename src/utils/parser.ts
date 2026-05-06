import { SystemState, Incident, Asset, Team, Location, Severity, RecommendedAction } from '../types';
import { Language } from './i18n';

export const generateId = () => Math.random().toString(36).substr(2, 9);

// Multi-Region Data Support
const REGIONS: Record<string, Record<string, [number, number]>> = {
  'LOS ANGELES': {
    'Westwood Village': [34.0628, -118.4414],
    'Santa Monica Pier': [34.0100, -118.4961],
    'Getty Center': [34.0770, -118.4740],
    'Century City': [34.0573, -118.4169]
  },
  'MARYLAND': {
    'UMD Campus Central': [38.9869, -76.9426],
    'College Park Metro': [38.9785, -76.9281],
    'Discovery District': [38.9750, -76.9200],
    'Xfinity Center': [38.9950, -76.9450]
  }
};

const REPORTERS = ['Unit 7-Alpha', 'Regional Dispatch', 'Smart City Sensor #09', 'Civic Report'];
const INCIDENTS = [
  { type: 'Structural Fire', keywords: ['fire', 'smoke', 'burning', '火', '烟', '燃烧'] },
  { type: 'Mass Casualty', keywords: ['medical', 'heart attack', 'injured', '医', '受伤', '心脏病'] },
  { type: 'Power Grid Failure', keywords: ['power', 'leak', 'electric', '电', '漏水', '断电'] },
  { type: 'Active Threat', keywords: ['shooter', 'gun', 'weapon', '枪', '武器', '暴力'] }
];

export const generateRandomScenario = (lang: Language): string => {
  const isZh = lang === 'zh';
  const regionNames = Object.keys(REGIONS);
  const regionName = regionNames[Math.floor(Math.random() * regionNames.length)];
  const locations = REGIONS[regionName];
  const locNames = Object.keys(locations);
  const loc = locNames[Math.floor(Math.random() * locNames.length)];
  
  const reporter = REPORTERS[Math.floor(Math.random() * REPORTERS.length)];
  const incident = INCIDENTS[Math.floor(Math.random() * INCIDENTS.length)];
  const time = new Date().toLocaleTimeString(isZh ? 'zh-CN' : 'en-US', { hour12: false });

  if (isZh) {
    return `[${time}] ${regionName} 调度中心收到来自 ${reporter} 的报告：在 ${loc} 附近发现 ${incident.type}。检测到 ${incident.keywords[1]} 迹象。正在同步该区域知识库。`;
  } else {
    return `[${time}] ${regionName} Ops received report from ${reporter}: ${incident.type} detected near ${loc}. ${incident.keywords[1]} signature confirmed. Syncing regional knowledge base.`;
  }
};

export const calculateSystemRisk = (state: Partial<SystemState>): number => {
  const SEVERITY_WEIGHTS = { 'Low': 10, 'Medium': 30, 'High': 60, 'Critical': 90 };
  const ASSET_STATUS_IMPACT = { 'Operational': 0, 'Degraded': 15, 'At Risk': 30, 'Offline': 50 };

  let risk = 0;
  if (state.incident) risk += SEVERITY_WEIGHTS[state.incident.severity] || 0;
  if (state.assets && state.assets.length > 0) {
    const assetRisk = state.assets.reduce((acc, asset) => acc + (ASSET_STATUS_IMPACT[asset.status] || 0), 0);
    risk += (assetRisk / state.assets.length);
  }
  if (state.location?.status === 'At Risk') risk += 20;
  return Math.min(100, Math.max(5, Math.round(risk)));
};

export const parseIncident = (text: string, lang: Language, _currentState?: SystemState): Partial<SystemState> => {
  const isZh = lang === 'zh';
  const lowerText = text.toLowerCase();
  
  const keywords = {
    fire: isZh ? ['火', '烟', '燃烧'] : ['fire', 'smoke', 'burning'],
    electric: isZh ? ['电', '电力', '断电'] : ['power', 'electric', 'outage'],
    medical: isZh ? ['伤', '医', '救助'] : ['injured', 'medical', 'hurt'],
    security: isZh ? ['枪', '武器', '暴力'] : ['shooter', 'gun', 'weapon']
  };

  const hasFire = keywords.fire.some(k => lowerText.includes(k));
  const hasMedical = keywords.medical.some(k => lowerText.includes(k));
  const hasSecurity = keywords.security.some(k => lowerText.includes(k));
  
  const severity: Severity = hasSecurity ? 'Critical' : (hasFire || hasMedical) ? 'High' : 'Medium';

  // Find Region and Location
  let matchedLocName = 'Global Node';
  let centerCoords: [number, number] = [34.0628, -118.4414];
  
  for (const region of Object.values(REGIONS)) {
    const found = Object.keys(region).find(l => lowerText.includes(l.toLowerCase()));
    if (found) {
      matchedLocName = found;
      centerCoords = region[found];
      break;
    }
  }

  const incident: Incident = {
    id: generateId(),
    type: hasSecurity ? (isZh ? '武装威胁' : 'Active Threat') : hasFire ? (isZh ? '大型火灾' : 'Structural Fire') : (isZh ? '遥测异常' : 'Telemetry Anomaly'),
    severity: severity,
    status: 'Triaged',
    description: text,
    timestamp: new Date().toISOString(),
    confidence: 0.96
  };

  const location: Location = { id: 'loc-dynamic', name: matchedLocName, coordinates: centerCoords, status: 'At Risk' };

  const assets: Asset[] = [
    { id: 'as-1', name: isZh ? '区域电力节点' : 'Regional Power Node', type: 'Infrastructure', status: 'Operational', coordinates: [centerCoords[0] + 0.002, centerCoords[1] - 0.002] },
    { id: 'as-2', name: isZh ? '应急通讯塔' : 'Comm Tower 07', type: 'Infrastructure', status: 'Operational', coordinates: [centerCoords[0] - 0.003, centerCoords[1] + 0.003] }
  ];

  const teams: Team[] = [
    { id: 'tm-1', name: isZh ? '特警响应组' : 'Tactical Response A', type: 'Security', status: 'Available', coordinates: [centerCoords[0] + 0.01, centerCoords[1] + 0.01] },
    { id: 'tm-2', name: isZh ? '移动医疗单元' : 'Mobile Medical-1', type: 'Medical', status: 'Available', coordinates: [centerCoords[0] - 0.01, centerCoords[1] - 0.01] }
  ];

  const actions: RecommendedAction[] = [
    {
      id: generateId(),
      title: isZh ? '同步区域 Ontology' : 'Sync Regional Ontology',
      reason: isZh ? `检测到新坐标点：${matchedLocName}。正在拉取本地实体关系图。` : `New coordinates detected at ${matchedLocName}. Fetching local entity graph.`,
      priority: severity,
      state: 'Pending',
      confidence: 0.98,
      evidence: [isZh ? "数据血缘：已从区域缓存中恢复本地资产地图。" : "Data Lineage: Local asset map recovered from regional cache."]
    }
  ];

  return { incident, location, assets, teams, actions };
};
