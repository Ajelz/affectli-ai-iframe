// Missions Data - 100+ missions

const missionTypes = [
  { type: "financial", typeAr: "مراجعة مالية", duration: [45, 80], teamSize: [4, 6] },
  { type: "performance", typeAr: "رقابة الأداء", duration: [60, 125], teamSize: [3, 5] },
  { type: "compliance", typeAr: "رقابة الالتزام", duration: [30, 65], teamSize: [2, 4] },
  { type: "pre_contract", typeAr: "الرقابة المسبقة", duration: [5, 15], teamSize: [1, 2] },
  { type: "forensic", typeAr: "التدقيق الجنائي", duration: [90, 180], teamSize: [4, 8] },
  { type: "it_audit", typeAr: "تدقيق نظم المعلومات", duration: [30, 50], teamSize: [2, 3] },
];

const phases = [
  { id: "planning", nameAr: "تخطيط", nameEn: "Planning" },
  { id: "fieldwork", nameAr: "تنفيذ", nameEn: "Fieldwork" },
  { id: "review", nameAr: "مراجعة", nameEn: "Review" },
  { id: "reporting", nameAr: "تقرير", nameEn: "Reporting" },
  { id: "closed", nameAr: "مغلق", nameEn: "Closed" },
];

const aiActions = [
  { action: "extend_deadline", actionAr: "تمديد الموعد النهائي", reasoning: "تم تحديد مشكلات مطابقة معقدة في المرحلة الثانية" },
  { action: "add_team_member", actionAr: "إضافة عضو للفريق", reasoning: "حجم العمل يتجاوز قدرة الفريق الحالي" },
  { action: "escalate_risk", actionAr: "رفع مستوى المخاطر", reasoning: "تم اكتشاف مخالفات مالية محتملة" },
  { action: "reassign_lead", actionAr: "تغيير قائد الفريق", reasoning: "تضارب مصالح محتمل تم اكتشافه" },
  { action: "prioritize", actionAr: "رفع الأولوية", reasoning: "اقتراب موعد التقرير السنوي" },
  { action: "request_documents", actionAr: "طلب مستندات إضافية", reasoning: "نقص في الوثائق المطلوبة" },
  { action: "schedule_meeting", actionAr: "جدولة اجتماع", reasoning: "الحاجة لتوضيحات من الإدارة" },
  { action: "approve_completion", actionAr: "الموافقة على الإنهاء", reasoning: "استيفاء جميع متطلبات التدقيق" },
];

