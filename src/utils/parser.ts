import { SystemState, Incident, Asset, Team, Location, Severity } from '../types';
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

// Risk Scoring Matrix
const SEVERITY_WEIGHTS = {
  'Low': 10,
  'Medium': 30,
  'High': 60,
  'Critical': 90
};

const ASSET_STATUS_IMPACT = {
  'Operational': 0,
  'Degraded': 15,
  'At Risk': 30,
  'Offline': 50
};

export const calculateSystemRisk = (state: Partial<SystemState>): number => {
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
  if (state.location?.status === 'Restricted') risk -= 10; 
  if (state.teams) {
    const assignedTeams = state.teams.filter(t => t.status === 'Assigned' || t.status === 'En Route').length;
    risk -= (assignedTeams * 12); 
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
    { id: 'as-1', name: isZh ? '区域电力系统' : 'Area power system', type: 'Infrastructure', status: hasElectric ? 'Degraded' : 'Operational', coordinates: [centerCoords[0] + 0.001, centerCoords[1] - 0.001] },
    { id: 'as-3', name: isZh ? '紧急避难区' : 'Evacuation area', type: 'Safety', status: hasFire ? 'At Risk' : 'Operational', coordinates: [centerCoords[0] - 0.001, centerCoords[1] + 0.002] }
  ];

  const teams: Team[] = [
    { id: 'tm-1', name: isZh ? '校警队' : 'Campus Safety', status: 'Available', coordinates: [38.995, -76.940] },
    { id: 'tm-2', name: isZh ? '消防应急队' : 'Fire Response', status: hasFire ? 'En Route' : 'Available', coordinates: [38.985, -76.935] },
    { id: 'tm-3', name: isZh ? '医疗支援' : 'Medical Support', status: hasMedical ? 'En Route' : 'Available', coordinates: [38.992, -76.945] }
  ];

  const actions = [
    {
      id: generateId(),
      title: hasSecurity ? (isZh ? '启动封锁协议' : 'Initiate Lockdown') : (isZh ? '派遣第一响应小组' : 'Dispatch First Response'),
      reason: hasSecurity ? (isZh ? '报告发现武器。' : 'Weapon reported in vicinity.') : (isZh ? '基于实时报案描述，需要现场勘察。' : 'Based on initial report description, immediate field survey required.'),
      priority: hasSecurity ? 'Critical' : 'High' as Severity,
      state: 'Pending' as const,
      confidence: 0.98,
      evidence: [text.substring(0, 30) + "..."]
    }
  ];

  return {
    incident,
    location,
    assets,
    teams,
    actions
  };
};
