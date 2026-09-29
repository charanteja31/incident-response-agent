import React, { useState } from 'react';
import { Activity, Terminal, ShieldAlert, Cpu, Database, AlertCircle, RefreshCw } from 'lucide-react';

export default function LiveTelemetryStream({ incident }) {
  const [filter, setFilter] = useState('ALL');
  const timeline = incident.timeline || [];

  const filteredTimeline = filter === 'ALL' 
    ? timeline 
    : timeline.filter(t => t.type === filter);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      
      {/* Title & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              🔥 Live Incident Intelligence Stream
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            </h3>
            <p className="text-xs text-slate-400">
              Multi-source telemetry timeline collected continuously across infrastructure & apps
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto max-w-full">
          {['ALL', 'DEPLOYMENT', 'METRIC', 'LOG', 'ALERT', 'SECURITY'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                filter === f ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Log Stream Window */}
      <div className="bg-[#070A0F] border border-slate-800 rounded-xl p-4 font-mono text-xs max-h-[320px] overflow-y-auto space-y-2.5 shadow-inner">
        {filteredTimeline.map((item, idx) => {
          const severityColors = {
            info: 'text-slate-300 border-slate-800',
            warning: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
            error: 'text-red-300 bg-red-500/10 border-red-500/30',
            critical: 'text-red-200 bg-red-600/20 border-red-500/50 font-bold',
            resolved: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
          };

          return (
            <div key={idx} className={`p-2 rounded border flex items-start gap-3 transition-all ${severityColors[item.severity] || severityColors.info}`}>
              <span className="text-[11px] text-slate-500 shrink-0 font-bold">{item.time}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 uppercase tracking-wider text-slate-300 shrink-0">
                {item.type}
              </span>
              <span className="leading-snug break-all">{item.text}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
