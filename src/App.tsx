import React, { useState } from 'react';
import { IncidentInput } from './components/IncidentInput';
import { OntologyPanel } from './components/OntologyPanel';
import { RecommendationPanel } from './components/RecommendationPanel';
import { ActionLog } from './components/ActionLog';
import { SystemState, RecommendedAction, LogEntry } from './types';
import { parseIncident, generateId } from './utils/parser';
import { Activity } from 'lucide-react';

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

function App() {
  const [state, setState] = useState<Partial<SystemState>>({
    logs: [],
    rawInput: ''
  });

  const handleAnalyze = (text: string) => {
    const parsedState = parseIncident(text);
    
    setState({
      ...parsedState,
      rawInput: text,
      logs: [
        ...(state.logs || []),
        {
          id: generateId(),
          timestamp: formatTime(),
          message: 'Incident report parsed into operational objects. Severity: High.',
          actor: 'System',
          type: 'system'
        }
      ]
    });
  };

  const handleSimulateSecond = () => {
    const secondReport = "Update: smoke spreading to the east entrance. Crowd forming outside the building.";
    const escalatedState = parseIncident(secondReport, state as SystemState);
    
    // We merge the old actions (keeping approved ones) with new actions, just for demo simplicity we append
    const updatedActions = [
      ...(state.actions || []).map(a => ({ ...a, state: a.state === 'Pending' ? 'Rejected' : a.state })), // Auto-reject pending old actions on escalation
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
          message: 'Second report received. Severity escalated: High → Critical.',
          actor: 'System',
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
      message: `Action: ${action.title} - ${newState}`,
      actor: 'Operator',
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
           newTeams = prev.teams.map(t => t.name === 'Campus Safety' ? { ...t, status: 'Assigned' } : t);
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
      <header className="flex items-center gap-3 px-6 py-4 bg-panel border-b border-border shadow-md z-10">
        <div className="bg-accent/20 p-2 rounded border border-accent/50">
          <Activity className="text-accent" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wider uppercase text-white">CrisisOps AI</h1>
          <p className="text-xs text-accent font-mono tracking-widest uppercase">Emergency Response Operations Agent</p>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 overflow-hidden p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {/* Left Panel */}
          <div className="h-full">
            <IncidentInput 
              onAnalyze={handleAnalyze} 
              onSimulateSecond={handleSimulateSecond}
              hasInitialReport={!!state.incident}
            />
          </div>

          {/* Middle Panel */}
          <div className="h-full">
            <OntologyPanel state={state} />
          </div>

          {/* Right Panel */}
          <div className="h-full">
            <RecommendationPanel 
              actions={state.actions || []} 
              onActionStateChange={handleActionStateChange}
            />
          </div>
        </div>
      </main>

      {/* Bottom Log Panel */}
      <ActionLog logs={state.logs || []} />
    </div>
  );
}

export default App;
