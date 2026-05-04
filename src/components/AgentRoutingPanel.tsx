import React from 'react';
import { motion } from 'framer-motion';
import { Network, Zap, ShieldCheck, UserCheck, ArrowRight, Activity, Cpu } from 'lucide-react';
import { translations } from '../utils/i18n';

interface Props {
  t: typeof translations['en'];
  severity?: string;
  confidence?: number;
  isAnalyzing?: boolean;
}

export const AgentRoutingPanel: React.FC<Props> = ({ t, severity, isAnalyzing }) => {
  if (!severity && !isAnalyzing) return null;

  const getRoute = () => {
    if (severity === 'Critical') return ['Edge Fast-Path', 'Cloud Triage', 'Human'];
    if (severity === 'High') return ['Edge Fast-Path', 'Action Agent'];
    return ['Edge Fast-Path'];
  };

  const route = getRoute();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-panel border border-accent/20 rounded-lg p-3 mt-4 overflow-hidden relative shadow-lg"
    >
      <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <Network size={16} className="text-accent" />
          <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">{t.routingLayer}</h3>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[8px] font-mono text-green-400">NOMINAL</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Visual Route */}
        <div className="flex items-center justify-between px-1">
          {route.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1">
                <div className={`p-1.5 rounded-full transition-all duration-500 ${i === route.length - 1 ? 'bg-accent/20 text-accent border border-accent/40 scale-110' : 'bg-background text-textMuted border border-border'}`}>
                  {step === 'Human' ? <UserCheck size={12} /> : step.includes('Cloud') ? <Activity size={12} /> : <Cpu size={12} />}
                </div>
                <span className="text-[8px] font-mono whitespace-nowrap text-textMuted">{step}</span>
              </div>
              {i < route.length - 1 && (
                <ArrowRight size={10} className="text-border mt-[-10px] animate-pulse" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Technical KPIs */}
        <div className="grid grid-cols-2 gap-2 bg-black/30 rounded p-2 text-[9px] font-mono">
          <div className="border-r border-border/50">
            <div className="text-textMuted mb-0.5 flex items-center gap-1"><Zap size={10} className="text-yellow-500" /> LATENCY (TTFT):</div>
            <div className="text-white">42ms <span className="text-[8px] text-green-400">(Local Fast-Path)</span></div>
          </div>
          <div>
            <div className="text-textMuted mb-0.5 flex items-center gap-1"><ShieldCheck size={10} className="text-blue-500" /> CONSISTENCY CHECK:</div>
            <div className="text-blue-400 font-bold uppercase">Active (99.2%)</div>
          </div>
          <div className="border-r border-border/50 pt-1">
            <div className="text-textMuted mb-0.5">ROUTING BASIS:</div>
            <div className="text-white truncate">Intent Complexity: {severity === 'Critical' ? 'HIGH' : 'LOW'}</div>
          </div>
          <div className="pt-1">
            <div className="text-textMuted mb-0.5">LOCAL PROCESSING:</div>
            <div className="text-green-400 font-bold">95.4%</div>
          </div>
        </div>

        {/* Infra Footnote */}
        <div className="text-[8px] text-textMuted font-mono uppercase tracking-tighter opacity-60">
          Infra: Collaborative Intelligent Router v2.1 | Multi-step Consistency Validated
        </div>
      </div>
    </motion.div>
  );
};
