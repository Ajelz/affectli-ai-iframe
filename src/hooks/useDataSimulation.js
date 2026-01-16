import { useState, useEffect, useCallback } from 'react';

export function useDataSimulation({ missions, recommendations, events, entities, personnel }) {
  const [metrics, setMetrics] = useState({
    planCompletion: 87,
    activeMissions: 142,
    highRiskEntities: 23,
    aiAcceptanceRate: 94.2,
    pendingReviews: 31,
    sparklines: {
      planCompletion: [82, 84, 85, 83, 86, 87, 85, 88, 86, 87],
      activeMissions: [135, 138, 140, 142, 139, 141, 143, 140, 142, 142],
      highRiskEntities: [25, 24, 25, 23, 24, 23, 22, 23, 23, 23],
      aiAcceptanceRate: [92, 93, 93.5, 94, 93.8, 94.1, 94.5, 94.2, 94.3, 94.2],
      pendingReviews: [28, 30, 32, 29, 31, 33, 30, 32, 31, 31],
    },
    lastUpdated: new Date().toISOString(),
  });

  const [simulatedMissions, setSimulatedMissions] = useState(missions);
  const [simulatedRecommendations, setSimulatedRecommendations] = useState(recommendations);
  const [simulatedEvents, setSimulatedEvents] = useState(events);

  // Fluctuate a value within a small range
  const fluctuate = useCallback((value, volatility = 0.02) => {
    const change = (Math.random() - 0.5) * 2 * volatility * value;
    return Math.round((value + change) * 100) / 100;
  }, []);

  // Update metrics every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) => {
        const newPlanCompletion = Math.min(100, Math.max(80, fluctuate(prev.planCompletion, 0.01)));
        const newActiveMissions = Math.round(fluctuate(prev.activeMissions, 0.02));
        const newHighRisk = Math.max(15, Math.round(fluctuate(prev.highRiskEntities, 0.03)));
        const newAIRate = Math.min(99, Math.max(90, fluctuate(prev.aiAcceptanceRate, 0.005)));
        const newPending = Math.max(20, Math.round(fluctuate(prev.pendingReviews, 0.05)));

        return {
          planCompletion: newPlanCompletion,
          activeMissions: newActiveMissions,
          highRiskEntities: newHighRisk,
          aiAcceptanceRate: newAIRate,
          pendingReviews: newPending,
          sparklines: {
            planCompletion: [...prev.sparklines.planCompletion.slice(1), newPlanCompletion],
            activeMissions: [...prev.sparklines.activeMissions.slice(1), newActiveMissions],
            highRiskEntities: [...prev.sparklines.highRiskEntities.slice(1), newHighRisk],
            aiAcceptanceRate: [...prev.sparklines.aiAcceptanceRate.slice(1), newAIRate],
            pendingReviews: [...prev.sparklines.pendingReviews.slice(1), newPending],
          },
          lastUpdated: new Date().toISOString(),
        };
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [fluctuate]);

  // Occasionally add new events
  useEffect(() => {
    const eventTimer = setInterval(() => {
      if (Math.random() > 0.7) {
        const newEventTypes = [
          { type: 'ai_recommendation', message: 'توصية ذكية جديدة متاحة للمراجعة', colorClass: 'text-purple-600 bg-purple-100', iconType: 'brain' },
          { type: 'mission_update', message: 'تحديث في تقدم مهمة التدقيق', colorClass: 'text-blue-600 bg-blue-100', iconType: 'check' },
          { type: 'deadline_alert', message: 'تنبيه: اقتراب موعد نهائي', colorClass: 'text-orange-600 bg-orange-100', iconType: 'clock' },
        ];

        const entities = ['مصرف الجمهورية', 'المؤسسة الوطنية للنفط', 'وزارة المالية', 'الشركة العامة للكهرباء'];
        const randomEvent = newEventTypes[Math.floor(Math.random() * newEventTypes.length)];
        const randomEntity = entities[Math.floor(Math.random() * entities.length)];

        const newEvent = {
          id: `EVT-${Date.now()}`,
          ...randomEvent,
          entityAr: randomEntity,
          timestamp: new Date().toISOString(),
          read: false,
        };

        setSimulatedEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
      }
    }, 8000);

    return () => clearInterval(eventTimer);
  }, []);

  // Accept recommendation
  const acceptRecommendation = useCallback((id) => {
    setSimulatedRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, status: 'accepted', decidedAt: new Date().toISOString() } : rec
      )
    );

    // Add event
    const rec = simulatedRecommendations.find((r) => r.id === id);
    if (rec) {
      setSimulatedEvents((prev) => [
        {
          id: `EVT-${Date.now()}`,
          type: 'recommendation_accepted',
          message: `تم قبول التوصية: ${rec.titleAr}`,
          colorClass: 'text-green-600 bg-green-100',
          iconType: 'check',
          entityAr: '',
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...prev.slice(0, 49),
      ]);
    }

    // Update acceptance rate
    setMetrics((prev) => ({
      ...prev,
      aiAcceptanceRate: Math.min(99, prev.aiAcceptanceRate + 0.1),
    }));
  }, [simulatedRecommendations]);

  // Reject recommendation
  const rejectRecommendation = useCallback((id, reason) => {
    setSimulatedRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? { ...rec, status: 'rejected', rejectionReason: reason, decidedAt: new Date().toISOString() }
          : rec
      )
    );

    const rec = simulatedRecommendations.find((r) => r.id === id);
    if (rec) {
      setSimulatedEvents((prev) => [
        {
          id: `EVT-${Date.now()}`,
          type: 'recommendation_rejected',
          message: `تم رفض التوصية: ${rec.titleAr}`,
          colorClass: 'text-red-600 bg-red-100',
          iconType: 'x',
          entityAr: '',
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...prev.slice(0, 49),
      ]);
    }

    setMetrics((prev) => ({
      ...prev,
      aiAcceptanceRate: Math.max(85, prev.aiAcceptanceRate - 0.2),
    }));
  }, [simulatedRecommendations]);

  return {
    metrics,
    simulatedMissions,
    simulatedRecommendations,
    simulatedEvents,
    acceptRecommendation,
    rejectRecommendation,
  };
}
