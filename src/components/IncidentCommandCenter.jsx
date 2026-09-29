import React from 'react';
import { 
  ShieldAlert, 
  Clock, 
  Users, 
  Target, 
  CheckCircle2, 
  AlertTriangle,
  Dna,
  Zap,
  RotateCcw
} from 'lucide-react';
import IncidentDnaBanner from './IncidentDnaBanner';
import RootCauseChain from './RootCauseChain';
import BlastRadiusMap from './BlastRadiusMap';
import PredictiveRiskTimeline from './PredictiveRiskTimeline';
import CounterfactualSimulator from './CounterfactualSimulator';
import LiveTelemetryStream from './LiveTelemetryStream';
import IncidentCommanderChat from './IncidentCommanderChat';

export default function IncidentCommandCenter({ incident, onSelectOption }) {
  const isResolved = incident.status === 'RESOLVED';

  return (
    <div className="space-y-6">
      
      {/* Active Incident Header Banner (Command Center Layout) */}
      <div className={`rounded-2xl border p-6 shadow-2xl relative overflow-hidden transition-all ${
        isResolved 
          ? 'bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-emerald-500/40'
          : 'bg-gradient-to-r from-slate-900 via-red-950/40 to-slate-900 border-red-500/40'
      }`}>
        
        {/* Background Ambient Glow */}
        <div className={`absolute -right-10 -top-10 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isResolved ? 'bg-emerald-500/10' : 'bg-red-500/10'
        }`}></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div>
            {/* Status Pills */}
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider flex items-center gap-1.5 ${
                isResolved 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30 pulse-red-glow'
              }`}>
                {isResolved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    RESOLVED & VERIFIED
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
                    🔴 ACTIVE INCIDENT #{incident.id}
                  </>
                )}
              </span>

              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Service: {incident.service}
              </span>

              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {incident.severity} SEVERITY
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {incident.title}
            </h2>

            <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {incident.summary}
            </p>
          </div>

          {/* Key Metrics Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <StatBox icon={Users} label="Affected Users" value={incident.affectedUsers?.toLocaleString()} color="text-yellow-400" />
            <StatBox icon={Clock} label="Duration" value={`${Math.floor(incident.durationSeconds / 60)}m ${incident.durationSeconds % 60}s`} color="text-amber-400" />
            <StatBox icon={Target} label="Blast Radius" value={`${incident.blastRadiusScore} / 10`} color="text-orange-400" />
          </div>

        </div>
      </div>

      {/* Incident DNA Fingerprint Banner */}
      <IncidentDnaBanner incident={incident} />

      {/* Top Grid: Root Cause DAG & Predictive Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RootCauseChain incident={incident} />
        <PredictiveRiskTimeline incident={incident} />
      </div>

      {/* Counterfactual Simulator & Remediation Panel */}
      <CounterfactualSimulator incident={incident} onSelectOption={onSelectOption} />

      {/* Middle Grid: Blast Radius & AI Commander Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BlastRadiusMap incident={incident} />
        <IncidentCommanderChat incident={incident} />
      </div>

      {/* Bottom Grid: Live Telemetry Stream */}
      <LiveTelemetryStream incident={incident} />

    </div>
  );
}

function StatBox({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center min-w-[110px]">
      <Icon className={`w-4 h-4 ${color} mb-1`} />
      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">{label}</span>
      <span className="text-sm font-extrabold text-white font-mono">{value}</span>
    </div>
  );
}
