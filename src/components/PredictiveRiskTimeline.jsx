import React from 'react';
import { HelpCircle, AlertTriangle, TrendingUp, Clock, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function PredictiveRiskTimeline({ incident }) {
  const projection = incident.doNothingProjection || {
    currentPool: "90%",
    riskLevel: "HIGH",
    timeline: [],
    reasoning: "Telemetry extrapolation shows imminent degradation."
  };

  const chartData = projection.timeline.map(item => ({
    time: item.time,
    users: item.userImpact
  }));

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              🔮 "What Happens If We Do Nothing?"
            </h3>
            <p className="text-xs text-slate-400">
              Predictive incident timeline based on historical telemetry curves
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          Risk Rating: {projection.riskLevel}
        </span>
      </div>

      {/* Projection Chart & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4">
        
        {/* Step-by-step projection steps */}
        <div className="space-y-2">
          {projection.timeline.map((step, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono font-bold text-amber-300">{step.time}</span>
                <span className="text-slate-300 font-medium">{step.status}</span>
              </div>
              <span className="font-mono text-red-400 font-semibold">
                +{step.userImpact?.toLocaleString()} users
              </span>
            </div>
          ))}
        </div>

        {/* Small Area Chart */}
        <div className="h-40 bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-mono">Projected User Impact Escalation</span>
          <div className="w-full h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#374151', fontSize: '11px' }}
                  labelStyle={{ color: '#F8FAFC' }}
                />
                <Area type="monotone" dataKey="users" stroke="#EF4444" fillOpacity={1} fill="url(#riskGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Rationale Note */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-300">
        <span className="font-bold text-amber-400">AI Predictive Reason:</span>{" "}
        {projection.reasoning}
      </div>

    </div>
  );
}