const generateMissions = () => {
  const missions = [];
  const entities = [
    "BNK-001", "BNK-002", "BNK-003", "BNK-004", "BNK-005",
    "OIL-001", "OIL-002", "OIL-003", "OIL-004",
    "UTL-001", "UTL-002", "UTL-003",
    "SOV-001", "SOV-002", "SOV-003",
    "MIN-001", "MIN-002", "MIN-003", "MIN-004", "MIN-005",
    "CRP-001", "CRP-002", "CRP-003",
    "UNI-001", "UNI-002",
    "HOS-001", "HOS-002",
  ];

  const entityNamesAr = {
    "BNK-001": "مصرف ليبيا المركزي",
    "BNK-002": "مصرف الجمهورية",
    "BNK-003": "المصرف التجاري الوطني",
    "BNK-004": "مصرف الوحدة",
    "BNK-005": "مصرف الصحراء",
    "OIL-001": "المؤسسة الوطنية للنفط",
    "OIL-002": "شركة الواحة للنفط",
    "OIL-003": "شركة الخليج العربي للنفط",
    "OIL-004": "شركة الزويتينة للنفط",
    "UTL-001": "الشركة العامة للكهرباء",
    "UTL-002": "شركة المياه والصرف الصحي",
    "UTL-003": "الشركة الليبية للاتصالات",
    "SOV-001": "الهيئة الليبية للاستثمار",
    "SOV-002": "المؤسسة الليبية للاستثمار الخارجي",
    "SOV-003": "صندوق التنمية وإعادة الإعمار",
    "MIN-001": "وزارة المالية",
    "MIN-002": "وزارة النفط والغاز",
    "MIN-003": "وزارة التعليم",
    "MIN-004": "وزارة الصحة",
    "MIN-005": "وزارة الداخلية",
    "CRP-001": "الشركة الليبية للحديد والصلب",
    "CRP-002": "شركة ليبيا أفريقيا للاستثمار",
    "CRP-003": "الخطوط الجوية الليبية",
    "UNI-001": "جامعة طرابلس",
    "UNI-002": "جامعة بنغازي",
    "HOS-001": "مركز طرابلس الطبي",
    "HOS-002": "مركز بنغازي الطبي",
  };

  const entityNamesEn = {
    "BNK-001": "Central Bank of Libya",
    "BNK-002": "Jumhouria Bank",
    "BNK-003": "National Commercial Bank",
    "BNK-004": "Wahda Bank",
    "BNK-005": "Sahara Bank",
    "OIL-001": "National Oil Corporation",
    "OIL-002": "Waha Oil Company",
    "OIL-003": "Arabian Gulf Oil Company",
    "OIL-004": "Zueitina Oil Company",
    "UTL-001": "General Electricity Company",
    "UTL-002": "Water & Sewerage Company",
    "UTL-003": "Libyan Telecom Company",
    "SOV-001": "Libyan Investment Authority",
    "SOV-002": "Foreign Investment Company",
    "SOV-003": "Development & Reconstruction Fund",
    "MIN-001": "Ministry of Finance",
    "MIN-002": "Ministry of Oil & Gas",
    "MIN-003": "Ministry of Education",
    "MIN-004": "Ministry of Health",
    "MIN-005": "Ministry of Interior",
    "CRP-001": "Libyan Iron & Steel Company",
    "CRP-002": "Libya Africa Investment",
    "CRP-003": "Libyan Airlines",
    "UNI-001": "University of Tripoli",
    "UNI-002": "University of Benghazi",
    "HOS-001": "Tripoli Medical Center",
    "HOS-002": "Benghazi Medical Center",
  };

  const missionTypeLabelsEn = {
    "financial": "Financial Audit",
    "performance": "Performance Audit",
    "compliance": "Compliance Review",
    "pre_contract": "Pre-Contract Review",
    "forensic": "Forensic Investigation",
    "it_audit": "IT Systems Audit",
  };

  for (let i = 0; i < 110; i++) {
    const missionType = missionTypes[Math.floor(Math.random() * missionTypes.length)];
    const entityId = entities[Math.floor(Math.random() * entities.length)];
    const phase = phases[Math.floor(Math.random() * phases.length)];
    const aiAction = aiActions[Math.floor(Math.random() * aiActions.length)];

    const year = Math.random() > 0.3 ? 2024 : 2025;
    const month = year === 2025 ? Math.floor(Math.random() * 1) + 1 : Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;

    const startDate = new Date(year, month - 1, day);
    const duration = Math.floor(Math.random() * (missionType.duration[1] - missionType.duration[0])) + missionType.duration[0];
    const plannedEndDate = new Date(startDate);
    plannedEndDate.setDate(plannedEndDate.getDate() + duration);

    const budgetedHours = duration * 8 * (Math.floor(Math.random() * (missionType.teamSize[1] - missionType.teamSize[0])) + missionType.teamSize[0]);
    const progress = phase.id === "closed" ? 100 : Math.floor(Math.random() * 95);
    const actualHours = Math.floor(budgetedHours * (progress / 100) * (0.9 + Math.random() * 0.3));

    const teamSize = Math.floor(Math.random() * (missionType.teamSize[1] - missionType.teamSize[0])) + missionType.teamSize[0];
    const teamMembers = [];
    for (let j = 0; j < teamSize; j++) {
      teamMembers.push(`AUD-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`);
    }

    const riskLevel = Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low";
    const hasAIRecommendation = Math.random() > 0.4;

    missions.push({
      id: `MIS-${year}-${String(i + 1).padStart(4, '0')}`,
      titleAr: `${missionType.typeAr} - ${entityNamesAr[entityId] || entityId}`,
      titleEn: `${missionTypeLabelsEn[missionType.type]} - ${entityNamesEn[entityId] || entityId}`,
      type: missionType.type,
      typeAr: missionType.typeAr,
      entityId,
      entityNameAr: entityNamesAr[entityId] || entityId,
      entityNameEn: entityNamesEn[entityId] || entityId,
      status: phase.id === "closed" ? "completed" : phase.id === "planning" ? "scheduled" : "in_progress",
      phase: phase.id,
      phaseAr: phase.nameAr,
      startDate: startDate.toISOString().split('T')[0],
      plannedEndDate: plannedEndDate.toISOString().split('T')[0],
      actualEndDate: phase.id === "closed" ? plannedEndDate.toISOString().split('T')[0] : null,
      teamLead: `AUD-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`,
      teamMembers: [...new Set(teamMembers)],
      budgetedHours,
      actualHours,
      progress,
      riskLevel,
      priority: Math.floor(Math.random() * 5) + 1,
      aiRecommendation: hasAIRecommendation ? {
        action: aiAction.action,
        actionAr: aiAction.actionAr,
        confidence: Math.floor(Math.random() * 30) + 70,
        reasoning: aiAction.reasoning,
        humanDecision: Math.random() > 0.6 ? (Math.random() > 0.3 ? "accepted" : "rejected") : null,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      } : null,
    });
  }

  return missions;
};

