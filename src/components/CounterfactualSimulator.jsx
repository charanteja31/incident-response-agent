import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Play, Sparkles, DollarSign, ArrowUpRight } from 'lucide-react';

export default function CounterfactualSimulator({ incident, onSelectOption }) {
  const options = incident.remediationOptions || [];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              🧪 Counterfactual Recovery Simulator & Autonomous Remediation
            </h3>
            <p className="text-xs text-slate-400">
              Evidence-based remediation analysis with safety-policy enforcement
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          3 Safety Levels Active
        </span>
      </div>

      {/* Grid of Remediation Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => {
          const isRecommended = opt.recommended;
          const safetyColor = opt.safetyLevel === 'LEVEL_1' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              opt.safetyLevel === 'LEVEL_2' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                              'bg-red-500/20 text-red-400 border-red-500/30';

          const safetyLabel = opt.safetyLevel === 'LEVEL_1' ? 'Level 1 — Recommend' :
                              opt.safetyLevel === 'LEVEL_2' ? 'Level 2 — Guarded Auto' :
                              'Level 3 — Human Approval Required';

          return (
            <div 
              key={opt.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all relative ${
                isRecommended 
                  ? 'bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-500/10' 
                  : 'bg-slate-800/40 border-slate-700/80 hover:bg-slate-800/70'
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 uppercase tracking-wider shadow">
                  ⭐ AI RECOMMENDED (EVIDENCE-BASED)
                </div>
              )}

              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mt-1 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${safetyColor}`}>
                    {safetyLabel}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Risk: <span className={opt.riskLevel === 'LOW' ? 'text-emerald-400' : 'text-amber-400'}>{opt.riskLevel}</span>
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                  {opt.title}
                </h4>

                {/* Metrics */}
                <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800 text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Expected Recovery</span>
                    <span className="font-bold text-emerald-400 text-sm">{opt.expectedRecovery}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">Cost / Overhead</span>
                    <span className="font-mono text-slate-300 text-xs">{opt.cost}</span>
                  </div>
                </div>

                {/* Evidence bullets */}
                <div className="space-y-1.5 mb-4 text-xs text-slate-300">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Why this action?</span>
                  {opt.rationale.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectOption(opt)}
                disabled={incident.status === 'RESOLVED'}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                  incident.status === 'RESOLVED'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : isRecommended
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/20 active:scale-95'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{incident.status === 'RESOLVED' ? 'Incident Resolved' : 'Approve & Execute Option'}</span>
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}
