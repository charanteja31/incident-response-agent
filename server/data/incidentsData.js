export const initialIncidents = [
  {
    id: "INC-1042",
    dna: "PAY-500-DBPOOL-DEPLOY",
    title: "Checkout API Latency Spike & HTTP 500 Outage",
    severity: "CRITICAL",
    service: "payment-api",
    status: "ACTIVE",
    affectedUsers: 12450,
    revenueAtRisk: "$42,500/hr",
    durationSeconds: 522, // 8 min 42 sec
    blastRadiusScore: 8.4,
    similarityScore: 87,
    historicalMatchCount: 3,
    rootCause: "Database Connection Pool Misconfiguration in Deployment v2.8.1",
    summary: "Deployment v2.8.1 altered max database pool connections from 50 to 10, creating instant connection queue bottlenecks during peak checkout traffic.",
    
    // Telemetry events timeline
    timeline: [
      { time: "14:02:11", type: "DEPLOYMENT", text: "Deployment payment-api:v2.8.1 initiated by dev-ci", severity: "info" },
      { time: "14:02:45", type: "CONFIG", text: "Env updated: DB_POOL_SIZE changed from 50 to 10", severity: "warning" },
      { time: "14:03:04", type: "METRIC", text: "API response latency spiked +38% (120ms -> 450ms)", severity: "warning" },
      { time: "14:03:21", type: "METRIC", text: "PostgreSQL active connection pool utilization reached 92%", severity: "warning" },
      { time: "14:03:45", type: "LOG", text: "HTTP 500 spikes detected on POST /api/v1/checkout/pay", severity: "error" },
      { time: "14:04:02", type: "USER_IMPACT", text: "Customer checkout dropoff detected: 142 failed transactions", severity: "error" },
      { time: "14:04:08", type: "ALERT", text: "🔴 RescueOps AI generated INC-1042 automatically", severity: "critical" },
    ],

    // Change audit
    changesLast60Min: {
      deployments: [
        { name: "payment-api", version: "v2.8.1", author: "Sarah Jenkins", time: "12 mins ago", commit: "8f92ab1" }
      ],
      codeCommits: [
        { hash: "8f92ab1", message: "refactor(db): tune connection pool defaults for lightweight containers", repo: "payment-service" }
      ],
      configurations: [
        { key: "DB_POOL_SIZE", oldVal: "50", newVal: "10", modifiedBy: "Helm Chart v2.8.1" }
      ],
      infrastructure: [
        { event: "K8s HPA Scaling", detail: "Scaled payment-api pods from 4 to 8 instances", time: "15 mins ago" }
      ],
      featureFlags: [
        { name: "new-stripe-checkout-v2", state: "ENABLED", rollout: "100%" }
      ]
    },

    // Correlated DAG Nodes
    correlationDag: [
      { id: "c1", label: "Deployment v2.8.1", type: "trigger", icon: "GitCommit", subtitle: "12m ago" },
      { id: "c2", label: "DB_POOL_SIZE = 10", type: "change", icon: "Sliders", subtitle: "Reduced by 80%" },
      { id: "c3", label: "Connection Pool Exhaustion", type: "symptom", icon: "Database", subtitle: "98% Pool Saturation" },
      { id: "c4", label: "API Latency Spike (680ms)", type: "impact", icon: "Activity", subtitle: "+420ms increase" },
      { id: "c5", label: "HTTP 500 Checkout Failures", type: "impact", icon: "AlertTriangle", subtitle: "34% Error Rate" }
    ],

    // What Happens If We Do Nothing (Projection)
    doNothingProjection: {
      currentPool: "92%",
      riskLevel: "HIGH",
      timeline: [
        { time: "+5 min", pool: "96%", status: "Severe Latency Queueing", userImpact: 15200 },
        { time: "+10 min", pool: "100%", status: "Connection Pool Exhaustion", userImpact: 22000 },
        { time: "+15 min", pool: "100%", status: "Cascading Timeout to Order API", userImpact: 35000 },
        { time: "+20 min", pool: "100%", status: "Complete Checkout Service Outage", userImpact: 50000 }
      ],
      reasoning: "Historical incident patterns (INC-76, INC-91) indicate total service degradation within 14 minutes when pool usage exceeds 90% alongside rising request rates."
    },

    // Blast Radius Topology
    blastRadius: {
      affectedServicesCount: 4,
      affectedApisCount: 7,
      potentialUsers: 12450,
      revenueCritical: true,
      dependencyDepth: 3,
      nodes: [
        { id: "payment-api", name: "Payment API", status: "CRITICAL", depth: 0, users: 12450 },
        { id: "order-service", name: "Order API", status: "AT_RISK", depth: 1, users: 8900 },
        { id: "inventory-service", name: "Inventory API", status: "POSSIBLE_IMPACT", depth: 2, users: 5400 },
        { id: "notification-service", name: "Notification API", status: "STABLE", depth: 3, users: 1200 }
      ]
    },

    // Counterfactual Simulator Strategies
    remediationOptions: [
      {
        id: "opt-b",
        recommended: true,
        title: "Rollback deployment payment-api:v2.8.1",
        safetyLevel: "LEVEL_3", // Requires approval for prod rollback
        riskLevel: "LOW",
        expectedRecovery: 94,
        cost: "Zero downtime ($0)",
        rationale: [
          "Historical match: 4 out of 4 similar pool incidents resolved immediately after deployment rollback.",
          "Restores DB_POOL_SIZE to safe baseline (50 connections).",
          "Deployment age is under 15 minutes; no database schema migrations occurred."
        ]
      },
      {
        id: "opt-a",
        recommended: false,
        title: "Restart payment-api Pods",
        safetyLevel: "LEVEL_2",
        riskLevel: "MEDIUM",
        expectedRecovery: 72,
        cost: "Temporary packet loss (~5s)",
        rationale: [
          "Temporarily clears stuck connection sockets.",
          "Does NOT resolve root issue: new connections will quickly exhaust pool of 10."
        ]
      },
      {
        id: "opt-c",
        recommended: false,
        title: "Hot-patch DB_POOL_SIZE environment variable to 50",
        safetyLevel: "LEVEL_1",
        riskLevel: "LOW",
        expectedRecovery: 89,
        cost: "Requires pod restart cycle",
        rationale: [
          "Directly addresses configuration flaw.",
          "Slight delay while K8s config map propagates across all 8 pods."
        ]
      }
    ],

    // Memory Graph Connections
    similarIncidents: [
      { id: "INC-76", title: "DB Pool Exhaustion post v2.4.0 release", similarity: 87, fix: "Rollback v2.4.0", engineer: "Team Alpha" },
      { id: "INC-91", title: "Payment Timeout during Black Friday surge", similarity: 81, fix: "Increased pool size to 60", engineer: "SRE Ops" },
      { id: "INC-104", title: "PostgreSQL Socket Exhaustion", similarity: 79, fix: "Rollback & pool tuning", engineer: "DevOps Core" }
    ]
  },
  {
    id: "INC-1043",
    dna: "MICRO-503-REDIS-CASCADE",
    title: "Cascading Cache Failover & Multi-Service Outage",
    severity: "HIGH",
    service: "redis-cluster-prod",
    status: "ACTIVE",
    affectedUsers: 48200,
    revenueAtRisk: "$85,000/hr",
    durationSeconds: 940,
    blastRadiusScore: 9.1,
    similarityScore: 92,
    historicalMatchCount: 2,
    rootCause: "Primary Redis Node OOM Crash triggering fallback cascade across 3 dependent microservices.",
    summary: "High throughput write queries overloaded Redis primary node memory limit, causing automatic Sentinel failover delay and read timeouts in Payment, Cart, and Catalog services.",
    
    timeline: [
      { time: "14:10:00", type: "METRIC", text: "Redis primary node RAM utilization reached 99.4%", severity: "warning" },
      { time: "14:11:15", type: "ALERT", text: "Redis Node redis-prod-01 OOM Killed by kernel", severity: "critical" },
      { time: "14:11:30", type: "LOG", text: "Cart API reported Redis Read Connection Timeout (5000ms)", severity: "error" },
      { time: "14:12:05", type: "MULTI_INCIDENT", text: "Correlated 3 simultaneous alerts: Cart API, Catalog API, Order API", severity: "critical" },
    ],

    changesLast60Min: {
      deployments: [{ name: "catalog-indexer", version: "v1.9.0", author: "Data Team", time: "45 mins ago", commit: "3c71ea2" }],
      codeCommits: [{ hash: "3c71ea2", message: "feat: add unthrottled cache warming script", repo: "catalog-service" }],
      configurations: [{ key: "REDIS_MAX_MEMORY", oldVal: "8GB", newVal: "8GB", modifiedBy: "Config" }],
      infrastructure: [{ event: "Sentinel Failover", detail: "Promoting replica redis-prod-02 to primary", time: "2 mins ago" }],
      featureFlags: [{ name: "full-catalog-caching", state: "ENABLED", rollout: "100%" }]
    },

    correlationDag: [
      { id: "rc1", label: "Catalog Cache Warmer", type: "trigger", icon: "Zap", subtitle: "Full scan batch" },
      { id: "rc2", label: "Redis OOM Kill", type: "symptom", icon: "Server", subtitle: "Memory > 99%" },
      { id: "rc3", label: "Sentinel Failover Delay", type: "impact", icon: "RefreshCw", subtitle: "15s reconnect window" },
      { id: "rc4", label: "Multi-Service Read Drop", type: "impact", icon: "ShieldAlert", subtitle: "Payment, Cart, Order affected" }
    ],

    doNothingProjection: {
      currentPool: "99.4% Memory",
      riskLevel: "CRITICAL",
      timeline: [
        { time: "+5 min", pool: "OOM", status: "Replica 2 OOM Crash", userImpact: 55000 },
        { time: "+10 min", pool: "OOM", status: "Full Redis Cluster Failure", userImpact: 78000 }
      ],
      reasoning: "Unbounded cache warming script will crash newly promoted replica node within 5 minutes without memory eviction policy adjustments."
    },

    blastRadius: {
      affectedServicesCount: 5,
      affectedApisCount: 14,
      potentialUsers: 48200,
      revenueCritical: true,
      dependencyDepth: 4,
      nodes: [
        { id: "redis-cluster", name: "Redis Primary Cluster", status: "CRITICAL", depth: 0, users: 48200 },
        { id: "cart-api", name: "Cart Service", status: "CRITICAL", depth: 1, users: 32000 },
        { id: "catalog-api", name: "Product Catalog", status: "AT_RISK", depth: 1, users: 41000 },
        { id: "order-api", name: "Order API", status: "AT_RISK", depth: 2, users: 18000 },
        { id: "recommender", name: "AI Recommendations", status: "POSSIBLE_IMPACT", depth: 3, users: 12000 }
      ]
    },

    remediationOptions: [
      {
        id: "opt-r1",
        recommended: true,
        title: "Flush volatile cache & set maxmemory-policy to volatile-lru",
        safetyLevel: "LEVEL_2",
        riskLevel: "LOW",
        expectedRecovery: 96,
        cost: "Cache drop (~20% cache miss for 2 mins)",
        rationale: [
          "Instantly frees up 4.2GB of memory on promoted replica.",
          "Prevents secondary OOM crash while indexer script completes."
        ]
      },
      {
        id: "opt-r2",
        recommended: false,
        title: "Kill catalog-indexer K8s batch job",
        safetyLevel: "LEVEL_1",
        riskLevel: "LOW",
        expectedRecovery: 88,
        cost: "Stops background indexer",
        rationale: [
          "Stops continuous memory ingestion at source."
        ]
      }
    ],

    similarIncidents: [
      { id: "INC-52", title: "Redis Out Of Memory during Cyber Monday", similarity: 92, fix: "Eviction policy tuning", engineer: "Infra Team" }
    ]
  },
  {
    id: "INC-1044",
    dna: "SEC-403-EXPLOIT-TRAFFIC",
    title: "Suspicious Privilege Escalation & Auth Spike",
    severity: "CRITICAL",
    service: "auth-gateway",
    status: "ACTIVE",
    affectedUsers: 3400,
    revenueAtRisk: "Security Risk",
    durationSeconds: 310,
    blastRadiusScore: 7.8,
    similarityScore: 95,
    historicalMatchCount: 1,
    rootCause: "Credential Stuffing Attack targeting /api/v1/auth/token endpoint from compromised botnet ASN.",
    summary: "Over 18,000 requests/sec detected from IP block 185.220.101.0/24 attempting brute-force JWT authorization, overwhelming auth database worker pool.",
    
    timeline: [
      { time: "14:20:00", type: "SECURITY", text: "⚠️ Anomaly detected: Auth traffic increased 450% from ASN 62088", severity: "critical" },
      { time: "14:20:22", type: "SECURITY", text: "Privilege escalation attempts logged: 42 invalid admin scope tokens", severity: "critical" },
      { time: "14:21:04", type: "METRIC", text: "Auth DB CPU spiked to 97%", severity: "error" },
    ],

    changesLast60Min: {
      deployments: [],
      codeCommits: [],
      configurations: [],
      infrastructure: [{ event: "WAF Rule Trigger", detail: "Rate limit threshold breached (100 req/sec per IP)", time: "3 mins ago" }],
      featureFlags: []
    },

    correlationDag: [
      { id: "s1", label: "Botnet IP Traffic Surge", type: "trigger", icon: "Globe", subtitle: "18k req/sec" },
      { id: "s2", label: "Credential Stuffing Pattern", type: "symptom", icon: "ShieldAlert", subtitle: "Failed JWT signature" },
      { id: "s3", label: "Auth Database CPU Spike", type: "impact", icon: "Cpu", subtitle: "97% Utilization" }
    ],

    doNothingProjection: {
      currentPool: "Auth Saturation",
      riskLevel: "CRITICAL",
      timeline: [
        { time: "+5 min", pool: "100%", status: "Legitimate users locked out", userImpact: 25000 }
      ],
      reasoning: "Credential stuffing traffic will exhaust authorization rate limits for legitimate user logins."
    },

    blastRadius: {
      affectedServicesCount: 2,
      affectedApisCount: 3,
      potentialUsers: 3400,
      revenueCritical: false,
      dependencyDepth: 2,
      nodes: [
        { id: "auth-gateway", name: "Auth Gateway", status: "CRITICAL", depth: 0, users: 3400 },
        { id: "user-db", name: "User Identity DB", status: "AT_RISK", depth: 1, users: 3400 }
      ]
    },

    remediationOptions: [
      {
        id: "opt-sec1",
        recommended: true,
        title: "Block ASN 62088 & Enable Cloudflare Bot Fight Mode",
        safetyLevel: "LEVEL_3", // Security mitigation requires human approval
        riskLevel: "LOW",
        expectedRecovery: 98,
        cost: "None to legitimate traffic",
        rationale: [
          "Identified 99.8% malicious traffic origin.",
          "Instantly drops 18,000 malicious req/sec at edge."
        ]
      }
    ],

    similarIncidents: [
      { id: "INC-38", title: "Credential Stuffing Attack on Login API", similarity: 95, fix: "ASN IP Block & Rate Limiting", engineer: "SecOps" }
    ]
  },
  {
    id: "INC-1045",
    dna: "DB-408-WEEKLY-SPIKE",
    title: "Recurring Weekly PostgreSQL Connection Saturation",
    severity: "MEDIUM",
    service: "analytics-db",
    status: "ACTIVE",
    affectedUsers: 1500,
    revenueAtRisk: "$5,000/hr",
    durationSeconds: 1200,
    blastRadiusScore: 4.2,
    similarityScore: 99,
    historicalMatchCount: 5,
    rootCause: "Systemic Recurring Pattern: Weekly Monday morning batch analytics cron job running concurrently with user traffic peak.",
    summary: "RescueOps AI identified this exact incident pattern occurring every 7 days at 14:00 UTC during scheduled ETL data ingestion.",
    
    timeline: [
      { time: "14:00:00", type: "RECURRING", text: "🔄 Recurring pattern trigger: ETL Batch Job #881 started", severity: "info" },
      { time: "14:05:00", type: "METRIC", text: "Analytics DB disk I/O queue length > 12", severity: "warning" }
    ],

    changesLast60Min: {
      deployments: [],
      codeCommits: [],
      configurations: [],
      infrastructure: [{ event: "Cron Execution", detail: "Weekly ETL ingestion job trigger", time: "25 mins ago" }],
      featureFlags: []
    },

    correlationDag: [
      { id: "r1", label: "Weekly Cron ETL Job", type: "trigger", icon: "Clock", subtitle: "Every 7 Days" },
      { id: "r2", label: "Analytics DB Disk IOPS Spike", type: "symptom", icon: "HardDrive", subtitle: "95% Disk Utilization" },
      { id: "r3", label: "Report Generation Delay", type: "impact", icon: "BarChart", subtitle: "+15s rendering time" }
    ],

    doNothingProjection: {
      currentPool: "85% IOPS",
      riskLevel: "MEDIUM",
      timeline: [
        { time: "+30 min", pool: "40%", status: "Auto-recovers when cron finishes", userImpact: 1500 }
      ],
      reasoning: "Cron job self-terminates after 45 minutes, but creates weekly operational noise and temporary dashboard slowdowns."
    },

    blastRadius: {
      affectedServicesCount: 1,
      affectedApisCount: 2,
      potentialUsers: 1500,
      revenueCritical: false,
      dependencyDepth: 1,
      nodes: [
        { id: "analytics-db", name: "Analytics Database", status: "AT_RISK", depth: 0, users: 1500 }
      ]
    },

    remediationOptions: [
      {
        id: "opt-rec1",
        recommended: true,
        title: "Reschedule ETL Cron Job to 02:00 UTC off-peak window & route to Read Replica",
        safetyLevel: "LEVEL_1",
        riskLevel: "LOW",
        expectedRecovery: 100,
        cost: "Permanent systemic fix",
        rationale: [
          "Eliminates recurring weekly incident pattern permanently.",
          "Separates analytical heavy queries from primary transaction database."
        ]
      }
    ],

    similarIncidents: [
      { id: "INC-88", title: "Monday Analytics Slowdown", similarity: 99, fix: "Temporary throttle", engineer: "Data Ops" },
      { id: "INC-95", title: "Weekly ETL Disk Saturation", similarity: 99, fix: "Temporary throttle", engineer: "Data Ops" }
    ]
  }
];
