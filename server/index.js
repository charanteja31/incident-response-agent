import express from 'express';
import cors from 'cors';
import { initialIncidents } from './data/incidentsData.js';
import { generateIncidentDna, matchDnaSimilarity } from './dnaEngine.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory state
let incidents = [...initialIncidents];
let postmortems = [];
let memoryGraphNodes = [
  { id: "INC-1042", label: "INC-1042: Checkout API Latency Spike", type: "incident", status: "ACTIVE", dna: "PAY-500-DBPOOL-DEPLOY" },
  { id: "INC-76", label: "INC-76: DB Pool Exhaustion v2.4.0", type: "historical_incident", status: "RESOLVED", recoveryRate: "100%" },
  { id: "INC-91", label: "INC-91: Payment Timeout Surge", type: "historical_incident", status: "RESOLVED", recoveryRate: "100%" },
  { id: "INC-104", label: "INC-104: PostgreSQL Socket Saturation", type: "historical_incident", status: "RESOLVED", recoveryRate: "95%" },
  { id: "SVC-PAYMENT", label: "Payment API Service", type: "service" },
  { id: "ERR-500", label: "HTTP 500 & Connection Timeout", type: "error" },
  { id: "DEP-v2.8.1", label: "Deployment v2.8.1", type: "deployment" },
  { id: "RC-POOL", label: "Root Cause: DB_POOL_SIZE=10", type: "root_cause" },
  { id: "FIX-ROLLBACK", label: "Fix: Rollback v2.8.1", type: "remediation", successRate: "4/4 (100%)" },
  { id: "TEAM-ALPHA", label: "SRE Team Alpha", type: "team" }
];

let memoryGraphEdges = [
  { source: "INC-1042", target: "SVC-PAYMENT", label: "affects" },
  { source: "INC-1042", target: "ERR-500", label: "exhibits" },
  { source: "INC-1042", target: "DEP-v2.8.1", label: "triggered_by" },
  { source: "INC-1042", target: "RC-POOL", label: "caused_by" },
  { source: "INC-1042", target: "FIX-ROLLBACK", label: "recommends" },
  { source: "FIX-ROLLBACK", target: "TEAM-ALPHA", label: "executed_by" },
  { source: "INC-1042", target: "INC-76", label: "resembles (87%)" },
  { source: "INC-1042", target: "INC-91", label: "resembles (81%)" },
  { source: "INC-1042", target: "INC-104", label: "resembles (79%)" }
];

// Routes
app.get('/api/incidents', (req, res) => {
  res.json({ incidents });
});

app.get('/api/incidents/:id', (req, res) => {
  const incident = incidents.find(i => i.id === req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });
  res.json({ incident });
});

app.post('/api/remediate', (req, res) => {
  const { incidentId, optionId, approvedBy } = req.body;
  const incident = incidents.find(i => i.id === incidentId);
  
  if (!incident) return res.status(404).json({ error: 'Incident not found' });

  const selectedOpt = incident.remediationOptions.find(o => o.id === optionId);
  if (!selectedOpt) return res.status(400).json({ error: 'Invalid option' });

  // Update status
  incident.status = 'RESOLVED';
  incident.resolvedAt = new Date().toISOString();
  incident.resolvedBy = approvedBy || 'AI Autonomous Guard';
  incident.executedOption = selectedOpt;
  incident.timeline.push({
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    type: "REMEDIATION",
    text: `✅ Action Executed: ${selectedOpt.title} (Approved by ${incident.resolvedBy})`,
    severity: "resolved"
  });

  incident.timeline.push({
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    type: "RECOVERY",
    text: `🎉 Metrics normalized. Connection pool utilization back to 24%. HTTP 500 error rate: 0.0%`,
    severity: "resolved"
  });

  // Learn & add node to memory graph
  memoryGraphNodes.push({
    id: `RESOLVED-${incident.id}`,
    label: `${incident.id}: Resolved via ${selectedOpt.title}`,
    type: "historical_incident",
    status: "RESOLVED",
    recoveryRate: "100%"
  });

  res.json({
    success: true,
    message: `Remediation executed successfully: ${selectedOpt.title}`,
    incident
  });
});

app.get('/api/memory-graph', (req, res) => {
  res.json({ nodes: memoryGraphNodes, edges: memoryGraphEdges });
});

app.post('/api/postmortem', (req, res) => {
  const postmortem = req.body;
  postmortem.id = `PM-${Date.now()}`;
  postmortem.createdAt = new Date().toISOString();
  postmortems.push(postmortem);

  // Feeding back into Memory Graph for Continuous Learning Loop
  memoryGraphNodes.push({
    id: postmortem.id,
    label: `Postmortem: ${postmortem.title}`,
    type: "postmortem",
    status: "LEARNED"
  });

  memoryGraphEdges.push({
    source: postmortem.incidentId || "INC-1042",
    target: postmortem.id,
    label: "stored_knowledge"
  });

  res.json({
    success: true,
    message: "Postmortem saved & persisted into Incident Memory Graph for continuous learning.",
    postmortem
  });
});

// AI Incident Commander Conversational endpoint
app.post('/api/chat', (req, res) => {
  const { question, incidentId } = req.body;
  const incident = incidents.find(i => i.id === incidentId) || incidents[0];

  let answer = "";
  const q = question.toLowerCase();

  if (q.includes("why") || q.includes("cause") || q.includes("failing") || q.includes("what happened")) {
    answer = `Checkout failures increased 34% during the last 8 minutes. RescueOps AI correlated this with **Deployment ${incident.changesLast60Min.deployments[0]?.version || 'v2.8.1'}**, which altered \`DB_POOL_SIZE\` from 50 to 10 connections, causing PostgreSQL pool saturation (92%).`;
  } else if (q.includes("seen this before") || q.includes("similar") || q.includes("history") || q.includes("memory")) {
    answer = `Yes! Memory Graph lookup shows **3 historical incidents** matching Incident DNA \`${incident.dna}\` with 87% similarity:\n- **INC-76**: Resolved by Rollback v2.4.0 (100% recovery)\n- **INC-91**: Resolved by Pool Expansion\n- **INC-104**: Resolved by Rollback.`;
  } else if (q.includes("what should i do") || q.includes("action") || q.includes("fix") || q.includes("recommend")) {
    answer = `**Recommended Action**: Rollback deployment **${incident.changesLast60Min.deployments[0]?.version || 'v2.8.1'}**.\n- **Confidence**: 94% High\n- **Risk**: Low (Level 3 Human Approval Required)\n- **Why**: 4 out of 4 historical incidents with identical telemetry were resolved by rollback.`;
  } else if (q.includes("nothing") || q.includes("do nothing") || q.includes("risk")) {
    answer = `**Projected Failure Timeline**:\n- **+5 min**: Pool reaches 96% (15,200 users affected)\n- **+10 min**: 100% Exhaustion (Order Service cascade)\n- **+20 min**: Total Checkout Outage (~$45k revenue loss)`;
  } else {
    answer = `RescueOps AI is actively monitoring **${incident.title}** (${incident.id}). Telemetry shows ${incident.affectedUsers.toLocaleString()} affected users. Recommended resolution: **${incident.remediationOptions[0]?.title}**. How else can I assist?`;
  }

  res.json({ answer, dna: incident.dna });
});

app.listen(PORT, () => {
  console.log(`RescueOps AI Server running on port ${PORT}`);
});
