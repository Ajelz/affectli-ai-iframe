import { useState } from 'react';
import { Brain, Check, X, AlertTriangle, Clock, Users, TrendingUp, Settings } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

function RecommendationCard({ recommendation, onAccept, onReject, isRTL, t, index }) {
  const [isAccepting, setIsAccepting] = useState(false);

  const typeConfig = {
    team_assignment: { icon: Users, label: 'Team Assignment' },
    deadline_extension: { icon: Clock, label: 'Schedule' },
    risk_escalation: { icon: AlertTriangle, label: 'Risk Alert' },
    conflict_alert: { icon: AlertTriangle, label: 'Conflict' },
    default: { icon: TrendingUp, label: 'Recommendation' },
  };

  const config = typeConfig[recommendation.type] || typeConfig.default;
  const Icon = config.icon;
  const isPending = recommendation.status === 'pending';

  const handleAccept = () => {
    setIsAccepting(true);
    setTimeout(() => {
      onAccept(recommendation.id);
      setIsAccepting(false);
    }, 400);
  };

  return (
    <div
      className={`rec-card animate-fade-in ${!isPending ? 'opacity-60' : ''}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className={`rec-header ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="icon-box icon-box-sm">
          <Icon size={16} />
        </div>
        <div className="rec-content">
          <h4 className="rec-title">
            {isRTL ? recommendation.titleAr : recommendation.titleEn}
          </h4>
          <p className="rec-meta">
            {isRTL ? recommendation.entityAr || 'جهة' : recommendation.entity || 'Entity'} • {' '}
            {new Date(recommendation.createdAt).toLocaleTimeString(isRTL ? 'ar-LY' : 'en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className={`rec-footer ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className="rec-confidence">
          <strong>{recommendation.confidence}%</strong> {t('ai.confidence')}
        </span>

        {isPending ? (
          <div className="rec-actions">
            <button
              onClick={handleAccept}
              disabled={isAccepting}
              className="btn btn-sm btn-primary"
            >
              <Check size={14} />
              <span>{t('ai.accept')}</span>
            </button>
            <button
              onClick={() => onReject(recommendation.id, 'User skipped')}
              className="btn btn-sm btn-secondary"
            >
              <span>{t('ai.skip')}</span>
            </button>
          </div>
        ) : (
          <span className={`text-xs font-medium ${
            recommendation.status === 'accepted' ? 'text-green-600' : 'text-gray-400'
          }`}>
            {recommendation.status === 'accepted' ? `✓ ${t('ai.accepted')}` : t('ai.skipped')}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AIRecommendations({ recommendations, onAccept, onReject, conflicts }) {
  const { isRTL, t } = useLanguage();
  const pendingRecs = recommendations.filter(r => r.status === 'pending');

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="icon-box icon-box-info">
            <Brain size={18} />
          </div>
          <div>
            <h3 className="card-title">{t('ai.title')}</h3>
            <p className="card-subtitle">{pendingRecs.length} {t('ai.pendingReview')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="live-indicator">
            <span className="live-dot" />
            <span>{t('hero.aiProcessing')}</span>
          </div>
          <button className="settings-btn">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="card-body" style={{ maxHeight: '480px', overflowY: 'auto' }}>
        {pendingRecs.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-400">{t('ai.noPending')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRecs.map((rec, index) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onAccept={onAccept}
                onReject={onReject}
                isRTL={isRTL}
                t={t}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Conflicts */}
        {conflicts && conflicts.filter(c => c.resolution === 'pending').length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className={`text-sm font-medium text-red-600 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertTriangle size={16} />
              {t('ai.conflictAlerts')}
            </h4>
            {conflicts.filter(c => c.resolution === 'pending').map((conflict) => (
              <div
                key={conflict.id}
                className="p-4 bg-red-50 rounded-xl border border-red-100 mb-3"
              >
                <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs font-semibold text-red-700">
                    {conflict.aiConfidence}% {t('ai.confidence')}
                  </span>
                </div>
                <p className="text-sm text-red-700">
                  {isRTL ? conflict.descriptionAr : conflict.descriptionEn || conflict.descriptionAr}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
