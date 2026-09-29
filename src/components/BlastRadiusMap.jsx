import React from 'react';
import { Target, AlertOctagon, AlertTriangle, CheckCircle, Users, DollarSign, Layers } from 'lucide-react';

export default function BlastRadiusMap({ incident }) {
  const blast = incident.blastRadius || {
    affectedServicesCount: 0,
    affectedApisCount: 0,
    potentialUsers: 0,
    revenueCritical: false,
    dependencyDepth: 0,
    nodes: []
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
      
      {/* Header & Score Metric */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              🎯 Blast Radius & Dependency Impact
            </h3>
            <p className="text-xs text-slate-400">
              Evaluates cascading risk across service dependencies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-lg">
          <span className="text-xs text-slate-400">Score:</span>
          <span className="text-sm font-black text-orange-400 font-mono">
            {incident.blastRadiusScore} / 10
          </span>
        </div>
      </div>

      {/* Metric Breakdown Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <MetricCard label="Affected Services" value={blast.affectedServicesCount} icon={Layers} color="text-orange-400" />
        <MetricCard label="Affected APIs" value={blast.affectedApisCount} icon={AlertOctagon} color="text-red-400" />
        <MetricCard label="Impacted Users" value={blast.potentialUsers?.toLocaleString()} icon={Users} color="text-yellow-400" />
        <MetricCard label="Revenue Critical" value={blast.revenueCritical ? 'YES' : 'NO'} icon={DollarSign} color={blast.revenueCritical ? 'text-red-400 font-bold' : 'text-slate-400'} />
      </div>

      {/* Service Dependency Topology Flow */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Service Dependency Cascading Topology:
        </span>

        {blast.nodes.map((node) => {
          const statusColors = {
            CRITICAL: 'bg-red-500/10 border-red-500/40 text-red-400',
            AT_RISK: 'bg-orange-500/10 border-orange-500/40 text-orange-400',
            POSSIBLE_IMPACT: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400',
            STABLE: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
          };

          const statusBadges = {
            CRITICAL: '🔴 Critical Outage',
            AT_RISK: '🟠 High Risk',
            POSSIBLE_IMPACT: '🟡 Possible Impact',
            STABLE: '🟢 Healthy'
          };

          return (
            <div 
              key={node.id} 
              className={`p-3 rounded-lg border flex items-center justify-between transition-all ${statusColors[node.status] || 'bg-slate-800 border-slate-700'}`}
              style={{ marginLeft: `${node.depth * 16}px` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-current animate-ping"></div>
                <div>
                  <span className="text-xs font-bold text-white block">{node.name}</span>
                  <span className="text-[11px] text-slate-400 font-mono">Depth L{node.depth}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-slate-300">
                  {node.users.toLocaleString()} users
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded border border-current">
                  {statusBadges[node.status]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5 flex items-center gap-3">
      <Icon className={`w-4 h-4 ${color}`} />
      <div>
        <span className="text-[10px] text-slate-400 block uppercase font-mono">{label}</span>
        <span className={`text-xs font-bold ${color}`}>{value}</span>
      </div>
    </div>
  );
}
