import { SystemState } from '../types';
import { Language } from './i18n';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const parseIncident = (text: string, lang: Language = 'en', currentState?: SystemState): Partial<SystemState> => {
  const lowerText = text.toLowerCase();
  const isZh = lang === 'zh';
  
  // Simulated escalation / Second report
  if (lowerText.includes('spreading') || lowerText.includes('east entrance') || lowerText.includes('crowd') || 
      lowerText.includes('扩散') || lowerText.includes('东门') || lowerText.includes('聚集')) {
    return {
      incident: {
        id: currentState?.incident?.id || generateId(),
        type: isZh ? '火灾 / 电气风险' : 'Fire / Electrical Risk',
        severity: 'Critical',
        status: 'Escalated',
        confidence: 0.95,
      },
      location: {
        id: currentState?.location?.id || generateId(),
        name: isZh ? 'Iribe 中心' : 'Iribe Center',
        type: isZh ? '校园建筑' : 'Campus Building',
        status: 'Restricted',
      },
      assets: [
        { id: generateId(), name: isZh ? 'Iribe 中心电力系统' : 'Iribe Center power system', type: 'Infrastructure', status: 'Offline' },
        { id: generateId(), name: isZh ? '东门入口' : 'East Entrance', type: 'Access Route', status: 'Degraded' },
        { id: generateId(), name: isZh ? '学生疏散区' : 'Student evacuation area', type: 'Zone', status: 'At Risk' },
      ],
      teams: [
        { id: generateId(), name: isZh ? '校园安保队' : 'Campus Safety', status: 'Assigned' },
        { id: generateId(), name: isZh ? '消防应急队' : 'Fire Response', status: 'En Route' },
        { id: generateId(), name: isZh ? '医疗支援' : 'Medical Support', status: 'Available' },
      ],
      actions: [
        {
          id: generateId(),
          title: isZh ? '升级消防响应级别' : 'Escalate Fire Response',
          priority: 'Critical',
          reason: isZh ? '火势扩散至公共入口，面临失控风险。' : 'Smoke spreading to public entrances, high risk of containment failure.',
          evidence: [isZh ? '"火势正向东门扩散"' : '"smoke spreading to the east entrance"'],
          confidence: 0.98,
          state: 'Pending'
        },
        {
          id: generateId(),
          title: isZh ? '请求医疗组待命' : 'Request Medical Standby',
          priority: 'High',
          reason: isZh ? '人群聚集，存在吸入性损伤风险。' : 'Crowd forming and potential for inhalation injuries.',
          evidence: [isZh ? '"建筑外有大量人群聚集"' : '"Crowd forming outside"'],
          confidence: 0.85,
          state: 'Pending'
        },
        {
          id: generateId(),
          title: isZh ? '限制建筑进入权限' : 'Restrict Building Access',
          priority: 'Critical',
          reason: isZh ? '防止人员在火灾期间进入危险区域。' : 'Prevent entry during active fire event.',
          evidence: [isZh ? '"火势正向东门扩散"' : '"smoke spreading to the east entrance"'],
          confidence: 0.99,
          state: 'Pending'
        }
      ]
    };
  }

  // Initial report
  if (lowerText.includes('smoke') || lowerText.includes('power') || lowerText.includes('烟') || lowerText.includes('停电')) {
    return {
      incident: {
        id: generateId(),
        type: isZh ? '火灾 / 电气风险' : 'Fire / Electrical Risk',
        severity: 'High',
        status: 'Triaged',
        confidence: 0.91,
      },
      location: {
        id: generateId(),
        name: isZh ? 'Iribe 中心' : 'Iribe Center',
        type: isZh ? '校园建筑' : 'Campus Building',
        status: 'At Risk',
      },
      assets: [
        { id: generateId(), name: isZh ? 'Iribe 中心电力系统' : 'Iribe Center power system', type: 'Infrastructure', status: 'Degraded' },
        { id: generateId(), name: isZh ? '教室区域' : 'Classrooms', type: 'Facilities', status: 'Offline' },
        { id: generateId(), name: isZh ? '学生疏散区' : 'Student evacuation area', type: 'Zone', status: 'Operational' },
      ],
      teams: [
        { id: generateId(), name: isZh ? '校园安保队' : 'Campus Safety', status: 'Available' },
        { id: generateId(), name: isZh ? '后勤设施组' : 'Facilities', status: 'Available' },
      ],
      actions: [
        {
          id: generateId(),
          title: isZh ? '派遣校园安保队' : 'Dispatch Campus Safety',
          priority: 'High',
          reason: isZh ? '目击建筑附近有浓烟。' : 'Visual confirmation of smoke near occupied building.',
          evidence: [isZh ? '"Iribe中心附近发现浓烟"' : '"Smoke reported near Iribe Center"'],
          confidence: 0.94,
          state: 'Pending'
        },
        {
          id: generateId(),
          title: isZh ? '通知后勤设施组' : 'Notify Facilities',
          priority: 'Medium',
          reason: isZh ? '多个房间电力中断，需要立即评估。' : 'Power loss in multiple rooms requires immediate assessment.',
          evidence: [isZh ? '"两间教室电力中断"' : '"Two classrooms lost power"'],
          confidence: 0.88,
          state: 'Pending'
        }
      ]
    };
  }

  return {};
};
