export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'New' | 'Triaged' | 'Escalated' | 'Resolved';
export type LocationStatus = 'Normal' | 'At Risk' | 'Restricted';
export type AssetStatus = 'Operational' | 'Degraded' | 'Offline';
export type TeamStatus = 'Available' | 'Assigned' | 'En Route';
export type ActionState = 'Pending' | 'Approved' | 'Hold' | 'Rejected';

export interface Incident {
  id: string;
  type: string;
  severity: Severity;
  status: IncidentStatus;
  confidence: number;
}

export interface Location {
  id: string;
  name: string;
  type: string;
  status: LocationStatus;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  status: AssetStatus;
}

export interface Team {
  id: string;
  name: string;
  status: TeamStatus;
}

export interface RecommendedAction {
  id: string;
  title: string;
  priority: Severity;
  reason: string;
  evidence: string[];
  confidence: number;
  state: ActionState;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  actor: string;
  type: 'action' | 'system';
}

export interface SystemState {
  incident: Incident | null;
  location: Location | null;
  assets: Asset[];
  teams: Team[];
  actions: RecommendedAction[];
  logs: LogEntry[];
  rawInput: string;
}
