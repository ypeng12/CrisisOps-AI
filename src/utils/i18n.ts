export const translations = {
  en: {
    title: "CrisisOps AI",
    subtitle: "Distributed Operational Intelligence Platform",
    headerTag: "Enterprise Scale • Low Latency • AI Orchestration",
    incomingReport: "Telemetry Stream",
    analyzeBtn: "Process Event",
    simulateBtn: "Simulate System Escalation",
    randomScenarioBtn: "Generate High-Load Stream",
    operationalTwin: "Live Digital Twin",
    recommendedActions: "Orchestrated Dispatches",
    auditLog: "Audit & Observability",
    
    // System Monitor
    sysMonitor: "System Intelligence Monitor",
    nodeLoad: "Inference Load",
    bandwidthSaving: "Bandwidth Optimization",
    ttft: "Latency (TTFT)",
    localEfficiency: "Edge Efficiency",
    
    // Routing Panel
    routingLayer: "Cloud-Edge Agent Routing Layer",
    selectedRoute: "Inference Path",
    routingBasis: "Routing Basis",
    hallucinationCheck: "Consistency Check",
    
    // Labels
    incident: "Event",
    location: "Entity Location",
    assets: "Infrastructure Assets",
    teams: "Operational Units",
    type: "Type",
    severity: "Severity",
    status: "State",
    confidence: "Model Confidence",
    evidence: "Data Lineage",
    reason: "Reasoning Path",
    placeholder: "Ingest unstructured telemetry data...",
    noContext: "Awaiting system context...",
    noTwin: "Constructing Digital Twin...",
    noLogs: "No telemetry recorded.",
    
    // Actions
    approved: "Execute",
    hold: "Stage",
    rejected: "Abort",
    
    // Actor
    system: "Orchestrator",
    operator: "Commander"
  },
  zh: {
    title: "CrisisOps AI",
    subtitle: "分布式运营情报平台",
    headerTag: "企业级规模 • 低延迟 • AI 编排",
    incomingReport: "遥测数据流",
    analyzeBtn: "处理事件",
    simulateBtn: "模拟系统升级",
    randomScenarioBtn: "生成高负载流",
    operationalTwin: "实时数字孪生",
    recommendedActions: "编排调度指令",
    auditLog: "审计与可观测性",
    
    // System Monitor
    sysMonitor: "系统智能监控器",
    nodeLoad: "推理负载",
    bandwidthSaving: "带宽优化率",
    ttft: "延迟 (TTFT)",
    localEfficiency: "边缘处理效率",

    // Routing Panel
    routingLayer: "云边协同代理路由层",
    selectedRoute: "推理路径",
    routingBasis: "路由依据",
    hallucinationCheck: "一致性校验",

    // Labels
    incident: "事件",
    location: "实体位置",
    assets: "基础设施资产",
    teams: "运营单位",
    type: "类型",
    severity: "严重程度",
    status: "状态",
    confidence: "模型置信度",
    evidence: "数据血缘",
    reason: "推理路径",
    placeholder: "注入非结构化遥测数据...",
    noContext: "等待系统上下文...",
    noTwin: "正在构建数字孪生...",
    noLogs: "尚无遥测记录。",
    
    // Actions
    approved: "执行",
    hold: "暂缓",
    rejected: "中止",
    
    // Actor
    system: "编排器",
    operator: "指挥官"
  }
};

export type Language = 'en' | 'zh';
