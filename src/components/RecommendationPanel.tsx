import React from 'react';
import { RecommendedAction } from '../types';
import { StatusBadge } from './StatusBadge';
import { ShieldCheck, FileText, Check, Pause, X } from 'lucide-react';
import { translations } from '../utils/i18n';

interface Props {
  t: typeof translations['en'];
  actions: RecommendedAction[];
  onActionStateChange: (id: string, newState: 'Approved' | 'Hold' | 'Rejected') => void;
}

export const RecommendationPanel: React.FC<Props> = ({ t, actions, onActionStateChange }) => {
  if (!actions || actions.length === 0) {
    return (
      <div className="flex flex-col h-full bg-panel border border-border rounded-lg p-4 justify-center items-center text-textMuted text-center">
        <ShieldCheck size={48} className="mb-4 opacity-50" />
        <p>{t.noContext}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-panel border border-border rounded-lg p-4 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="text-accent" size={20} />
        <h2 className="text-lg font-semibold tracking-wide">{t.recommendedActions}</h2>
      </div>

      <div className="space-y-4">
        {actions.map(action => (
          <div key={action.id} className="bg-background border border-border rounded p-3 relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm pr-16">{action.title}</h3>
              <div className="absolute top-3 right-3">
                {action.state !== 'Pending' ? (
                   <StatusBadge text={t[action.state.toLowerCase() as keyof typeof t]} type="state" />
                ) : (
                   <StatusBadge text={action.priority} type="severity" />
                )}
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mb-3">{action.reason}</p>
            
            {/* Evidence Block */}
            {action.evidence && action.evidence.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded p-2 mb-3">
                <div className="flex items-center gap-1 mb-1 text-xs text-gray-500 font-mono uppercase">
                  <FileText size={12} />
                  <span>{t.evidence}</span>
                </div>
                <div className="text-xs text-gray-300 font-mono italic border-l-2 border-accent pl-2">
                  {action.evidence.map((ev, i) => (
                    <div key={i}>{ev}</div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-accent font-mono">{t.confidence}: {(action.confidence * 100).toFixed(0)}%</span>
              
              {action.state === 'Pending' && (
                <div className="flex gap-1">
                  <button 
                    onClick={() => onActionStateChange(action.id, 'Approved')}
                    className="p-1 rounded bg-green-950/30 text-green-400 hover:bg-green-900/50 border border-green-900/30 transition-colors"
                    title={t.approve}
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={() => onActionStateChange(action.id, 'Hold')}
                    className="p-1 rounded bg-yellow-950/30 text-yellow-400 hover:bg-yellow-900/50 border border-yellow-900/30 transition-colors"
                    title={t.hold}
                  >
                    <Pause size={16} />
                  </button>
                  <button 
                    onClick={() => onActionStateChange(action.id, 'Rejected')}
                    className="p-1 rounded bg-red-950/30 text-red-400 hover:bg-red-900/50 border border-red-900/30 transition-colors"
                    title={t.reject}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
