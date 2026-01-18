import { useState } from 'react';
import { Brain, Check, X, AlertTriangle, Clock, Users, TrendingUp, Settings } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

function RecommendationCard({ recommendation, onAccept, onReject, isRTL, t, index }) {
  const [isAccepting, setIsAccepting] = useState(false);

  const typeConfig = {
    team_assignment: { icon: Users, label: isRTL ? 'تعيين فريق' : 'Team Assignment', color: '#3B82F6' },
    deadline_extension: { icon: Clock, label: isRTL ? 'تمديد موعد' : 'Deadline Extension', color: '#F59E0B' },
    risk_escalation: { icon: AlertTriangle, label: isRTL ? 'رفع مخاطر' : 'Risk Escalation', color: '#EF4444' },
    resource_optimization: { icon: Users, label: isRTL ? 'تحسين موارد' : 'Resource Transfer', color: '#8B5CF6' },
    conflict_alert: { icon: AlertTriangle, label: isRTL ? 'تضارب مصالح' : 'Conflict Alert', color: '#DC2626' },
    default: { icon: TrendingUp, label: isRTL ? 'توصية' : 'Recommendation', color: '#6B7280' },
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
      {/* Header with type badge */}
      <div className={`rec-header ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="icon-box icon-box-sm" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
          <Icon size={16} />
        </div>
        <div className="rec-content">
          <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
              {config.label}
            </span>
            <span className="text-xs text-secondary">
              {new Date(recommendation.createdAt).toLocaleTimeString(isRTL ? 'ar-LY' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <h4 className="rec-title" style={{ fontSize: '14px', lineHeight: '1.4' }}>
            {isRTL ? recommendation.titleAr : recommendation.titleEn}
          </h4>
        </div>
      </div>

      {/* Description */}
      <div className="rec-description" style={{ margin: '12px 0', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
        <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#374151', margin: 0 }}>
          {isRTL ? recommendation.descriptionAr : recommendation.descriptionEn}
        </p>
      </div>

      {/* Impact Warning */}
      {(recommendation.impactAr || recommendation.impactEn) && (
        <div className={`flex items-start gap-2 mb-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`} style={{ padding: '8px 12px', backgroundColor: '#FEF3C7', borderRadius: '6px' }}>
          <AlertTriangle size={14} style={{ color: '#D97706', marginTop: '2px', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: '#92400E' }}>
            {isRTL ? recommendation.impactAr : recommendation.impactEn}
          </span>
        </div>
      )}

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
              className="btn btn-sm btn-success"
            >
              <Check size={14} />
              <span>{t('ai.accept')}</span>
            </button>
            <button
              onClick={() => onReject(recommendation.id, 'User skipped')}
              className="btn btn-sm btn-danger"
            >
              <X size={14} />
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
