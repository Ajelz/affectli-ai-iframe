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
            <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h4 className={`text-sm font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: '#991B1B' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={14} style={{ color: '#DC2626' }} />
                </div>
                {isRTL ? 'تنبيهات تضارب المصالح' : 'Conflict Alerts'}
              </h4>
              <span style={{ fontSize: '11px', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '4px 8px', borderRadius: '4px' }}>
                {conflicts.filter(c => c.resolution === 'pending').length} {isRTL ? 'معلق' : 'pending'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {conflicts.filter(c => c.resolution === 'pending').map((conflict) => {
                const typeConfig = {
                  rotation_violation: { ar: 'مخالفة دوران', en: 'Rotation Rule', icon: '🔄' },
                  family_relationship: { ar: 'علاقة قرابة', en: 'Family Tie', icon: '👥' },
                  financial_interest: { ar: 'مصلحة مالية', en: 'Financial', icon: '💰' },
                  previous_employment: { ar: 'عمل سابق', en: 'Ex-Employee', icon: '🏢' },
                  social_connection: { ar: 'علاقة اجتماعية', en: 'Social Tie', icon: '🤝' },
                };
                const config = typeConfig[conflict.conflictType] || { ar: 'تضارب', en: 'Conflict', icon: '⚠️' };

                return (
                  <div
                    key={conflict.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '10px',
                      padding: '14px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                    }}
                  >
                    {/* Top: Auditor → Entity */}
                    <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: '#1A2032', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: '600'
                      }}>
                        {(isRTL ? conflict.auditorNameAr : conflict.auditorNameEn).split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>
                          {isRTL ? conflict.auditorNameAr : conflict.auditorNameEn}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>
                          {isRTL ? 'مدقق' : 'Auditor'} → {isRTL ? conflict.entityNameAr : conflict.entityNameEn}
                        </div>
                      </div>
                      <div style={{
                        padding: '4px 8px', borderRadius: '6px',
                        backgroundColor: conflict.severity === 'critical' ? '#FEE2E2' : '#FEF3C7',
                        color: conflict.severity === 'critical' ? '#DC2626' : '#D97706',
                        fontSize: '11px', fontWeight: '600'
                      }}>
                        {conflict.aiConfidence}%
                      </div>
                    </div>

                    {/* Conflict Type & Description */}
                    <div style={{
                      backgroundColor: '#F9FAFB',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      marginBottom: '12px'
                    }}>
                      <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span style={{ fontSize: '13px' }}>{config.icon}</span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                          {isRTL ? config.ar : config.en}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>
                        {isRTL ? conflict.descriptionAr : conflict.descriptionEn}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <button className="btn btn-sm" style={{
                        backgroundColor: '#DC2626', color: 'white',
                        border: 'none', fontSize: '11px', padding: '5px 10px',
                        borderRadius: '5px', fontWeight: '500'
                      }}>
                        {isRTL ? 'استبدال' : 'Replace'}
                      </button>
                      <button className="btn btn-sm" style={{
                        backgroundColor: 'white', color: '#6B7280',
                        border: '1px solid #E5E7EB', fontSize: '11px', padding: '5px 10px',
                        borderRadius: '5px', fontWeight: '500'
                      }}>
                        {isRTL ? 'لاحقاً' : 'Later'}
                      </button>
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
