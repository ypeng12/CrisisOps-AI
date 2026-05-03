import { useState, useEffect } from 'react';
import { IncidentInput } from './components/IncidentInput';
import { OntologyPanel } from './components/OntologyPanel';
import { RecommendationPanel } from './components/RecommendationPanel';
import { ActionLog } from './components/ActionLog';
import { MapView } from './components/MapView';
import { SystemState, LogEntry } from './types';
import { parseIncident, generateId, calculateSystemRisk, generateRandomScenario } from './utils/parser';
import { translations, Language } from './utils/i18n';
import { Activity, Languages, ShieldAlert, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [targetRisk, setTargetRisk] = useState(0);
  const [viewMode, setViewMode] = useState<'object' | 'map'>('object');
  const [inputText, setInputText] = useState('');

  const [state, setState] = useState<Partial<SystemState>>({
    logs: [],
    rawInput: ''
  });

  useEffect(() => {
    if (riskScore !== targetRisk) {
      const timeout = setTimeout(() => {
        setRiskScore(prev => {
          const diff = targetRisk - prev;
          if (Math.abs(diff) < 1) return targetRisk;
          const step = diff > 0 ? 1 : -1;
          return prev + step;
        });
      }, 20);
      return () => clearTimeout(timeout);
    }
  }, [riskScore, targetRisk]);

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const handleAnalyze = (text: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const parsedState = parseIncident(text, lang);
      const newLogs: LogEntry[] = [
        ...(state.logs || []),
        {
          id: generateId(),
          timestamp: formatTime(),
          message: lang === 'zh' ? '警情报告已解析为运营对象。严重程度：高。' : 'Incident report parsed into operational objects. Severity: High.',
          actor: t.system,
          type: 'system'
        }
      ];

      const nextState = {
        ...parsedState,
        rawInput: text,
        logs: newLogs
      };

      setState(nextState);
      setTargetRisk(calculateSystemRisk(nextState));
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSimulateSecond = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const secondReport = lang === 'zh' ? '更新：火势正向东门扩散。建筑外有大量人群聚集。' : "Update: smoke spreading to the east entrance. Crowd forming outside the building.";
      const escalatedState = parseIncident(secondReport, lang, state as SystemState);
      
      const updatedActions = [
        ...(state.actions || []).map(a => ({ ...a, state: a.state === 'Pending' ? 'Rejected' : (a.state as any) })),
        ...(escalatedState.actions || [])
      ];

      const newLogs: LogEntry[] = [
        ...(state.logs || []),
        {
          id: generateId(),
          timestamp: formatTime(),
          message: lang === 'zh' ? '收到后续报告。事态升级：高 → 紧急。' : 'Second report received. Severity escalated: High → Critical.',
          actor: t.system,
          type: 'system'
        }
      ];

      const nextState = {
        ...state,
        ...escalatedState,
        actions: updatedActions,
        rawInput: (state.rawInput || '') + "\n\n" + secondReport,
        logs: newLogs
      };

      setState(nextState);
      setTargetRisk(calculateSystemRisk(nextState));
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleGenerateRandom = () => {
    const randomText = generateRandomScenario(lang);
    setInputText(randomText); // Show it in the UI
    setTimeout(() => {
      handleAnalyze(randomText);
    }, 500); // Small delay so user sees the text appear
  };

  const handleActionStateChange = (id: string, newState: 'Approved' | 'Hold' | 'Rejected') => {
    if (!state.actions) return;
    const action = state.actions.find(a => a.id === id);
    if (!action) return;

    const updatedActions = state.actions.map(a => 
      a.id === id ? { ...a, state: newState } : a
    );

    const logEntry: LogEntry = {
      id: generateId(),
      timestamp: formatTime(),
      message: `${lang === 'zh' ? '行动' : 'Action'}: ${action.title} - ${t[newState.toLowerCase() as keyof typeof t]}`,
      actor: t.operator,
      type: 'action'
    };

    setState(prev => {
      let newLocationStatus = prev.location?.status;
      let newTeams = prev.teams;

      if (newState === 'Approved') {
        if ((action.title.includes('Restrict Building Access') || action.title.includes('限制')) && prev.location) {
          newLocationStatus = 'Restricted';
        }
        if ((action.title.includes('Dispatch Campus Safety') || action.title.includes('安保')) && prev.teams) {
           newTeams = prev.teams?.map(t => t.name.includes('Campus Safety') || t.name.includes('安保') ? { ...t, status: 'Assigned' } : t);
        }
      }

      const nextState = {
        ...prev,
        actions: updatedActions,
        location: prev.location ? { ...prev.location, status: newLocationStatus || prev.location.status } : undefined,
        teams: newTeams,
        logs: [...(prev.logs || []), logEntry]
      };
      
      setTargetRisk(calculateSystemRisk(nextState));
      return nextState;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background text-textMain overflow-hidden font-sans">
      <header className="flex items-center justify-between px-6 py-3 bg-panel border-b border-border shadow-2xl z-20">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ rotate: isAnalyzing ? 360 : 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="bg-accent/20 p-2 rounded border border-accent/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <Activity className="text-accent" size={24} />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold tracking-wider uppercase text-white leading-none">{t.title}</h1>
            <p className="text-[10px] text-accent font-mono tracking-widest uppercase mt-1">{t.subtitle}</p>
          </div>
        </div>

        <AnimatePresence>
          {riskScore > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6 px-6 py-1 bg-black/40 rounded-full border border-border/50"
            >
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-textMuted uppercase font-mono tracking-tighter">System Risk</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-bold font-mono ${riskScore > 70 ? 'text-red-500' : riskScore > 40 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {Math.round(riskScore)}%
                  </span>
                  {riskScore < targetRisk ? <ShieldAlert size={14} className="text-red-500 animate-pulse" /> : <TrendingDown size={14} className="text-green-500" />}
                </div>
              </div>
              
              <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${riskScore}%` }}
                  className={`h-full ${riskScore > 70 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-background hover:bg-panel transition-all hover:border-accent text-xs font-medium"
          >
            <Languages size={14} className="text-accent" />
            {lang === 'en' ? '中文' : 'English'}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-6 relative">
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/40 backdrop-blur-[2px] z-10 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          <div className="h-full min-h-0">
            <IncidentInput 
              t={t}
              onAnalyze={handleAnalyze} 
              onSimulateSecond={handleSimulateSecond}
              onGenerateRandom={handleGenerateRandom}
              hasInitialReport={!!state.incident}
              isAnalyzing={isAnalyzing}
              externalText={inputText}
            />
          </div>

          <div className="h-full min-h-0 flex flex-col gap-4">
            <div className="flex bg-panel p-1 rounded border border-border self-end">
               <button 
                 onClick={() => setViewMode('object')}
                 className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${viewMode === 'object' ? 'bg-accent text-white' : 'text-textMuted hover:text-white'}`}
               >
                 Objects
               </button>
               <button 
                 onClick={() => setViewMode('map')}
                 className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${viewMode === 'map' ? 'bg-accent text-white' : 'text-textMuted hover:text-white'}`}
               >
                 Tactical Map
               </button>
            </div>
            <div className="flex-1 min-h-0">
              <AnimatePresence mode="wait">
                {viewMode === 'object' ? (
                  <motion.div 
                    key="object"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full"
                  >
                    <OntologyPanel t={t} state={state} isAnalyzing={isAnalyzing} />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="map"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full"
                  >
                    <MapView state={state} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="h-full min-h-0">
            <RecommendationPanel 
              t={t}
              actions={state.actions || []} 
              onActionStateChange={handleActionStateChange}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </main>

      <ActionLog t={t} logs={state.logs || []} />
    </div>
  );
}

export default App;
