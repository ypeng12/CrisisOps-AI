import React, { useState } from 'react';
import { Send, AlertTriangle, Loader2 } from 'lucide-react';
import { translations } from '../utils/i18n';
import { motion } from 'framer-motion';

interface Props {
  t: typeof translations['en'];
  onAnalyze: (text: string) => void;
  onSimulateSecond: () => void;
  hasInitialReport: boolean;
  isAnalyzing?: boolean;
}

export const IncidentInput: React.FC<Props> = ({ t, onAnalyze, onSimulateSecond, hasInitialReport, isAnalyzing }) => {
  const [text, setText] = useState('');

  const handleAnalyze = () => {
    if (text.trim() && !isAnalyzing) {
      onAnalyze(text);
    }
  };

  return (
    <div className="flex flex-col h-full bg-panel border border-border rounded-lg p-4 overflow-y-auto custom-scrollbar shadow-inner">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-accent" size={20} />
        <h2 className="text-lg font-semibold tracking-wide">{t.incomingReport}</h2>
      </div>
      
      <div className="relative flex-1 flex flex-col mb-4 min-h-[200px]">
        <textarea
          className={`flex-1 bg-background border border-border rounded p-3 text-sm font-mono focus:outline-none focus:border-accent resize-none transition-all ${isAnalyzing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
          placeholder={t.placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
             >
               <Loader2 className="text-accent" size={32} />
             </motion.div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !text.trim()}
          className={`bg-accent hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center justify-center gap-2 transition-all active:scale-95 ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : 'shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`}
        >
          {isAnalyzing ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Send size={16} />
          )}
          {t.analyzeBtn}
        </button>
        
        {hasInitialReport && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onSimulateSecond}
            disabled={isAnalyzing}
            className="bg-red-900/20 hover:bg-red-900/40 text-red-300 border border-red-900/30 font-medium py-2 px-4 rounded transition-all active:scale-95 disabled:opacity-50"
          >
            {t.simulateBtn}
          </motion.button>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-950/10 border border-blue-900/20 rounded p-3"
        >
          <h3 className="text-[10px] font-bold text-blue-400 uppercase mb-2 tracking-widest">{t.whyNotChatbot}</h3>
          <ul className="text-[10px] text-gray-400 space-y-1.5 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-red-400 font-bold">✕</span> 
              <span><span className="text-gray-300 font-semibold">{t.chatbotDesc.split(',')[0]}</span>, {t.chatbotDesc.split(',').slice(1).join(',')}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-400 font-bold">✓</span> 
              <span className="text-gray-300 font-semibold">CrisisOps AI:</span>
            </li>
            <li className="pl-5 text-gray-400">{t.crisisOpsDesc}</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
