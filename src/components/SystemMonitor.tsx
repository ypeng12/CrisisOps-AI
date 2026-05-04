import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Wifi, Cpu, Gauge } from 'lucide-react';

interface Props {
  t: any;
  riskScore: number;
}

export const SystemMonitor: React.FC<Props> = ({ t, riskScore }) => {
  return (
    <div className="bg-panel border border-border rounded-lg p-3 h-full flex flex-col shadow-xl">
      <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
        <Activity size={16} className="text-accent" />
        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">{t.sysMonitor}</h3>
      </div>

      <div className="flex-1 space-y-4">
        {/* Real-time Load Graph (Simulated) */}
        <div className="space-y-2">
          <div className="flex justify-between text-[8px] font-mono text-textMuted uppercase">
            <span>{t.nodeLoad}</span>
            <span className="text-accent">{(riskScore * 0.8).toFixed(1)}%</span>
          </div>
          <div className="h-10 flex items-end gap-0.5">
            {[...Array(20)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ height: 2 }}
                animate={{ height: Math.random() * 20 + 5 }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                className="flex-1 bg-accent/30 rounded-t-sm"
              />
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/20 p-2 rounded border border-white/5">
             <div className="text-[8px] text-textMuted uppercase mb-1 flex items-center gap-1">
               <Wifi size={10} /> {t.bandwidthSaving}
             </div>
             <div className="text-xs font-mono font-bold text-green-400">92.4%</div>
          </div>
          <div className="bg-black/20 p-2 rounded border border-white/5">
             <div className="text-[8px] text-textMuted uppercase mb-1 flex items-center gap-1">
               <Cpu size={10} /> {t.localEfficiency}
             </div>
             <div className="text-xs font-mono font-bold text-blue-400">0.12ms/op</div>
          </div>
        </div>

        {/* System Health Status */}
        <div className="mt-auto pt-2 border-t border-border/50">
           <div className="flex items-center justify-between text-[8px] font-mono">
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-textMuted uppercase">Core Ingest: Stable</span>
              </div>
              <div className="flex items-center gap-1">
                 <Gauge size={10} className="text-textMuted" />
                 <span className="text-white">UPTIME: 99.998%</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
