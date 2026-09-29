import React from 'react';
import { 
  GitCommit, 
  Sliders, 
  Database, 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Network,
  Zap,
  Globe,
  HardDrive,
  Cpu
} from 'lucide-react';

const iconMap = {
  GitCommit,
  Sliders,
  Database,
  Activity,
  AlertTriangle,
  Zap,
  Globe,
  HardDrive,
  Cpu
};

export default function RootCauseChain({ incident }) {
  const dagNodes = incident.correlationDag || [];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Network className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              ⚡ Root Cause Correlation Engine
            </h3>
            <p className="text-xs text-slate-400">
              Correlated 5 raw alerts into 1 unified root-cause dependency chain
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Root Cause Identified
        </span>
      </div>

      {/* Root Cause Summary Highlight */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border-l-4 border-red-500 p-3 rounded-r-lg mb-5 text-xs text-slate-200">
        <span className="font-bold text-red-400">Probable Root Cause:</span>{" "}
        <span className="font-semibold text-white">{incident.rootCause}</span>
      </div>

      {/* Interactive Horizontal DAG Chain */}
      <div className="relative overflow-x-auto py-2">
        <div className="flex items-center gap-3 min-w-max">
          {dagNodes.map((node, index) => {
            const Icon = iconMap[node.icon] || AlertTriangle;
            const isFirst = index === 0;
            const isLast = index === dagNodes.length - 1;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div className={`p-3.5 rounded-xl border flex flex-col gap-1 max-w-[190px] min-w-[160px] transition-all hover:scale-[1.02] shadow-md ${
                  isFirst 
                    ? 'bg-purple-950/30 border-purple-500/40 text-purple-200' 
                    : isLast 
                    ? 'bg-red-950/40 border-red-500/40 text-red-200'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isFirst ? 'text-purple-400' : isLast ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {node.type}
                    </span>
                    <Icon className={`w-4 h-4 ${
                      isFirst ? 'text-purple-400' : isLast ? 'text-red-400' : 'text-amber-400'
                    }`} />
                  </div>

                  <span className="text-xs font-bold leading-tight mt-1">
                    {node.label}
                  </span>

                  <span className="text-[11px] opacity-75 font-mono">
                    {node.subtitle}
                  </span>
                </div>

                {/* Arrow Connector */}
                {!isLast && (
                  <div className="flex items-center justify-center text-slate-600">
                    <ArrowRight className="w-5 h-5 animate-pulse text-indigo-400" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
