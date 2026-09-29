import React from 'react';
import { Dna, ShieldAlert, Sparkles, CheckCircle2, History, ArrowRight } from 'lucide-react';

export default function IncidentDnaBanner({ incident }) {
  const parts = incident.dna.split('-');

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-xl p-4 shadow-xl mb-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        
        {/* Left DNA Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Dna className="w-7 h-7 text-white animate-spin-slow" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold tracking-wider text-indigo-400 uppercase">
                INCIDENT DNA FINGERPRINT
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                ⭐ WOW FEATURE
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <span className="text-xl md:text-2xl font-black font-mono tracking-wider bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                {incident.dna}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              "Every incident leaves DNA. RescueOps remembers it and matches historical patterns."
            </p>
          </div>
        </div>

        {/* DNA Tag Breakdown */}
        <div className="flex flex-wrap items-center gap-2">
          <DnaTag label="SERVICE" value={parts[0] || 'PAY'} color="border-cyan-500/40 bg-cyan-500/10 text-cyan-300" />
          <DnaTag label="ERROR" value={parts[1] || '500'} color="border-red-500/40 bg-red-500/10 text-red-300" />
          <DnaTag label="SYMPTOM" value={parts[2] || 'DBPOOL'} color="border-amber-500/40 bg-amber-500/10 text-amber-300" />
          <DnaTag label="TRIGGER" value={parts[3] || 'DEPLOY'} color="border-purple-500/40 bg-purple-500/10 text-purple-300" />
        </div>

        {/* Memory Match Summary Card */}
        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-lg p-3 min-w-[220px] shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-indigo-400" />
              Graph Memory Match
            </span>
            <span className="font-bold text-emerald-400">{incident.similarityScore}% Match</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${incident.similarityScore}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-300 font-medium">
            Resembles <span className="font-bold text-indigo-300">{incident.historicalMatchCount} previous incidents</span> in Memory Graph.
          </div>
        </div>

      </div>
    </div>
  );
}

function DnaTag({ label, value, color }) {
  return (
    <div className={`px-2.5 py-1 rounded-md border text-xs font-mono font-bold flex flex-col items-center justify-center ${color}`}>
      <span className="text-[9px] opacity-70 uppercase tracking-wider">{label}</span>
      <span>{value}</span>
    </div>
  );
}