export const missions = generateMissions();

// Conflicts Data
export const conflicts = [
  { id: "CON-001", auditorId: "AUD-015", auditorNameAr: "سلمى أحمد المقريف", auditorNameEn: "Salma Al-Maqrif", entityId: "BNK-003", entityNameAr: "المصرف التجاري الوطني", entityNameEn: "National Commercial Bank", conflictType: "rotation_violation", descriptionAr: "المدقق شارك في مهمة سابقة لهذا الكيان في 2023", severity: "high", aiDetected: true, aiConfidence: 96, resolution: "pending" },
  { id: "CON-002", auditorId: "AUD-008", auditorNameAr: "يوسف إبراهيم القذافي", auditorNameEn: "Yousef Al-Gaddafi", entityId: "SOV-001", entityNameAr: "الهيئة الليبية للاستثمار", entityNameEn: "Libyan Investment Authority", conflictType: "family_relationship", descriptionAr: "قريب من الدرجة الأولى يعمل في الجهة المراد تدقيقها", severity: "critical", aiDetected: true, aiConfidence: 99, resolution: "blocked" },
  { id: "CON-003", auditorId: "AUD-023", auditorNameAr: "سعاد خالد الجبالي", auditorNameEn: "Suad Al-Jibali", entityId: "BNK-002", entityNameAr: "مصرف الجمهورية", entityNameEn: "Jumhouria Bank", conflictType: "financial_interest", descriptionAr: "المدقق لديه حساب مصرفي نشط في هذا المصرف", severity: "medium", aiDetected: true, aiConfidence: 88, resolution: "under_review" },
  { id: "CON-004", auditorId: "AUD-032", auditorNameAr: "منصور سالم الشلماني", auditorNameEn: "Mansour Al-Shalmani", entityId: "OIL-001", entityNameAr: "المؤسسة الوطنية للنفط", entityNameEn: "National Oil Corporation", conflictType: "previous_employment", descriptionAr: "المدقق عمل سابقاً في المؤسسة خلال السنوات الخمس الماضية", severity: "high", aiDetected: true, aiConfidence: 94, resolution: "blocked" },
  { id: "CON-005", auditorId: "AUD-010", auditorNameAr: "عبدالله أحمد السنوسي", auditorNameEn: "Abdullah Al-Senussi", entityId: "MIN-001", entityNameAr: "وزارة المالية", entityNameEn: "Ministry of Finance", conflictType: "social_connection", descriptionAr: "المدقق عضو في لجنة مشتركة مع قيادات الوزارة", severity: "medium", aiDetected: true, aiConfidence: 82, resolution: "pending" },
  { id: "CON-006", auditorId: "AUD-005", auditorNameAr: "عائشة مصطفى الطرابلسي", auditorNameEn: "Aisha Al-Tarabulsi", entityId: "OIL-002", entityNameAr: "شركة الواحة للنفط", entityNameEn: "Waha Oil Company", conflictType: "rotation_violation", descriptionAr: "المدقق قاد مهمة تدقيق لنفس الكيان في 2022", severity: "high", aiDetected: true, aiConfidence: 97, resolution: "resolved" },
  { id: "CON-007", auditorId: "AUD-018", auditorNameAr: "عبدالرحمن سالم الغرياني", auditorNameEn: "Abdulrahman Al-Gheryani", entityId: "BNK-001", entityNameAr: "مصرف ليبيا المركزي", entityNameEn: "Central Bank of Libya", conflictType: "financial_interest", descriptionAr: "المدقق يمتلك استثمارات في هذا المصرف", severity: "critical", aiDetected: true, aiConfidence: 91, resolution: "blocked" },
  { id: "CON-008", auditorId: "AUD-041", auditorNameAr: "سهام علي الثني", auditorNameEn: "Siham Al-Thni", entityId: "UNI-002", entityNameAr: "جامعة بنغازي", entityNameEn: "University of Benghazi", conflictType: "family_relationship", descriptionAr: "زوج المدقق يعمل أستاذاً في الجامعة", severity: "high", aiDetected: true, aiConfidence: 95, resolution: "under_review" },
];

