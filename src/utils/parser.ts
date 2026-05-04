import { SystemState, Incident, Asset, Team, Location, Severity, RecommendedAction } from '../types';
import { Language } from './i18n';

export const generateId = () => Math.random().toString(36).substr(2, 9);

// Los Angeles - Westwood / UCLA Area Data (Expansion)
const LA_LOCATIONS: Record<string, [number, number]> = {
  'Westwood Village': [34.0628, -118.4414],
  'Santa Monica Pier': [34.0100, -118.4961],
  'Getty Center': [34.0770, -118.4740],
  'Century City': [34.0573, -118.4169]
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
  const locNames = Object.keys(LA_LOCATIONS);
  const loc = locNames[Math.floor(Math.random() * locNames.length)];
  const reporter = REPORTERS[Math.floor(Math.random() * REPORTERS.length)];
  const incident = INCIDENTS[Math.floor(Math.random() * INCIDENTS.length)];
  const time = new Date().toLocaleTimeString(isZh ? 'zh-CN' : 'en-US', { hour12: false });

  if (isZh) {
    return `[${time}] 洛杉矶调度中心收到 ${reporter} 报告：在 ${loc} 附近发现 ${incident.type} 情况。具体表现为 ${incident.keywords[1]}。知识库已同步，建议立即部署。`;
  } else {
    return `[${time}] LA Dispatch from ${reporter}: ${incident.type} detected near ${loc}. Evidence of ${incident.keywords[1]} observed. Knowledge base synced, initiating response.`;
  }
};

export const calculateSystemRisk = (state: Partial<SystemState>): number => {
  const SEVERITY_WEIGHTS = { 'Low': 10, 'Medium': 30, 'High': 60, 'Critical': 90 };
  const ASSET_STATUS_IMPACT = { 'Operational': 0, 'Degraded': 15, 'At Risk': 30, 'Offline': 50 };

  let risk = 0;
  if (state.incident) {
    risk += SEVERITY_WEIGHTS[state.incident.severity] || 0;
  }
  if (state.assets && state.assets.length > 0) {
    const assetRisk = state.assets.reduce((acc, asset) => 
      acc + (ASSET_STATUS_IMPACT[asset.status] || 0), 0);
    risk += (assetRisk / state.assets.length);
  }
  if (state.location?.status === 'At Risk') risk += 20;
  if (state.teams) {
    const assignedTeams = state.teams.filter(t => t.status === 'Assigned' || t.status === 'En Route').length;
    risk -= (assignedTeams * 15); 
  }
  return Math.min(100, Math.max(5, Math.round(risk)));
};

export const parseIncident = (text: string, lang: Language, _currentState?: SystemState): Partial<SystemState> => {
  const isZh = lang === 'zh';
  
  const keywords = {
    fire: isZh ? ['火', '烟', '燃烧'] : ['fire', 'smoke', 'burning'],
    electric: isZh ? ['电', '电力', '断电'] : ['power', 'electric', 'outage'],
    medical: isZh ? ['伤', '医', '救助'] : ['injured', 'medical', 'hurt'],
    crowd: isZh ? ['人', '聚集', '疏散'] : ['crowd', 'people', 'evacuate'],
    security: isZh ? ['枪', '武器', '暴力'] : ['shooter', 'gun', 'weapon']
  };

  const hasFire = keywords.fire.some(k => text.toLowerCase().includes(k));
  const hasElectric = keywords.electric.some(k => text.toLowerCase().includes(k));
  const hasMedical = keywords.medical.some(k => text.toLowerCase().includes(k));
  const hasSecurity = keywords.security.some(k => text.toLowerCase().includes(k));
  
  const severity: Severity = hasSecurity ? 'Critical' : (hasFire || hasMedical) ? 'High' : 'Medium';

  const matchedLocName = Object.keys(LA_LOCATIONS).find(l => text.toLowerCase().includes(l.toLowerCase())) || 'Westwood Village';
  const centerCoords = LA_LOCATIONS[matchedLocName];

  const incident: Incident = {
    id: generateId(),
    type: hasSecurity ? (isZh ? '武装威胁' : 'Active Threat') : hasFire ? (isZh ? '大型火灾' : 'Structural Fire') : (isZh ? '区域事故' : 'Regional Incident'),
    severity: severity,
    status: 'Triaged',
    description: text,
    timestamp: new Date().toISOString(),
    confidence: 0.94
  };

  const location: Location = {
    id: 'loc-la',
    name: matchedLocName,
    coordinates: centerCoords,
    status: 'At Risk'
  };

  const assets: Asset[] = [
    { id: 'as-1', name: isZh ? '区域配电中心' : 'LA Substation Grid', type: 'Infrastructure', status: hasElectric ? 'Degraded' : 'Operational', coordinates: [centerCoords[0] + 0.005, centerCoords[1] - 0.003] },
    { id: 'as-2', name: isZh ? '主要交通枢纽' : 'Metro Transit Hub', type: 'Transport', status: 'Operational', coordinates: [centerCoords[0] - 0.004, centerCoords[1] + 0.002] }
  ];

  const teams: Team[] = [
    { id: 'tm-1', name: isZh ? '洛杉矶特警 A-01' : 'LAPD SWAT A-01', type: 'Security', status: 'Available', coordinates: [34.05, -118.42] },
    { id: 'tm-2', name: isZh ? '洛杉矶消防机动队' : 'LAFD Engine Group', type: 'Fire', status: hasFire ? 'En Route' : 'Available', coordinates: [34.07, -118.45] },
    { id: 'tm-3', name: isZh ? '市医疗直升机' : 'LifeFlight-1', type: 'Medical', status: hasMedical ? 'En Route' : 'Available', coordinates: [34.04, -118.48] }
  ];

  const actions: RecommendedAction[] = [
    {
      id: generateId(),
      title: isZh ? '建立区域安全警戒线' : 'Establish Tactical Perimeter',
      reason: isZh ? `基于知识库对 ${matchedLocName} 人流量的预测。` : `Based on KB predictions for ${matchedLocName} foot traffic.`,
      priority: severity,
      state: 'Pending',
      confidence: 0.97,
      evidence: [isZh ? "路由路径：已从云端缓存同步该区域建筑物蓝图。" : "Routing Path: Building blueprints synced from cloud cache."]
    }
  ];

  return { incident, location, assets, teams, actions };
};
