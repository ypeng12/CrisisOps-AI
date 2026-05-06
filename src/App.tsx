import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Globe, Cpu, Zap, Search, LayoutGrid } from 'lucide-react';
import { IncidentInput } from './components/IncidentInput';
import { OntologyPanel } from './components/OntologyPanel';
import { RecommendationPanel } from './components/RecommendationPanel';
import { ActionLog } from './components/ActionLog';
import { MapView } from './components/MapView';
import { AgentRoutingPanel } from './components/AgentRoutingPanel';
import { SystemMonitor } from './components/SystemMonitor';
import { translations, Language } from './utils/i18n';
import { parseIncident, calculateSystemRisk, generateRandomScenario } from './utils/parser';
import { SystemState, LogEntry } from './types';

function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [targetRisk, setTargetRisk] = useState(0);
  const [viewMode, setViewMode] = useState<'object' | 'map'>('map');
  const [inputText, setInputText] = useState('');

  const [state, setState] = useState<Partial<SystemState>>({
    logs: [],
    actions: [],
    teams: [],
    assets: []
  });

  // Risk Score Animation
  useEffect(() => {
    const timer = setInterval(() => {
      setRiskScore(prev => {
        if (Math.abs(prev - targetRisk) < 1) return targetRisk;
        return prev + (targetRisk > prev ? 1 : -1);
      });
    }, 30);
    return () => clearInterval(timer);
  }, [targetRisk]);

  useEffect(() => {
    setTargetRisk(calculateSystemRisk(state));
  }, [state]);

  const handleAnalyze = (text: string) => {
    setIsAnalyzing(true);
    const isNewArea = !state.location;
    if (isNewArea) setIsIngesting(true);

    setTimeout(() => {
      const result = parseIncident(text, lang, state as SystemState);
      const newLog: LogEntry = {
        id: Math.random().toString(),
        timestamp: new Date().toISOString(),
        message: isNewArea ? `Telemetry sync: Knowledge base mapped for ${result.location?.name}.` : `Event processed: ${result.incident?.type}`,
        actor: 'Orchestrator',
        type: 'system'
      };

      setState(prev => ({
        ...prev,
        ...result,
        logs: [newLog, ...(prev.logs || [])]
      }));
      setIsAnalyzing(false);
      setIsIngesting(false);
    }, 1200);
  };

  const handleSimulateSecond = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setState(prev => {
        if (!prev.incident) return prev;
        const newIncident = { ...prev.incident, severity: 'Critical' as any };
        const newLog: LogEntry = {
          id: Math.random().toString(),
          timestamp: new Date().toISOString(),
          message: "Anomaly detected in sensor stream. Escalating to Cloud Reasoning Engine.",
          actor: 'Orchestrator',
          type: 'system'
        };
        return {
          ...prev,
          incident: newIncident,
          logs: [newLog, ...(prev.logs || [])]
        };
      });
      setIsAnalyzing(false);
    }, 800);
  };

  const handleGenerateRandom = () => {
    const randomText = generateRandomScenario(lang);
    setInputText(randomText);
    setTimeout(() => {
      handleAnalyze(randomText);
    }, 500);
  };

  const handleActionStateChange = (id: string, newState: 'Approved' | 'Hold' | 'Rejected') => {
    const action = state.actions?.find(a => a.id === id);
    if (!action) return;

    const newLog: LogEntry = {
      id: Math.random().toString(),
      timestamp: new Date().toISOString(),
      message: `Directive: ${action.title} -> ${newState}`,
      actor: 'Commander',
      type: 'action'
    };

    setState(prev => ({
      ...prev,
      actions: prev.actions?.map(a => a.id === id ? { ...a, state: newState } : a),
      logs: [newLog, ...(prev.logs || [])]
    }));
  };

  return (
    <div className="min-h-screen bg-background text-textMain font-sans selection:bg-accent/30">
      {/* ENTERPRISE HEADER */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-md sticky top-0 z-50 px-6 py-2.5">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-accent p-2 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black tracking-tighter uppercase">{t.title}</h1>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400">
                  {t.headerTag}
                </div>
              </div>
              <p className="text-[10px] text-textMuted font-medium uppercase tracking-[0.2em] mt-0.5">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="flex flex-col items-end">
              <div className="text-[9px] text-textMuted uppercase font-bold tracking-widest mb-1">Regional Risk Index</div>
              <div className="flex items-center gap-3">
                <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${riskScore}%` }}
                    className={`h-full ${riskScore > 70 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  />
                </div>
                <span className={`text-xl font-mono font-bold ${riskScore > 70 ? 'text-red-500' : 'text-accent'}`}>{riskScore}%</span>
              </div>
            </div>

            <div className="h-10 w-px bg-border" />

            <button 
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className="px-3 py-1.5 rounded-md bg-white/5 border border-border hover:bg-white/10 transition-all text-[10px] font-bold flex items-center gap-2"
            >
              <Globe size={14} /> {lang === 'en' ? 'CHINESE' : 'ENGLISH'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1750px] mx-auto p-6 grid grid-cols-12 gap-6 h-[calc(100vh-75px)]">
        {/* Left Column: Input, Routing, Monitor */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-hidden">
          <div className="flex-[2] min-h-0 relative">
            <IncidentInput 
              t={t}
              onAnalyze={handleAnalyze} 
              onSimulateSecond={handleSimulateSecond}
              onGenerateRandom={handleGenerateRandom}
              hasInitialReport={!!state.incident}
              isAnalyzing={isAnalyzing}
              externalText={inputText}
            />
            {isIngesting && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="absolute inset-x-4 bottom-24 p-3 bg-blue-600/90 text-white text-[9px] rounded font-bold flex items-center gap-2 z-50 shadow-2xl uppercase tracking-widest"
              >
                <Search size={14} className="animate-pulse" />
                Ingesting Regional Telemetry... Syncing Knowledge Graph
              </motion.div>
            )}
          </div>
          
          <div className="flex-1 min-h-0">
             <AgentRoutingPanel t={t} severity={state.incident?.severity} confidence={state.incident?.confidence} isAnalyzing={isAnalyzing} />
          </div>

          <div className="flex-1 min-h-0">
             <SystemMonitor t={t} riskScore={riskScore} />
          </div>
        </div>

        {/* Center: Tactical Map & Objects */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 min-h-0">
          <div className="flex justify-center gap-2 mb-2">
            <button 
              onClick={() => setViewMode('map')}
              className={`px-5 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${viewMode === 'map' ? 'bg-accent text-white shadow-lg' : 'bg-panel text-textMuted border border-border'}`}
            >
              <Globe size={14} /> Regional Map
            </button>
            <button 
              onClick={() => setViewMode('object')}
              className={`px-5 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${viewMode === 'object' ? 'bg-accent text-white shadow-lg' : 'bg-panel text-textMuted border border-border'}`}
            >
              <LayoutGrid size={14} /> Ontology View
            </button>
          </div>

          <div className="flex-1 min-h-0 relative border border-white/5 rounded-lg overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              {viewMode === 'object' ? (
                <motion.div key="object" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  <OntologyPanel t={t} state={state} isAnalyzing={isAnalyzing} />
                </motion.div>
              ) : (
                <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  <MapView state={state} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Actions & Logs */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-hidden">
          <div className="flex-[3] min-h-0">
            <RecommendationPanel t={t} actions={state.actions || []} onActionStateChange={handleActionStateChange} isAnalyzing={isAnalyzing} />
          </div>
          <div className="flex-[2] min-h-0">
            <ActionLog t={t} logs={state.logs || []} />
          </div>
        </div>
      </main>

      {/* FOOTER / INFRA STATUS BAR */}
      <footer className="fixed bottom-0 left-0 right-0 h-6 bg-accent px-4 flex items-center justify-between text-[10px] text-white font-bold z-[1000] shadow-[0_-2px_10px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Cpu size={12} className="text-blue-200" />
            <span className="opacity-70 uppercase">Orchestrator:</span>
            <span className="tracking-widest">D-ROUTER-V2.5-STABLE</span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-yellow-300" />
            <span>AVG LATENCY: 38ms (P99)</span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <Shield className="text-green-300" size={12} />
            <span>BANDWIDTH SAVING: 92.4% (EDGE-OFFLOADING)</span>
          </div>
        </div>
        <div className="flex items-center gap-5 uppercase tracking-tighter font-mono text-[9px]">
          <span className="opacity-60">OBSERVABILITY: ACTIVE</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            NODE: LA-WEST-CORE-01
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
