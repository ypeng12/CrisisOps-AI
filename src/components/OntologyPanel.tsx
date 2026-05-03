import React from 'react';
import { SystemState } from '../types';
import { StatusBadge } from './StatusBadge';
import { Network, MapPin, Box, Users, Activity } from 'lucide-react';
import { translations } from '../utils/i18n';

interface Props {
  t: typeof translations['en'];
  state: Partial<SystemState>;
}

export const OntologyPanel: React.FC<Props> = ({ t, state }) => {
  if (!state.incident) {
    return (
      <div className="flex flex-col h-full bg-panel border border-border rounded-lg p-4 justify-center items-center text-textMuted text-center">
        <Network size={48} className="mb-4 opacity-50" />
        <p>{t.noTwin}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-panel border border-border rounded-lg p-4 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 mb-6">
        <Network className="text-accent" size={20} />
        <h2 className="text-lg font-semibold tracking-wide">{t.operationalTwin}</h2>
      </div>

      <div className="space-y-4">
        {/* Incident Card */}
        <div className="bg-background border border-border rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-gray-400" />
            <h3 className="font-semibold text-sm">{t.incident}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-400">{t.type}</div>
            <div className="font-mono">{state.incident.type}</div>
            <div className="text-gray-400">{t.severity}</div>
            <div><StatusBadge text={state.incident.severity} type="severity" /></div>
            <div className="text-gray-400">{t.status}</div>
            <div><StatusBadge text={state.incident.status} /></div>
            <div className="text-gray-400">{t.confidence}</div>
            <div className="text-accent font-mono">{(state.incident.confidence * 100).toFixed(0)}%</div>
          </div>
        </div>

        {/* Location Card */}
        {state.location && (
          <div className="bg-background border border-border rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-gray-400" />
              <h3 className="font-semibold text-sm">{t.location}</h3>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-mono">{state.location.name}</span>
              <StatusBadge text={state.location.status} />
            </div>
          </div>
        )}

        {/* Assets Card */}
        {state.assets && state.assets.length > 0 && (
          <div className="bg-background border border-border rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <Box size={16} className="text-gray-400" />
              <h3 className="font-semibold text-sm">{t.assets}</h3>
            </div>
            <div className="space-y-2">
              {state.assets.map(asset => (
                <div key={asset.id} className="flex justify-between items-center text-sm">
                  <span className="font-mono text-gray-300">{asset.name}</span>
                  <StatusBadge text={asset.status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teams Card */}
        {state.teams && state.teams.length > 0 && (
          <div className="bg-background border border-border rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-gray-400" />
              <h3 className="font-semibold text-sm">{t.teams}</h3>
            </div>
            <div className="space-y-2">
              {state.teams.map(team => (
                <div key={team.id} className="flex justify-between items-center text-sm">
                  <span className="font-mono text-gray-300">{team.name}</span>
                  <StatusBadge text={team.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
