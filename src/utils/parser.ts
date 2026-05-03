import { SystemState, Incident, Asset, Team, Location, Severity, RecommendedAction } from '../types';
import { Language } from './i18n';

export const generateId = () => Math.random().toString(36).substr(2, 9);

// UMD Campus Data
const UMD_LOCATIONS: Record<string, [number, number]> = {
  'Iribe Center': [38.9912, -76.9370],
  'Stamp Student Union': [38.9880, -76.9448],
  'McKeldin Library': [38.9860, -76.9423],
  'Xfinity Center': [38.9954, -76.9415]
};

const REPORTERS = ['Officer Chen', 'Dispatcher Sarah', 'IoT Sensor #882', 'Citizen Report'];
const INCIDENTS = [
  { type: 'Fire / Safety', keywords: ['fire', 'smoke', 'burning', '火', '烟', '燃烧'] },
  { type: 'Medical Emergency', keywords: ['medical', 'heart attack', 'injured', '医', '受伤', '心脏病'] },
  { type: 'Infrastructure Failure', keywords: ['power', 'leak', 'electric', '电', '漏水', '断电'] },
  { type: 'Security Threat', keywords: ['shooter', 'gun', 'weapon', '枪', '武器', '暴力'] }
];

export const generateRandomScenario = (lang: Language): string => {
  const isZh = lang === 'zh';
  const locNames = Object.keys(UMD_LOCATIONS);
  const loc = locNames[Math.floor(Math.random() * locNames.length)];
  const reporter = REPORTERS[Math.floor(Math.random() * REPORTERS.length)];
  const incident = INCIDENTS[Math.floor(Math.random() * INCIDENTS.length)];
  const time = new Date().toLocaleTimeString(isZh ? 'zh-CN' : 'en-US', { hour12: false });

  if (isZh) {
    return `[${time}] 来自 ${reporter} 的报告：在 ${loc} 附近发现 ${incident.type} 情况。具体表现为 ${incident.keywords[1]}。现场情况复杂，需要立即介入。`;
  } else {
    return `[${time}] Report from ${reporter}: ${incident.type} detected near ${loc}. Evidence of ${incident.keywords[1]} observed. Situation is evolving, urgent response required.`;
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
  if (state.location?.status === 'Restricted') risk -= 15; 
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
  const hasCrowd = keywords.crowd.some(k => text.toLowerCase().includes(k));
  const hasSecurity = keywords.security.some(k => text.toLowerCase().includes(k));
  
  const severity: Severity = hasSecurity ? 'Critical' : (hasFire && hasCrowd) || hasMedical ? 'High' : (hasFire || hasElectric) ? 'High' : 'Medium';

  const matchedLocName = Object.keys(UMD_LOCATIONS).find(l => text.toLowerCase().includes(l.toLowerCase())) || 'Iribe Center';
  const centerCoords = UMD_LOCATIONS[matchedLocName];

  const incident: Incident = {
    id: generateId(),
    type: hasSecurity ? (isZh ? '安全威胁 / 枪击' : 'Security Threat / Shooting') : hasFire ? (isZh ? '火灾 / 安全风险' : 'Fire / Safety Risk') : (isZh ? '一般事故' : 'General Incident'),
    severity: severity,
    status: 'Triaged',
    description: text,
    timestamp: new Date().toISOString(),
    confidence: 0.92
  };

  const location: Location = {
    id: 'loc-1',
    name: matchedLocName,
    coordinates: centerCoords,
    status: 'At Risk'
  };

  const assets: Asset[] = [
    { id: 'as-1', name: isZh ? '区域电力节点' : 'Area Power Node', type: 'Infrastructure', status: hasElectric ? 'Degraded' : 'Operational', coordinates: [centerCoords[0] + 0.0012, centerCoords[1] - 0.0008] },
    { id: 'as-3', name: isZh ? '主要避难点' : 'Primary Evac Point', type: 'Safety', status: hasFire ? 'At Risk' : 'Operational', coordinates: [centerCoords[0] - 0.0008, centerCoords[1] + 0.0015] }
  ];

  const teams: Team[] = [
    { id: 'tm-1', name: isZh ? '校警 402 号车' : 'Campus Safety #402', type: 'Security', status: 'Available', coordinates: [38.995, -76.940] },
    { id: 'tm-2', name: isZh ? '消防队 12 号' : 'Fire Engine #12', type: 'Fire', status: hasFire ? 'En Route' : 'Available', coordinates: [38.985, -76.935] },
    { id: 'tm-3', name: isZh ? '救护车 A-1' : 'Ambulance A-1', type: 'Medical', status: hasMedical ? 'En Route' : 'Available', coordinates: [38.992, -76.945] }
  ];

  const actions: RecommendedAction[] = [];

  if (hasSecurity) {
    actions.push({
      id: generateId(),
      title: isZh ? '实施区域封锁' : 'Execute Area Lockdown',
      reason: isZh ? `基于 ${matchedLocName} 的持械报告。` : `Based on weapon report at ${matchedLocName}.`,
      priority: 'Critical',
      state: 'Pending',
      confidence: 0.98,
      evidence: [isZh ? "部署：校警车从北区巡逻站出发，建议沿 Paint Branch Dr 拦截。" : "Deployment: Units from North Station, route via Paint Branch Dr for intercept."]
    });
  }

  if (hasFire) {
    actions.push({
      id: generateId(),
      title: isZh ? '全员疏散至避难点' : 'Evacuate to Safety Point',
      reason: isZh ? '火势有蔓延至电力节点的风险。' : 'Risk of fire spreading to Power Node.',
      priority: 'High',
      state: 'Pending',
      confidence: 0.94,
      evidence: [isZh ? `部署：疏散指引已同步至数字沙盘。避难点设在 ${matchedLocName} 西侧 200 米。` : `Deployment: Evac routes synced to HUD. Safety point 200m West of ${matchedLocName}.`]
    });
  }

  if (hasMedical || severity === 'Critical') {
    actions.push({
      id: generateId(),
      title: isZh ? '优先调度医疗支援' : 'Priority Medical Dispatch',
      reason: isZh ? '报告中提及有人员受伤。' : 'Injuries reported in the field.',
      priority: 'High',
      state: 'Pending',
      confidence: 0.96,
      evidence: [isZh ? "部署：A-1 救护车建议从 University Blvd 入口进入以避开拥堵。" : "Deployment: Ambulance A-1 advised to enter via University Blvd to avoid traffic."]
    });
  }

  // Fallback default action
  if (actions.length === 0) {
    actions.push({
      id: generateId(),
      title: isZh ? '派遣现场勘察小组' : 'Dispatch Survey Team',
      reason: isZh ? '需要进一步确认现场受损资产。' : 'Field assessment required for asset integrity.',
      priority: 'Medium',
      state: 'Pending',
      confidence: 0.88,
      evidence: [isZh ? "部署：建议从最近的警务站派遣步行巡逻小组。" : "Deployment: Dispatch foot patrol from nearest substation."]
    });
  }

  return { incident, location, assets, teams, actions };
};
