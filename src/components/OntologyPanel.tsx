import React from 'react';
import { SystemState } from '../types';
import { StatusBadge } from './StatusBadge';
import { Network, MapPin, Box, Users, Activity, Share2 } from 'lucide-react';
import { translations } from '../utils/i18n';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  t: typeof translations['en'];
  state: Partial<SystemState>;
  isAnalyzing?: boolean;
}

export const OntologyPanel: React.FC<Props> = ({ t, state, isAnalyzing }) => {
  if (!state.incident && !isAnalyzing) {
    return (
      <div className="flex flex-col h-full bg-panel border border-border rounded-lg p-4 justify-center items-center text-textMuted text-center">
        <Network size={48} className="mb-4 opacity-50" />
        <p>{t.noTwin}</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col h-full bg-panel border border-border rounded-lg p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Network className="text-accent" size={20} />
          <h2 className="text-lg font-semibold tracking-wide">{t.operationalTwin}</h2>
        </div>
        <div className="flex gap-1">
           <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
           <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-pulse delay-75" />
           <div className="w-1.5 h-1.5 rounded-full bg-accent/30 animate-pulse delay-150" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-background/50 border border-border/50 rounded animate-pulse" />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {/* Incident Card */}
              <motion.div variants={item} className="bg-background border border-border rounded p-3 hover:border-accent/30 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-gray-400" />
                    <h3 className="font-semibold text-sm">{t.incident}</h3>
                  </div>
                  <Share2 size={14} className="text-gray-600 group-hover:text-accent transition-colors cursor-pointer" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">{t.type}</div>
                  <div className="font-mono text-xs">{state.incident?.type}</div>
                  <div className="text-gray-400">{t.severity}</div>
                  <div><StatusBadge text={state.incident?.severity || ''} type="severity" /></div>
                  <div className="text-gray-400">{t.status}</div>
                  <div><StatusBadge text={state.incident?.status || ''} /></div>
                  <div className="text-gray-400">{t.confidence}</div>
                  <div className="text-accent font-mono text-xs">{(state.incident?.confidence || 0 * 100).toFixed(0)}%</div>
                </div>
              </motion.div>

              {/* Location Card */}
              {state.location && (
                <motion.div variants={item} className="bg-background border border-border rounded p-3 hover:border-accent/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-gray-400" />
                    <h3 className="font-semibold text-sm">{t.location}</h3>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-mono text-xs">{state.location.name}</span>
                    <StatusBadge text={state.location.status} />
                  </div>
                </motion.div>
              )}

              {/* Assets Card */}
              {state.assets && state.assets.length > 0 && (
                <motion.div variants={item} className="bg-background border border-border rounded p-3 hover:border-accent/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Box size={16} className="text-gray-400" />
                    <h3 className="font-semibold text-sm">{t.assets}</h3>
                  </div>
                  <div className="space-y-2">
                    {state.assets.map(asset => (
                      <div key={asset.id} className="flex justify-between items-center text-sm">
                        <span className="font-mono text-[10px] text-gray-300">{asset.name}</span>
                        <StatusBadge text={asset.status} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Teams Card */}
              {state.teams && state.teams.length > 0 && (
                <motion.div variants={item} className="bg-background border border-border rounded p-3 hover:border-accent/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} className="text-gray-400" />
                    <h3 className="font-semibold text-sm">{t.teams}</h3>
                  </div>
                  <div className="space-y-2">
                    {state.teams.map(team => (
                      <div key={team.id} className="flex justify-between items-center text-sm">
                        <span className="font-mono text-[10px] text-gray-300">{team.name}</span>
                        <StatusBadge text={team.status} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Relationship Placeholder */}
      <div className="mt-4 p-2 bg-black/40 rounded border border-border/40">
        <div className="flex items-center gap-2 mb-1 opacity-60">
           <Share2 size={12} />
           <span className="text-[10px] uppercase tracking-widest font-mono">Object Relationships</span>
        </div>
        <div className="h-12 flex items-center justify-center border border-dashed border-border/30 rounded">
            <span className="text-[9px] text-textMuted font-mono italic">Graph view initialized...</span>
        </div>
      </div>
    </div>
  );
};
