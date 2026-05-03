import React from 'react';
import { RecommendedAction } from '../types';
import { translations } from '../utils/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Shield, Navigation } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface Props {
  t: typeof translations['en'];
  actions: RecommendedAction[];
  onActionStateChange: (id: string, newState: 'Approved' | 'Hold' | 'Rejected') => void;
  isAnalyzing?: boolean;
}

export const RecommendationPanel: React.FC<Props> = ({ t, actions, onActionStateChange, isAnalyzing }) => {
  return (
    <div className="flex flex-col h-full bg-panel border border-border rounded-lg overflow-hidden shadow-2xl relative">
      <div className="p-4 border-b border-border bg-panel/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="text-accent" size={20} />
          <h2 className="text-lg font-semibold tracking-wide">{t.recommendedActions}</h2>
        </div>
        <div className="text-[10px] text-textMuted font-mono">AI CONFIDENCE: 98%</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {actions.length === 0 && !isAnalyzing && (
          <div className="h-full flex flex-col items-center justify-center text-textMuted opacity-50 space-y-3">
             <Shield size={48} strokeWidth={1} />
             <p className="text-sm font-medium">{t.noContext}</p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-background border rounded-lg overflow-hidden transition-all duration-300 ${
                action.state === 'Approved' ? 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 
                action.state === 'Rejected' ? 'border-red-900/50 grayscale' : 'border-border hover:border-accent/40'
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm text-white">{action.title}</h3>
                  <div className="flex items-center gap-2">
                    <StatusBadge text={action.priority} type="severity" />
                    {action.state !== 'Pending' && (
                       <StatusBadge text={action.state} />
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">{action.reason}</p>

                {/* DEPLOYMENT HINT SECTION */}
                {action.evidence && action.evidence.length > 0 && (
                  <div className="bg-accent/5 border border-accent/20 rounded p-2 mb-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-widest mb-1.5">
                      <Navigation size={12} />
                      Deployment Strategy
                    </div>
                    {action.evidence.map((ev, i) => (
                      <p key={i} className="text-[11px] text-blue-100 leading-relaxed italic">
                        "{ev}"
                      </p>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onActionStateChange(action.id, 'Approved')}
                    className={`flex flex-col items-center gap-1 py-2 rounded text-[10px] font-bold transition-all ${
                      action.state === 'Approved' ? 'bg-green-600 text-white' : 'bg-green-900/20 text-green-400 hover:bg-green-600/30'
                    }`}
                  >
                    <CheckCircle size={14} />
                    APPROVE
                  </button>
                  <button
                    onClick={() => onActionStateChange(action.id, 'Hold')}
                    className={`flex flex-col items-center gap-1 py-2 rounded text-[10px] font-bold transition-all ${
                      action.state === 'Hold' ? 'bg-yellow-600 text-white' : 'bg-yellow-900/20 text-yellow-400 hover:bg-yellow-600/30'
                    }`}
                  >
                    <Clock size={14} />
                    HOLD
                  </button>
                  <button
                    onClick={() => onActionStateChange(action.id, 'Rejected')}
                    className={`flex flex-col items-center gap-1 py-2 rounded text-[10px] font-bold transition-all ${
                      action.state === 'Rejected' ? 'bg-red-600 text-white' : 'bg-red-900/20 text-red-400 hover:bg-red-600/30'
                    }`}
                  >
                    <XCircle size={14} />
                    REJECT
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-3 bg-black/30 border-t border-border">
         <div className="flex justify-between items-center text-[10px] font-mono">
           <span className="text-textMuted uppercase">Decision Protocol:</span>
           <span className="text-accent">HUMAN-IN-THE-LOOP (HITL)</span>
         </div>
      </div>
    </div>
  );
};
