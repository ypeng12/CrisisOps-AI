import { useState } from 'react';
import { IncidentInput } from './components/IncidentInput';
import { OntologyPanel } from './components/OntologyPanel';
import { RecommendationPanel } from './components/RecommendationPanel';
import { ActionLog } from './components/ActionLog';
import { SystemState, LogEntry } from './types';
import { parseIncident, generateId } from './utils/parser';
import { translations, Language } from './utils/i18n';
import { Activity, Languages } from 'lucide-react';

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  const [state, setState] = useState<Partial<SystemState>>({
    logs: [],
    rawInput: ''
  });

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const handleAnalyze = (text: string) => {
    const parsedState = parseIncident(text, lang);
    
    setState({
      ...parsedState,
      rawInput: text,
      logs: [
        ...(state.logs || []),
        {
          id: generateId(),
          timestamp: formatTime(),
          message: lang === 'zh' ? '警情报告已解析为运营对象。严重程度：高。' : 'Incident report parsed into operational objects. Severity: High.',
          actor: t.system,
          type: 'system'
        }
      ]
    });
  };

  const handleSimulateSecond = () => {
    const secondReport = lang === 'zh' ? '更新：火势正向东门扩散。建筑外有大量人群聚集。' : "Update: smoke spreading to the east entrance. Crowd forming outside the building.";
    const escalatedState = parseIncident(secondReport, lang, state as SystemState);
    
    const updatedActions = [
      ...(state.actions || []).map(a => ({ ...a, state: a.state === 'Pending' ? 'Rejected' : (a.state as any) })),
      ...(escalatedState.actions || [])
    ];

    setState(prev => ({
      ...prev,
      ...escalatedState,
      actions: updatedActions,
      rawInput: prev.rawInput + "\n\n" + secondReport,
      logs: [
        ...(prev.logs || []),
        {
          id: generateId(),
          timestamp: formatTime(),
          message: lang === 'zh' ? '收到后续报告。事态升级：高 → 紧急。' : 'Second report received. Severity escalated: High → Critical.',
          actor: t.system,
          type: 'system'
        }
      ]
    }));
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
      // Simulate state transition based on approval
      let newLocationStatus = prev.location?.status;
      let newTeams = prev.teams;

      if (newState === 'Approved') {
        if (action.title.includes('Restrict Building Access') && prev.location) {
          newLocationStatus = 'Restricted';
        }
        if (action.title.includes('Dispatch Campus Safety') && prev.teams) {
           newTeams = prev.teams?.map(t => t.name.includes('Campus Safety') || t.name.includes('安保') ? { ...t, status: 'Assigned' } : t);
        }
      }

      return {
        ...prev,
        actions: updatedActions,
        location: prev.location ? { ...prev.location, status: newLocationStatus || prev.location.status } : undefined,
        teams: newTeams,
        logs: [...(prev.logs || []), logEntry]
      };
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background text-textMain overflow-hidden font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-panel border-b border-border shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 p-2 rounded border border-accent/50">
            <Activity className="text-accent" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider uppercase text-white">{t.title}</h1>
            <p className="text-xs text-accent font-mono tracking-widest uppercase">{t.subtitle}</p>
          </div>
        </div>
        
        <button 
          onClick={toggleLang}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-background hover:bg-panel transition-colors text-xs font-medium"
        >
          <Languages size={14} className="text-accent" />
          {lang === 'en' ? '中文' : 'English'}
        </button>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 overflow-hidden p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {/* Left Panel */}
          <div className="h-full min-h-0">
            <IncidentInput 
              t={t}
              onAnalyze={handleAnalyze} 
              onSimulateSecond={handleSimulateSecond}
              hasInitialReport={!!state.incident}
            />
          </div>

          {/* Middle Panel */}
          <div className="h-full min-h-0">
            <OntologyPanel t={t} state={state} />
          </div>

          {/* Right Panel */}
          <div className="h-full min-h-0">
            <RecommendationPanel 
              t={t}
              actions={state.actions || []} 
              onActionStateChange={handleActionStateChange}
            />
          </div>
        </div>
      </main>

      {/* Bottom Log Panel */}
      <ActionLog t={t} logs={state.logs || []} />
    </div>
  );
}

export default App;
