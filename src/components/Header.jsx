import React from 'react';
import { 
  ShieldAlert, 
  Mic, 
  Activity, 
  CheckCircle2, 
  GitBranch, 
  FileText, 
  History, 
  Share2, 
  Database,
  Sparkles,
  Zap
} from 'lucide-react';

export default function Header({ 
  activeIncident, 
  incidents, 
  onSelectIncident, 
  activeTab, 
  setActiveTab, 
  onOpenVoiceModal,
  onResetIncident
}) {
  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20 pulse-red-glow">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                RescueOps AI
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                LIVE COMMAND CENTER
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Alert → Root Cause → Safe Recovery → Verified Resolution
            </p>
          </div>
        </div>

        {/* Incident Scenario Selector & Controls */}
        <div className="flex items-center gap-3">
          
          {/* Scenario Picker */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-slate-400 hidden md:inline">Scenario:</span>
            <select 
              value={activeIncident.id}
              onChange={(e) => onSelectIncident(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {incidents.map(inc => (
                <option key={inc.id} value={inc.id} className="bg-slate-900 text-slate-200">
                  {inc.id}: {inc.title.substring(0, 32)}... ({inc.severity})
                </option>
              ))}
            </select>
          </div>

          {/* Voice Incident Commander Button */}
          <button
            onClick={onOpenVoiceModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Voice Commander</span>
          </button>

          {/* Incident Reset / Recover simulator reset */}
          {activeIncident.status === 'RESOLVED' && (
            <button
              onClick={onResetIncident}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
            >
              Reset Scenario
            </button>
          )}
        </div>

      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 border-t border-slate-800/60 overflow-x-auto no-scrollbar">
        <TabButton 
          id="command" 
          label="Incident Command Center" 
          icon={Activity} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          badge={activeIncident.status === 'ACTIVE' ? '1 Active' : null}
          badgeColor="bg-red-500/20 text-red-400"
        />
        <TabButton 
          id="graph" 
          label="Memory Knowledge Graph" 
          icon={Database} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          badge="87% Match"
          badgeColor="bg-violet-500/20 text-violet-400"
        />
        <TabButton 
          id="changes" 
          label="Change Audit (60m)" 
          icon={GitBranch} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
        <TabButton 
          id="replay" 
          label="Incident Replay Scrubber" 
          icon={History} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
        <TabButton 
          id="postmortem" 
          label="Auto Postmortem Generator" 
          icon={FileText} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
      </div>
    </header>
  );
}

function TabButton({ id, label, icon: Icon, activeTab, setActiveTab, badge, badgeColor }) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
        isActive 
          ? 'border-red-500 text-red-400 bg-red-500/5' 
          : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
      <span>{label}</span>
      {badge && (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${badgeColor || 'bg-slate-800 text-slate-300'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}