// AI Recommendations Queue
export const aiRecommendations = [
  {
    id: "REC-001",
    missionId: "MIS-2024-0023",
    type: "team_assignment",
    titleAr: "تعيين فريق مهمة مصرف الجمهورية",
    recommendationAr: "تعيين فريق متخصص في الرقابة المصرفية بقيادة أحمد الفيتوري",
    confidence: 91,
    reasoning: "خبرة الفريق المقترح في القطاع المصرفي تتجاوز 10 سنوات",
    factors: [
      { factor: "خبرة القطاع", weight: 30, score: 95 },
      { factor: "التوفر", weight: 25, score: 88 },
      { factor: "عدم تضارب المصالح", weight: 25, score: 100 },
      { factor: "التقييم السابق", weight: 20, score: 85 },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "REC-002",
    missionId: "MIS-2024-0047",
    type: "deadline_extension",
    titleAr: "تمديد موعد مهمة المؤسسة الوطنية للنفط",
    recommendationAr: "تمديد الموعد النهائي بـ 21 يوماً إضافياً",
    confidence: 87,
    reasoning: "تعقيد الهيكل التنظيمي وحجم المعاملات يتطلب وقتاً إضافياً",
    factors: [
      { factor: "حجم المعاملات", weight: 35, score: 92 },
      { factor: "تعقيد الهيكل", weight: 30, score: 88 },
      { factor: "تقدم العمل الحالي", weight: 20, score: 75 },
      { factor: "توفر الموارد", weight: 15, score: 80 },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "REC-003",
    missionId: "MIS-2024-0089",
    type: "risk_escalation",
    titleAr: "رفع مستوى مخاطر مهمة الهيئة الليبية للاستثمار",
    recommendationAr: "رفع مستوى المخاطر من متوسط إلى عالي",
    confidence: 94,
    reasoning: "تم اكتشاف معاملات غير موثقة تتجاوز 50 مليون دينار",
    factors: [
      { factor: "حجم المعاملات المشبوهة", weight: 40, score: 98 },
      { factor: "غياب التوثيق", weight: 30, score: 95 },
      { factor: "تاريخ المخالفات", weight: 20, score: 85 },
      { factor: "حساسية الكيان", weight: 10, score: 90 },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "REC-004",
    missionId: "MIS-2024-0012",
    type: "resource_optimization",
    titleAr: "إعادة توزيع موارد فريق وزارة المالية",
    recommendationAr: "نقل مدقق واحد إلى مهمة وزارة الصحة الأكثر إلحاحاً",
    confidence: 78,
    reasoning: "مهمة وزارة المالية متقدمة بشكل جيد بينما مهمة الصحة تحتاج دعماً",
    factors: [
      { factor: "تقدم المهمة الحالية", weight: 30, score: 90 },
      { factor: "إلحاحية المهمة الأخرى", weight: 35, score: 85 },
      { factor: "توافق المهارات", weight: 25, score: 70 },
      { factor: "تأثير النقل", weight: 10, score: 65 },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "REC-005",
    missionId: "MIS-2024-0056",
    type: "conflict_alert",
    titleAr: "تنبيه تضارب مصالح - مهمة المصرف التجاري",
    recommendationAr: "استبدال المدقق نورة البرقاوي بسبب علاقة قرابة مكتشفة",
    confidence: 96,
    reasoning: "تم اكتشاف أن شقيق المدقق يعمل في إدارة المخاطر بالمصرف",
    factors: [
      { factor: "درجة القرابة", weight: 40, score: 100 },
      { factor: "مستوى المنصب", weight: 30, score: 85 },
      { factor: "تأثير على الاستقلالية", weight: 30, score: 95 },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
];

// Activity Feed Events
export const generateActivityEvents = () => {
  const events = [
    { type: "mission_started", iconType: "play", colorClass: "text-green-600 bg-green-100" },
    { type: "mission_completed", iconType: "check", colorClass: "text-blue-600 bg-blue-100" },
    { type: "ai_recommendation", iconType: "brain", colorClass: "text-purple-600 bg-purple-100" },
    { type: "conflict_detected", iconType: "alert", colorClass: "text-red-600 bg-red-100" },
    { type: "team_assigned", iconType: "users", colorClass: "text-indigo-600 bg-indigo-100" },
    { type: "deadline_updated", iconType: "clock", colorClass: "text-orange-600 bg-orange-100" },
    { type: "risk_changed", iconType: "trending", colorClass: "text-yellow-600 bg-yellow-100" },
    { type: "document_uploaded", iconType: "file", colorClass: "text-gray-600 bg-gray-100" },
  ];

  const messages = {
    mission_started: ["بدء مهمة تدقيق جديدة", "انطلاق أعمال الرقابة الميدانية", "بدء مرحلة التخطيط"],
    mission_completed: ["اكتمال مهمة التدقيق بنجاح", "إغلاق ملف المهمة", "تسليم التقرير النهائي"],
    ai_recommendation: ["توصية ذكية جديدة متاحة", "تحليل AI يقترح إجراء", "نظام الذكاء الاصطناعي يطلب مراجعة"],
    conflict_detected: ["تم اكتشاف تضارب مصالح محتمل", "تنبيه: مخالفة دوران المدققين", "علاقة قرابة تتطلب مراجعة"],
    team_assigned: ["تم تعيين فريق العمل", "انضمام عضو جديد للفريق", "تحديث تشكيلة الفريق"],
    deadline_updated: ["تعديل الموعد النهائي", "تمديد فترة المهمة", "تحديث الجدول الزمني"],
    risk_changed: ["تحديث مستوى المخاطر", "رفع درجة الخطورة", "خفض مستوى الخطورة"],
    document_uploaded: ["رفع مستندات جديدة", "إضافة مرفقات للملف", "تحديث الوثائق"],
  };

  const result = [];
  for (let i = 0; i < 50; i++) {
    const event = events[Math.floor(Math.random() * events.length)];
    const messageList = messages[event.type];
    const message = messageList[Math.floor(Math.random() * messageList.length)];

    result.push({
      id: `EVT-${String(i + 1).padStart(4, '0')}`,
      type: event.type,
      iconType: event.iconType,
      colorClass: event.colorClass,
      message,
      entityAr: ["مصرف الجمهورية", "المؤسسة الوطنية للنفط", "وزارة المالية", "الشركة العامة للكهرباء", "الهيئة الليبية للاستثمار"][Math.floor(Math.random() * 5)],
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
      read: Math.random() > 0.3,
    });
  }

  return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const activityEvents = generateActivityEvents();
