import { SystemState, RecommendedAction, LogEntry } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const parseIncident = (text: string, currentState?: SystemState): Partial<SystemState> => {
  const lowerText = text.toLowerCase();
  
  // Simulated escalation / Second report
  if (lowerText.includes('spreading') || lowerText.includes('east entrance') || lowerText.includes('crowd')) {
    return {
      incident: {
        id: currentState?.incident?.id || generateId(),
        type: 'Fire / Electrical Risk',
        severity: 'Critical',
        status: 'Escalated',
        confidence: 0.95,
      },
      location: {
        id: currentState?.location?.id || generateId(),
        name: 'Iribe Center',
        type: 'Campus Building',
        status: 'Restricted',
      },
      assets: [
        { id: generateId(), name: 'Iribe Center power system', type: 'Infrastructure', status: 'Offline' },
        { id: generateId(), name: 'East Entrance', type: 'Access Route', status: 'Degraded' },
        { id: generateId(), name: 'Student evacuation area', type: 'Zone', status: 'At Risk' },
      ],
      teams: [
        { id: generateId(), name: 'Campus Safety', status: 'Assigned' },
        { id: generateId(), name: 'Fire Response', status: 'En Route' },
        { id: generateId(), name: 'Medical Support', status: 'Available' },
      ],
      actions: [
        {
          id: generateId(),
          title: 'Escalate Fire Response',
          priority: 'Critical',
          reason: 'Smoke spreading to public entrances, high risk of containment failure.',
          evidence: ['"smoke spreading to the east entrance"'],
          confidence: 0.98,
          state: 'Pending'
        },
        {
          id: generateId(),
          title: 'Request Medical Standby',
          priority: 'High',
          reason: 'Crowd forming and potential for inhalation injuries.',
          evidence: ['"Crowd forming outside"'],
          confidence: 0.85,
          state: 'Pending'
        },
        {
          id: generateId(),
          title: 'Restrict Building Access',
          priority: 'Critical',
          reason: 'Prevent entry during active fire event.',
          evidence: ['"smoke spreading to the east entrance"'],
          confidence: 0.99,
          state: 'Pending'
        }
      ]
    };
  }

  // Initial report
  if (lowerText.includes('smoke') || lowerText.includes('power')) {
    return {
      incident: {
        id: generateId(),
        type: 'Fire / Electrical Risk',
        severity: 'High',
        status: 'Triaged',
        confidence: 0.91,
      },
      location: {
        id: generateId(),
        name: 'Iribe Center',
        type: 'Campus Building',
        status: 'At Risk',
      },
      assets: [
        { id: generateId(), name: 'Iribe Center power system', type: 'Infrastructure', status: 'Degraded' },
        { id: generateId(), name: 'Classrooms', type: 'Facilities', status: 'Offline' },
        { id: generateId(), name: 'Student evacuation area', type: 'Zone', status: 'Operational' },
      ],
      teams: [
        { id: generateId(), name: 'Campus Safety', status: 'Available' },
        { id: generateId(), name: 'Facilities', status: 'Available' },
      ],
      actions: [
        {
          id: generateId(),
          title: 'Dispatch Campus Safety',
          priority: 'High',
          reason: 'Visual confirmation of smoke near occupied building.',
          evidence: ['"Smoke reported near Iribe Center"'],
          confidence: 0.94,
          state: 'Pending'
        },
        {
          id: generateId(),
          title: 'Notify Facilities',
          priority: 'Medium',
          reason: 'Power loss in multiple rooms requires immediate assessment.',
          evidence: ['"Two classrooms lost power"'],
          confidence: 0.88,
          state: 'Pending'
        }
      ]
    };
  }

  // Default empty
  return {};
};
