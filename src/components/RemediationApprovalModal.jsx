import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, X, Play, Lock, UserCheck } from 'lucide-react';

export default function RemediationApprovalModal({ option, incident, isOpen, onClose, onConfirm }) {
  const [engineerName, setEngineerName] = useState('Sarah Jenkins (SRE Team Alpha)');

  if (!isOpen || !option) return null;

  const isLevel3 = option.safetyLevel === 'LEVEL_3';

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -left-20 -top-20 w-60 h-60 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isLevel3 ? 'bg-red-500/20 border border-red-500/40 text-red-400' : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
            }`}>
              {isLevel3 ? <Lock className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Remediation Policy Safety Check
              </h3>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {option.safetyLevel === 'LEVEL_1' ? 'Level 1 — Recommend' :
                 option.safetyLevel === 'LEVEL_2' ? 'Level 2 — Guarded Automation' :
                 'Level 3 — Mandatory Human Approval'}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option Action Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            SELECTED REMEDIATION ACTION:
          </span>
          <h4 className="text-sm font-bold text-white">{option.title}</h4>
          
          <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800/80">
            <span className="text-emerald-400 font-bold">Expected Recovery: {option.expectedRecovery}%</span>
            <span className="text-slate-400">Risk: <strong className="text-white">{option.riskLevel}</strong></span>
          </div>
        </div>

        {/* Risk Analysis Checklist */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 block">AI Risk Analysis Summary:</span>
          <div className="space-y-1.5 text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            {option.rationale.map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engineer Signoff Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            Approving Engineer Signature:
          </label>
          <input
            type="text"
            value={engineerName}
            onChange={(e) => setEngineerName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(engineerName)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Confirm & Execute Remediation</span>
          </button>
        </div>

      </div>
    </div>
  );
}
