import React, { useState } from 'react';
import { LogEntry } from '../types';
import { History, Terminal, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  t: any;
  logs: LogEntry[];
}

export const ActionLog: React.FC<Props> = ({ logs }) => {
  const [activeTab, setActiveTab] = useState<'system' | 'radio'>('system');

  // Simulated Radio Comms
  const radioComms = [
    { id: '1', time: '14:32', unit: 'Unit-7', msg: 'On site. Smoke visible at second floor.' },
    { id: '2', time: '14:34', unit: 'Engine-4', msg: 'Establishing water supply at hydrant-09.' },
    { id: '3', time: '14:35', unit: 'Dispatch', msg: 'Copy Unit-7. Perimeter being established.' }
  ];

  return (
    <div className="flex flex-col h-full bg-panel border border-border rounded-lg overflow-hidden shadow-xl">
      <div className="p-3 border-b border-border bg-panel/50 flex items-center justify-between">
        <div className="flex gap-1 bg-black/40 p-0.5 rounded border border-white/5">
          <button 
            onClick={() => setActiveTab('system')}
            className={`px-3 py-1 rounded text-[9px] font-bold tracking-widest flex items-center gap-1.5 transition-all ${activeTab === 'system' ? 'bg-accent text-white' : 'text-textMuted hover:text-white'}`}
          >
            <History size={12} /> AUDIT LOG
          </button>
          <button 
            onClick={() => setActiveTab('radio')}
            className={`px-3 py-1 rounded text-[9px] font-bold tracking-widest flex items-center gap-1.5 transition-all ${activeTab === 'radio' ? 'bg-accent text-white' : 'text-textMuted hover:text-white'}`}
          >
            <Radio size={12} /> RADIO COMMS
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-accent animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          LIVE
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar font-mono">
        <AnimatePresence mode="wait">
          {activeTab === 'system' ? (
            <motion.div 
              key="system"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-textMuted opacity-30 mt-10">
                  <Terminal size={32} strokeWidth={1} />
                  <p className="text-[10px] mt-2 tracking-widest">AWAITING SYSTEM EVENTS</p>
                </div>
              )}
              {logs.map((log) => (
                <div key={log.id} className="text-[10px] flex gap-2 group">
                  <span className="text-textMuted flex-shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                  <div>
                    <span className={`font-bold ${log.type === 'action' ? 'text-accent' : 'text-green-500'}`}>{log.actor}</span>
                    <span className="text-textMain ml-2 leading-relaxed opacity-90">{log.message}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="radio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {radioComms.map((com) => (
                <div key={com.id} className="text-[10px] border-l-2 border-accent/20 pl-2 bg-accent/5 py-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-accent font-bold">[{com.unit}]</span>
                    <span className="text-[8px] text-textMuted">{com.time}</span>
                  </div>
                  <p className="italic text-textMain/80">"{com.msg}"</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
