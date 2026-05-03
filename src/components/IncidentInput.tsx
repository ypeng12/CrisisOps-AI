import React, { useState } from 'react';
import { Send, AlertTriangle } from 'lucide-react';

interface Props {
  onAnalyze: (text: string) => void;
  onSimulateSecond: () => void;
  hasInitialReport: boolean;
}

export const IncidentInput: React.FC<Props> = ({ onAnalyze, onSimulateSecond, hasInitialReport }) => {
  const [text, setText] = useState('');

  const handleAnalyze = () => {
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div className="flex flex-col h-full bg-panel border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-accent" size={20} />
        <h2 className="text-lg font-semibold tracking-wide">Incoming Report</h2>
      </div>
      
      <textarea
        className="flex-1 bg-background border border-border rounded p-3 text-sm font-mono focus:outline-none focus:border-accent resize-none mb-4"
        placeholder="Enter unstructured incident report..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex flex-col gap-2">
        <button
          onClick={handleAnalyze}
          className="bg-accent hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
        >
          <Send size={16} />
          Analyze Incident
        </button>
        
        {hasInitialReport && (
          <button
            onClick={onSimulateSecond}
            className="bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-900/50 font-medium py-2 px-4 rounded transition-colors"
          >
            Simulate Second Report (Escalation)
          </button>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3">
          <h3 className="text-xs font-bold text-blue-400 uppercase mb-2">Why not a chatbot?</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li><span className="text-red-400 line-through mr-1">Chatbot:</span> Unstructured text, no live state, no audit trail.</li>
            <li><span className="text-green-400 font-bold mr-1">CrisisOps AI:</span> Extracts operational objects, recommends actions, requires human approval, logs decisions, updates live state.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
