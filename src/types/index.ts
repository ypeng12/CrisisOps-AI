export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'Triaged' | 'In Progress' | 'Resolved' | 'Escalated';
export type AssetStatus = 'Operational' | 'Degraded' | 'At Risk' | 'Offline';
export type TeamStatus = 'Available' | 'En Route' | 'Assigned' | 'Offline';
export type LocationStatus = 'Normal' | 'Risk Detected' | 'At Risk' | 'Restricted';

export interface Incident {
  id: string;
  type: string;
  severity: Severity;
  status: IncidentStatus;
  description?: string;
  timestamp: string;
  confidence: number;
}

export interface Location {
  id: string;
  name: string;
  coordinates?: [number, number];
  status: LocationStatus;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  status: AssetStatus;
  coordinates?: [number, number];
}

export interface Team {
  id: string;
  name: string;
  type?: string;
  status: TeamStatus;
  coordinates?: [number, number];
}

export interface RecommendedAction {
  id: string;
  title: string;
  reason: string;
  priority: Severity;
  state: 'Pending' | 'Approved' | 'Hold' | 'Rejected';
  confidence: number;
  evidence: string[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  actor: string;
  type: 'system' | 'action';
}

export interface SystemState {
  incident: Incident;
  location: Location;
  assets: Asset[];
  teams: Team[];
  actions: RecommendedAction[];
  logs: LogEntry[];
  rawInput: string;
}
