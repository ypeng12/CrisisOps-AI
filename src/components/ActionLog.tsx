import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';
import { Terminal } from 'lucide-react';
import { translations } from '../utils/i18n';

interface Props {
  t: typeof translations['en'];
  logs: LogEntry[];
}

export const ActionLog: React.FC<Props> = ({ t, logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-black border-t border-border h-40 p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-2 text-gray-400">
        <Terminal size={16} />
        <h3 className="font-mono text-sm tracking-widest uppercase">{t.auditLog}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 custom-scrollbar">
        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`flex gap-3 py-1 ${log.type === 'system' ? 'text-accent' : 'text-gray-300'}`}
          >
            <span className="text-gray-500 whitespace-nowrap">{log.timestamp}</span>
            <span className="text-gray-600">|</span>
            <span>
              {log.message} <span className="text-gray-500 italic ml-2">[{log.actor}]</span>
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-600 italic">{t.noLogs}</div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
