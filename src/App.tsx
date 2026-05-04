import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Globe, Cpu, Zap, Search } from 'lucide-react';
import { IncidentInput } from './components/IncidentInput';
import { OntologyPanel } from './components/OntologyPanel';
import { RecommendationPanel } from './components/RecommendationPanel';
import { ActionLog } from './components/ActionLog';
import { MapView } from './components/MapView';
import { AgentRoutingPanel } from './components/AgentRoutingPanel';
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
  const [viewMode, setViewMode] = useState<'object' | 'map'>('object');
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
    // Simulate Knowledge Ingestion for new areas
    const isNewArea = !state.location;
    if (isNewArea) setIsIngesting(true);

    setTimeout(() => {
      const result = parseIncident(text, lang, state as SystemState);
      const newLog: LogEntry = {
        id: Math.random().toString(),
        timestamp: new Date().toISOString(),
        message: isNewArea ? `Area context ingested. Knowledge base synced for ${result.location?.name}.` : `Incident triaged: ${result.incident?.type}`,
        actor: 'System',
        type: 'system'
      };

      setState(prev => ({
        ...prev,
        ...result,
        logs: [newLog, ...(prev.logs || [])]
      }));
      setIsAnalyzing(false);
      setIsIngesting(false);
    }, 1500);
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
          message: "Conflict detected in multi-modal inputs. Escalated to Cloud Reasoning Agent.",
          actor: 'System',
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
      message: `${action.title} — ${newState}`,
      actor: 'Operator',
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
      {/* PROFESSIONAL HEADER */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-md sticky top-0 z-50 px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-accent p-2 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tighter uppercase">{t.title}</h1>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  REGIONAL OPS CENTER: LOS ANGELES
                </div>
              </div>
              <p className="text-[11px] text-textMuted font-medium uppercase tracking-widest mt-0.5 opacity-80">
                Multi-Domain Operational Intelligence Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <div className="text-[10px] text-textMuted uppercase font-bold tracking-tighter mb-1">Regional Risk Index</div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${riskScore}%` }}
                    className={`h-full ${riskScore > 70 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  />
                </div>
                <span className={`text-lg font-mono font-bold ${riskScore > 70 ? 'text-red-500' : 'text-accent'}`}>{riskScore}%</span>
              </div>
            </div>

            <div className="h-10 w-px bg-border" />

            <button 
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-border hover:bg-white/10 transition-all text-xs font-bold"
            >
              <Globe size={14} />
              {lang === 'en' ? '中文' : 'EN'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-6 grid grid-cols-12 gap-6 h-[calc(100vh-80px)]">
        {/* Left Column: Input & Routing */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 min-h-0 relative">
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-x-4 bottom-24 p-3 bg-blue-600/90 text-white text-[10px] rounded font-bold flex items-center gap-2 z-50 shadow-2xl"
              >
                <Search size={14} className="animate-bounce" />
                INGESTING REGIONAL KNOWLEDGE... SYNCING INFRASTRUCTURE MAP
              </motion.div>
            )}
          </div>
          
          <AgentRoutingPanel 
            t={t}
            severity={state.incident?.severity}
            confidence={state.incident?.confidence}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Center: Operational Twin / Map */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 min-h-0">
          <div className="bg-panel border border-border rounded-lg p-1 flex gap-1 w-fit mx-auto mb-2">
            <button 
              onClick={() => setViewMode('object')}
              className={`px-4 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase transition-all ${viewMode === 'object' ? 'bg-accent text-white shadow-lg' : 'text-textMuted hover:text-white'}`}
            >
              System Objects
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`px-4 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase transition-all ${viewMode === 'map' ? 'bg-accent text-white shadow-lg' : 'text-textMuted hover:text-white'}`}
            >
              Regional Map
            </button>
          </div>

          <div className="flex-1 min-h-0 relative border border-white/5 rounded-lg overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              {viewMode === 'object' ? (
                <motion.div 
                  key="object"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="h-full"
                >
                  <OntologyPanel t={t} state={state} isAnalyzing={isAnalyzing} />
                </motion.div>
              ) : (
                <motion.div 
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <MapView state={state} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Actions & Logs */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-hidden">
          <div className="flex-[3] min-h-0">
            <RecommendationPanel 
              t={t} 
              actions={state.actions || []} 
              onActionStateChange={handleActionStateChange}
              isAnalyzing={isAnalyzing}
            />
          </div>
          <div className="flex-[2] min-h-0">
            <ActionLog t={t} logs={state.logs || []} />
          </div>
        </div>
      </main>

      {/* FOOTER / INFRA STATUS BAR */}
      <footer className="fixed bottom-0 left-0 right-0 h-6 bg-accent px-4 flex items-center justify-between text-[10px] text-white font-bold z-[1000] shadow-[0_-2px_10px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <Cpu size={12} className="text-blue-200" />
            <span className="opacity-80">AGENT ENGINE:</span>
            <span className="tracking-widest uppercase">Collaborative-Router-v2.5</span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-1.5 text-blue-100">
            <Zap size={12} className="text-yellow-300" />
            <span>REGION: CALIFORNIA-SW (LA-CORE)</span>
          </div>
        </div>
        <div className="flex items-center gap-4 uppercase tracking-tighter font-mono">
          <span className="opacity-60">CONTEXT-AWARE CACHING: ENABLED</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE-NODE: LA-WEST-NODE-01
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
