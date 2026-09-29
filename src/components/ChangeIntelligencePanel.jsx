import React from 'react';
import { GitBranch, GitCommit, Sliders, Server, Flag, Clock, ArrowRight, CheckCircle } from 'lucide-react';

export default function ChangeIntelligencePanel({ incident }) {
  const changes = incident.changesLast60Min || {
    deployments: [],
    codeCommits: [],
    configurations: [],
    infrastructure: [],
    featureFlags: []
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              🕵️ Change Intelligence — "What Changed?" (LAST 60 MINUTES)
            </h3>
            <p className="text-xs text-slate-400">
              Audit trail of deployments, commits, configuration flags, and infra events
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
          5 Changes Tracked
        </span>
      </div>

      {/* Grid of Change Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Deployments & Commits */}
        <ChangeSection title="Deployments & Git Commits" icon={GitCommit} color="text-purple-400">
          {changes.deployments.map((dep, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-800/80 border border-purple-500/30 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                  {dep.name} <code className="text-purple-300 font-mono">{dep.version}</code>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{dep.time}</span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Commit <span className="text-indigo-400">{dep.commit}</span> by {dep.author}
              </p>
            </div>
          ))}

          {changes.codeCommits.map((c, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono">
              <span className="text-purple-400 font-bold">[{c.hash}]</span> {c.message}
            </div>
          ))}
        </ChangeSection>

        {/* Configurations */}
        <ChangeSection title="Configuration Changes" icon={Sliders} color="text-amber-400">
          {changes.configurations.length > 0 ? (
            changes.configurations.map((cfg, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-800/80 border border-amber-500/30 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 font-mono">{cfg.key}</span>
                  <span className="text-[11px] text-slate-400">by {cfg.modifiedBy}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-slate-300 bg-slate-950 p-2 rounded">
                  <span className="text-red-400 line-through">{cfg.oldVal}</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span className="text-emerald-400 font-bold">{cfg.newVal}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 italic">No configuration modifications in last 60m</div>
          )}
        </ChangeSection>

        {/* Infrastructure Events */}
        <ChangeSection title="Infrastructure & K8s Events" icon={Server} color="text-cyan-400">
          {changes.infrastructure.map((inf, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-white">
                <span>{inf.event}</span>
                <span className="text-[11px] text-slate-400 font-mono">{inf.time}</span>
              </div>
              <p className="text-slate-300">{inf.detail}</p>
            </div>
          ))}
        </ChangeSection>

        {/* Feature Flags */}
        <ChangeSection title="Feature Flags" icon={Flag} color="text-emerald-400">
          {changes.featureFlags.length > 0 ? (
            changes.featureFlags.map((flag, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs flex items-center justify-between">
                <span className="font-mono font-bold text-slate-200">{flag.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {flag.state} ({flag.rollout})
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 italic">No feature flag toggles in last 60m</div>
          )}
        </ChangeSection>

      </div>

      {/* Correlation Pipeline */}
      <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-300">
        <span className="font-bold text-purple-400">Change Correlation Path:</span>
        <div className="flex items-center gap-2 font-mono text-[11px] overflow-x-auto">
          <span className="bg-slate-800 px-2 py-1 rounded">Change</span>
          <ArrowRight className="w-3 h-3 text-purple-400 shrink-0" />
          <span className="bg-slate-800 px-2 py-1 rounded">Telemetry Deviation</span>
          <ArrowRight className="w-3 h-3 text-purple-400 shrink-0" />
          <span className="bg-slate-800 px-2 py-1 rounded text-red-400">Error Spike</span>
          <ArrowRight className="w-3 h-3 text-purple-400 shrink-0" />
          <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded font-bold">Incident</span>
        </div>
      </div>

    </div>
  );
}

function ChangeSection({ title, icon: Icon, color, children }) {
  return (
    <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-slate-800 pb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span>{title}</span>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}
