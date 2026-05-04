import React from 'react';
import { SystemState } from '../types';
import { Box, MapPin, Shield, Activity, BarChart3, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge } from './StatusBadge';

interface Props {
  t: any;
  state: Partial<SystemState>;
  isAnalyzing: boolean;
}

export const OntologyPanel: React.FC<Props> = ({ t, state, isAnalyzing }) => {
  if (!state.incident && !isAnalyzing) {
    return (
      <div className="h-full bg-panel border border-border rounded-lg flex flex-col items-center justify-center text-textMuted opacity-30 space-y-4">
        <Box size={48} strokeWidth={1} />
        <p className="text-sm font-medium tracking-widest uppercase">{t.noTwin}</p>
      </div>
    );
  }

  return (
    <div className="h-full grid grid-rows-2 gap-4">
      {/* TOP: Incident & Infrastructure */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-panel border border-border rounded-lg p-4 shadow-xl overflow-hidden relative">
          <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
            <Activity size={18} className="text-accent" />
            <h3 className="text-xs font-bold uppercase tracking-widest">{t.incident}</h3>
          </div>
          {isAnalyzing ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-white/5 rounded w-3/4" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-black/30 p-2 rounded">
                <span className="text-[10px] text-textMuted uppercase font-bold">{t.type}</span>
                <span className="text-sm font-mono text-white">{state.incident?.type}</span>
              </div>
              <div className="flex justify-between items-center bg-black/30 p-2 rounded">
                <span className="text-[10px] text-textMuted uppercase font-bold">{t.severity}</span>
                <StatusBadge status={state.incident?.severity || 'Low'} type="severity" />
              </div>
              <div className="flex justify-between items-center bg-black/30 p-2 rounded">
                <span className="text-[10px] text-textMuted uppercase font-bold">{t.location}</span>
                <span className="text-xs font-medium text-blue-400">{state.location?.name}</span>
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2 opacity-10">
             <BarChart3 size={60} />
          </div>
        </div>

        <div className="bg-panel border border-border rounded-lg p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
            <Box size={18} className="text-accent" />
            <h3 className="text-xs font-bold uppercase tracking-widest">{t.assets}</h3>
          </div>
          <div className="space-y-3 max-h-[160px] overflow-y-auto custom-scrollbar">
            {state.assets?.map((asset) => (
              <div key={asset.id} className="p-2 bg-black/30 rounded border border-white/5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-white uppercase">{asset.name}</span>
                  <StatusBadge status={asset.status} type="status" />
                </div>
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex-1">
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${asset.status === 'Operational' ? 'bg-green-500' : 'bg-red-500'} w-full opacity-50`} />
                      </div>
                      <div className="flex justify-between text-[7px] text-textMuted mt-1">
                        <span>LOAD: 12%</span>
                        <span>Uptime: 99.9%</span>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM: Teams & Tactical Readiness */}
      <div className="bg-panel border border-border rounded-lg p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
          <Shield size={18} className="text-accent" />
          <h3 className="text-xs font-bold uppercase tracking-widest">{t.teams}</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {state.teams?.map((team) => (
            <motion.div 
              key={team.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 bg-black/30 rounded-lg border border-white/5 flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] font-bold text-white mb-1 truncate">{team.name}</div>
                <StatusBadge status={team.status} type="status" />
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-[8px] text-textMuted uppercase font-bold">
                  <span>Fuel</span>
                  <span className="text-blue-400">82%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="w-[82%] h-full bg-blue-500" />
                </div>
                <div className="flex justify-between text-[8px] text-textMuted uppercase font-bold">
                  <span>Capacity</span>
                  <span className="text-green-400">Full</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
