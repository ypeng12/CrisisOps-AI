import React from 'react';
import { RecommendedAction } from '../types';
import { StatusBadge } from './StatusBadge';
import { ShieldCheck, FileText, Check, Pause, X, Zap } from 'lucide-react';
import { translations } from '../utils/i18n';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  t: typeof translations['en'];
  actions: RecommendedAction[];
  onActionStateChange: (id: string, newState: 'Approved' | 'Hold' | 'Rejected') => void;
  isAnalyzing?: boolean;
}

export const RecommendationPanel: React.FC<Props> = ({ t, actions, onActionStateChange, isAnalyzing }) => {
  if ((!actions || actions.length === 0) && !isAnalyzing) {
    return (
      <div className="flex flex-col h-full bg-panel border border-border rounded-lg p-4 justify-center items-center text-textMuted text-center">
        <ShieldCheck size={48} className="mb-4 opacity-50" />
        <p>{t.noContext}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-panel border border-border rounded-lg p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-accent" size={20} />
          <h2 className="text-lg font-semibold tracking-wide">{t.recommendedActions}</h2>
        </div>
        <Zap size={16} className="text-accent/50" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <AnimatePresence mode="popLayout">
          {isAnalyzing ? (
            <motion.div 
              key="loading-actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[1, 2].map(i => (
                <div key={i} className="h-32 bg-background/50 border border-border/50 rounded animate-pulse" />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-4"
              initial="hidden"
              animate="show"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
            >
              {actions.map(action => (
                <motion.div 
                  key={action.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ borderColor: 'rgba(59, 130, 246, 0.4)' }}
                  className="bg-background border border-border rounded p-3 relative overflow-hidden group shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm pr-16 group-hover:text-accent transition-colors">{action.title}</h3>
                    <div className="absolute top-3 right-3">
                      {action.state !== 'Pending' ? (
                         <motion.div 
                          initial={{ scale: 0.8 }} 
                          animate={{ scale: 1 }}
                          className="shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                         >
                           <StatusBadge text={t[action.state.toLowerCase() as keyof typeof t]} type="state" />
                         </motion.div>
                      ) : (
                         <StatusBadge text={action.priority} type="severity" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-3 leading-relaxed">{action.reason}</p>
                  
                  {/* Evidence Block */}
                  {action.evidence && action.evidence.length > 0 && (
                    <div className="bg-gray-900 border border-gray-800 rounded p-2 mb-3 group-hover:border-gray-700 transition-colors">
                      <div className="flex items-center gap-1 mb-1 text-[10px] text-gray-500 font-mono uppercase tracking-tighter">
                        <FileText size={10} />
                        <span>{t.evidence}</span>
                      </div>
                      <div className="text-[11px] text-gray-300 font-mono italic border-l-2 border-accent/50 pl-2">
                        {action.evidence.map((ev, i) => (
                          <div key={i}>{ev}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-accent/80 font-mono text-[10px]">{t.confidence}: {(action.confidence * 100).toFixed(0)}%</span>
                    
                    {action.state === 'Pending' && (
                      <div className="flex gap-1">
                        <button 
                          onClick={() => onActionStateChange(action.id, 'Approved')}
                          className="p-1.5 rounded bg-green-950/20 text-green-400 hover:bg-green-500 hover:text-white border border-green-900/30 transition-all duration-200"
                          title={t.approved}
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={() => onActionStateChange(action.id, 'Hold')}
                          className="p-1.5 rounded bg-yellow-950/20 text-yellow-400 hover:bg-yellow-500 hover:text-white border border-yellow-900/30 transition-all duration-200"
                          title={t.hold}
                        >
                          <Pause size={14} />
                        </button>
                        <button 
                          onClick={() => onActionStateChange(action.id, 'Rejected')}
                          className="p-1.5 rounded bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-900/30 transition-all duration-200"
                          title={t.rejected}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative glow effect on approved */}
                  {action.state === 'Approved' && (
                    <div className="absolute top-0 right-0 w-1 h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
