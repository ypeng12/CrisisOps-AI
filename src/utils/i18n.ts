export const translations = {
  en: {
    title: "CrisisOps AI",
    subtitle: "Emergency Response Operations Agent",
    incomingReport: "Incoming Report",
    analyzeBtn: "Analyze Incident",
    simulateBtn: "Simulate Second Report (Escalation)",
    operationalTwin: "Live Operational Twin",
    recommendedActions: "Recommended Actions",
    auditLog: "Audit Log",
    whyNotChatbot: "Why not a chatbot?",
    chatbotDesc: "Unstructured text, no live state, no audit trail.",
    crisisOpsDesc: "Extracts operational objects, recommends actions, requires human approval, logs decisions, updates live state.",
    
    // Labels
    incident: "Incident",
    location: "Location",
    assets: "Affected Assets",
    teams: "Available Teams",
    type: "Type",
    severity: "Severity",
    status: "Status",
    confidence: "Confidence",
    evidence: "Evidence",
    reason: "Reason",
    placeholder: "Enter unstructured incident report...",
    noContext: "Awaiting operational context...",
    noTwin: "Awaiting report to construct operational twin...",
    noLogs: "No actions recorded. System standing by.",
    
    // Actions
    approved: "Approved",
    hold: "Hold",
    rejected: "Rejected",
    
    // Actor
    system: "System",
    operator: "Operator"
  },
  zh: {
    title: "CrisisOps AI 应急指挥系统",
    subtitle: "智能应急响应运营代理",
    incomingReport: "实时警情输入",
    analyzeBtn: "分析警情",
    simulateBtn: "模拟后续报告 (事态升级)",
    operationalTwin: "实时运营数字孪生",
    recommendedActions: "AI 推荐行动方案",
    auditLog: "审计日志",
    whyNotChatbot: "为什么这不是聊天机器人？",
    chatbotDesc: "非结构化文本，无实时状态，无审计追踪。",
    crisisOpsDesc: "提取运营对象，推荐可执行方案，需要人工审批，记录所有决策，维护实时状态。",
    
    // Labels
    incident: "突发事件",
    location: "地理位置",
    assets: "受影响资产",
    teams: "可用响应团队",
    type: "类型",
    severity: "严重程度",
    status: "状态",
    confidence: "置信度",
    evidence: "证据溯源",
    reason: "决策依据",
    placeholder: "请输入非结构化警情描述...",
    noContext: "等待运营上下文...",
    noTwin: "等待报告以构建数字孪生模型...",
    noLogs: "尚无记录。系统待命中。",
    
    // Actions
    approved: "批准执行",
    hold: "搁置",
    rejected: "拒绝执行",
    
    // Actor
    system: "系统",
    operator: "操作员"
  }
};

export type Language = 'en' | 'zh';
