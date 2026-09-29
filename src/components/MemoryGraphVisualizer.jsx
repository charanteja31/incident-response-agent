import React, { useState } from 'react';
import { Database, Dna, Share2, Layers, GitBranch, ArrowRight, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

export default function MemoryGraphVisualizer({ incident }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = [
    { id: "INC-1042", label: "INC-1042 (Current)", type: "current", color: "border-red-500 bg-red-950/60 text-red-200 font-bold shadow-lg shadow-red-500/20", detail: "Active incident: Checkout API Latency & HTTP 500 Outage" },
    { id: "DNA-MATCH", label: `DNA: ${incident.dna}`, type: "dna", color: "border-indigo-500 bg-indigo-950/60 text-indigo-200 font-bold", detail: "Generated Incident DNA fingerprint matched with 87% memory precision." },
    { id: "SVC-PAYMENT", label: "Service: Payment API", type: "service", color: "border-cyan-500 bg-cyan-950/40 text-cyan-200", detail: "Microservice handling credit card & Stripe transactions." },
    { id: "ERR-500", label: "Error: DB Connection Timeout", type: "error", color: "border-amber-500 bg-amber-950/40 text-amber-200", detail: "PostgreSQL pool limit reached (10/10 active connections)." },
    { id: "DEP-V28", label: "Deployment: v2.8.1", type: "deployment", color: "border-purple-500 bg-purple-950/40 text-purple-200", detail: "Commit 8f92ab1 by Sarah Jenkins (12 mins ago)." },
    { id: "RC-POOL", label: "Root Cause: DB_POOL_SIZE=10", type: "root_cause", color: "border-red-400 bg-red-900/30 text-red-300 font-semibold", detail: "Helm chart misconfiguration reducing pool size by 80%." },
    { id: "FIX-ROLLBACK", label: "Fix: Rollback v2.8.1", type: "fix", color: "border-emerald-500 bg-emerald-950/60 text-emerald-200 font-bold", detail: "Recommended remediation action with 4/4 historical recovery success." },
    { id: "INC-76", label: "INC-76 (87% Match)", type: "history", color: "border-slate-600 bg-slate-800 text-slate-300", detail: "Historical incident on 2026-04-12. Resolved by Rollback v2.4.0." },
    { id: "INC-91", label: "INC-91 (81% Match)", type: "history", color: "border-slate-600 bg-slate-800 text-slate-300", detail: "Historical incident on 2026-06-05. Resolved by Pool expansion." },
    { id: "INC-104", label: "INC-104 (79% Match)", type: "history", color: "border-slate-600 bg-slate-800 text-slate-300", detail: "Historical incident on 2026-08-19. Resolved by Rollback." }
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              🧠 Incident Knowledge Graph Engine
            </h3>
            <p className="text-xs text-slate-400">
              Correlates active telemetry vectors with historical resolution memory graph
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Continuous Memory Loop Active</span>
        </div>
      </div>

      {/* Memory Graph Visualizer Canvas Area */}
      <div className="relative bg-slate-950/90 border border-slate-800 rounded-xl p-6 min-h-[420px] flex flex-col justify-between overflow-hidden">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

        {/* Top Node Row: Current Incident & DNA */}
        <div className="flex items-center justify-center gap-6 z-10">
          <GraphNode node={nodes[0]} onSelect={setSelectedNode} isSelected={selectedNode?.id === nodes[0].id} />
          <div className="w-12 h-0.5 bg-gradient-to-r from-red-500 to-indigo-500"></div>
          <GraphNode node={nodes[1]} onSelect={setSelectedNode} isSelected={selectedNode?.id === nodes[1].id} />
        </div>

        {/* Middle Node Row: Service, Error, Deployment */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 z-10 max-w-3xl mx-auto w-full">
          <GraphNode node={nodes[2]} onSelect={setSelectedNode} isSelected={selectedNode?.id === nodes[2].id} />
          <GraphNode node={nodes[3]} onSelect={setSelectedNode} isSelected={selectedNode?.id === nodes[3].id} />
          <GraphNode node={nodes[4]} onSelect={setSelectedNode} isSelected={selectedNode?.id === nodes[4].id} />
        </div>

        {/* Bottom Node Row: Root Cause & Fix */}
        <div className="flex items-center justify-center gap-6 z-10">
          <GraphNode node={nodes[5]} onSelect={setSelectedNode} isSelected={selectedNode?.id === nodes[5].id} />
          <div className="w-12 h-0.5 bg-gradient-to-r from-red-400 to-emerald-400"></div>
          <GraphNode node={nodes[6]} onSelect={setSelectedNode} isSelected={selectedNode?.id === nodes[6].id} />
        </div>

        {/* Historical Memory Match Sub-Graph */}
        <div className="border-t border-slate-800/80 pt-4 mt-6 z-10">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3 text-center">
            🔗 Historical Incident Memory Nodes (DNA Pattern Match: 87%):
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <GraphNode node={nodes[7]} onSelect={setSelectedNode} isSelected={selectedNode?.id === nodes[7].id} />
            <GraphNode node={nodes[8]} onSelect={setSelectedNode} isSelected={selectedNode?.id === nodes[8].id} />
            <GraphNode node={nodes[9]} onSelect={setSelectedNode} isSelected={selectedNode?.id === nodes[9].id} />
          </div>
        </div>

      </div>

      {/* Selected Node Details Box */}
      {selectedNode && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3 text-xs flex items-center justify-between">
          <div>
            <span className="font-bold text-white block mb-0.5">{selectedNode.label}</span>
            <span className="text-slate-300">{selectedNode.detail}</span>
          </div>
          <button 
            onClick={() => setSelectedNode(null)} 
            className="text-slate-400 hover:text-white text-[11px] underline ml-4"
          >
            Close
          </button>
        </div>
      )}

      {/* Why Memory Matters Card */}
      <div className="bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-900 border border-indigo-500/20 p-4 rounded-xl text-xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-300 font-bold">
          <Dna className="w-4 h-4" />
          <span>Why Memory Graph Matters (Closed-Loop Incident Learning)</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Instead of isolated log snippets, RescueOps AI stores incidents as structured Knowledge Graph nodes. When <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">{incident.dna}</code> occurs, the correlation engine traverses past resolutions, confirming that <span className="text-emerald-400 font-bold">Rollback v2.8.1</span> succeeded in 4 out of 4 previous occurrences.
        </p>
      </div>

    </div>
  );
}

function GraphNode({ node, onSelect, isSelected }) {
  return (
    <button
      onClick={() => onSelect(node)}
      className={`px-3.5 py-2.5 rounded-xl border text-xs transition-all duration-200 cursor-pointer text-center ${node.color} ${
        isSelected ? 'ring-2 ring-indigo-400 scale-105' : 'hover:scale-[1.03]'
      }`}
    >
      <span className="block leading-tight">{node.label}</span>
    </button>
  );
}
