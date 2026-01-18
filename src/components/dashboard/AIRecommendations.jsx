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
        <div className={`inline-flex items-start gap-2 mb-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`} style={{ padding: '6px 10px', backgroundColor: '#FEF3C7', borderRadius: '6px', borderLeft: isRTL ? 'none' : '3px solid #D97706', borderRight: isRTL ? '3px solid #D97706' : 'none' }}>
          <AlertTriangle size={12} style={{ color: '#D97706', marginTop: '1px', flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color: '#92400E', lineHeight: '1.4' }}>
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
            <h4 className={`text-sm font-semibold text-red-600 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertTriangle size={16} />
              {t('ai.conflictAlerts')} ({conflicts.filter(c => c.resolution === 'pending').length})
            </h4>
            <div className="space-y-3">
              {conflicts.filter(c => c.resolution === 'pending').map((conflict) => {
                const typeLabels = {
                  rotation_violation: { ar: 'مخالفة دوران', en: 'Rotation Violation' },
                  family_relationship: { ar: 'علاقة قرابة', en: 'Family Relationship' },
                  financial_interest: { ar: 'مصلحة مالية', en: 'Financial Interest' },
                  previous_employment: { ar: 'عمل سابق', en: 'Previous Employment' },
                  social_connection: { ar: 'علاقة اجتماعية', en: 'Social Connection' },
                };
                const typeLabel = typeLabels[conflict.conflictType] || { ar: 'تضارب', en: 'Conflict' };
                const severityColors = {
                  critical: { bg: '#FEE2E2', border: '#FECACA', text: '#DC2626' },
                  high: { bg: '#FEF3C7', border: '#FDE68A', text: '#D97706' },
                  medium: { bg: '#FEF9C3', border: '#FEF08A', text: '#CA8A04' },
                };
                const colors = severityColors[conflict.severity] || severityColors.medium;

                return (
                  <div
                    key={conflict.id}
                    className="rounded-lg overflow-hidden"
                    style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
                  >
                    {/* Header Row */}
                    <div className={`flex items-center justify-between gap-3 px-3 py-2 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: colors.text + '20', color: colors.text }}>
                          {isRTL ? typeLabel.ar : typeLabel.en}
                        </span>
                        <span className="text-xs font-medium" style={{ color: colors.text }}>
                          {conflict.aiConfidence}%
                        </span>
                      </div>
                      <span className="text-xs" style={{ color: colors.text }}>
                        {isRTL ? conflict.entityNameAr : conflict.entityNameEn}
                      </span>
                    </div>

                    {/* Content */}
                    <div className={`px-3 py-2 ${isRTL ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs font-semibold" style={{ color: colors.text }}>
                          {isRTL ? conflict.auditorNameAr : conflict.auditorNameEn}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
                        {isRTL ? conflict.descriptionAr : conflict.descriptionEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
