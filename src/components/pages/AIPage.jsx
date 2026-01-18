import { Brain, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

function StatCard({ icon: Icon, value, label, iconClass }) {
  return (
    <div className="ai-stat-card">
      <div className={`ai-stat-icon ${iconClass}`}>
        <Icon size={20} />
      </div>
      <div className="ai-stat-value">{value}</div>
      <div className="ai-stat-label">{label}</div>
    </div>
  );
}

function RecommendationItem({ rec, isRTL }) {
  const typeLabels = {
    team_assignment: isRTL ? 'تعيين فريق' : 'Team Assignment',
    deadline_extension: isRTL ? 'تمديد موعد' : 'Deadline Extension',
    risk_escalation: isRTL ? 'رفع مخاطر' : 'Risk Escalation',
    resource_optimization: isRTL ? 'تحسين موارد' : 'Resource Optimization',
    conflict_alert: isRTL ? 'تنبيه تضارب' : 'Conflict Alert',
  };

  return (
    <div className="ai-list-item">
      <div className="ai-list-icon">
        <Brain size={14} />
      </div>
      <div className="ai-list-content">
        <span className="ai-list-title">{typeLabels[rec.type] || rec.type}</span>
        <span className="ai-list-meta">{rec.confidence}% {isRTL ? 'ثقة' : 'confidence'}</span>
      </div>
    </div>
  );
}

function ConflictItem({ conflict, isRTL }) {
  const typeLabels = {
    rotation_violation: isRTL ? 'مخالفة دوران' : 'Rotation Violation',
    family_relationship: isRTL ? 'علاقة قرابة' : 'Family Relationship',
    financial_interest: isRTL ? 'مصلحة مالية' : 'Financial Interest',
    previous_employment: isRTL ? 'عمل سابق' : 'Previous Employment',
    social_connection: isRTL ? 'علاقة اجتماعية' : 'Social Connection',
  };

  const severityColors = {
    critical: '#EF4444',
    high: '#F59E0B',
    medium: '#3B82F6',
  };

  const auditorName = isRTL ? conflict.auditorNameAr : conflict.auditorNameEn;
  const entityName = isRTL ? conflict.entityNameAr : conflict.entityNameEn;

  return (
    <div className="ai-list-item">
      <div className="ai-list-icon" style={{ backgroundColor: `${severityColors[conflict.severity]}20`, color: severityColors[conflict.severity] }}>
        <Shield size={14} />
      </div>
      <div className="ai-list-content">
        <span className="ai-list-title">{auditorName}</span>
        <span className="ai-list-meta">{typeLabels[conflict.conflictType]} • {entityName}</span>
      </div>
    </div>
  );
}

export default function AIPage({ recommendations, conflicts }) {
  const { isRTL } = useLanguage();

  const pendingRecs = recommendations.filter(r => r.status === 'pending');
  const activeConflicts = conflicts.filter(c => c.resolution !== 'resolved');
  const avgConfidence = Math.round(
    recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length
  );

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="icon-box icon-box-ai">
            <Brain size={20} />
          </div>
          <div>
            <h1 className="page-title">
              {isRTL ? 'مركز الذكاء الاصطناعي' : 'AI Intelligence Center'}
            </h1>
            <p className="page-subtitle">
              {isRTL ? 'تحليلات وتوصيات آلية' : 'Automated analytics and recommendations'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="ai-stats-grid">
        <StatCard
          icon={Clock}
          value={pendingRecs.length}
          label={isRTL ? 'توصيات معلقة' : 'Pending Recommendations'}
          iconClass="icon-warning"
        />
        <StatCard
          icon={AlertTriangle}
          value={activeConflicts.length}
          label={isRTL ? 'تضارب مصالح' : 'Active Conflicts'}
          iconClass="icon-danger"
        />
        <StatCard
          icon={CheckCircle}
          value={`${avgConfidence}%`}
          label={isRTL ? 'متوسط الثقة' : 'Avg Confidence'}
          iconClass="icon-success"
        />
      </div>

      {/* Two Column Layout */}
      <div className="ai-columns">
        {/* Recommendations */}
        <div className="ai-section">
          <h2 className="ai-section-title">
            {isRTL ? 'التوصيات الأخيرة' : 'Recent Recommendations'}
          </h2>
          <div className="ai-list">
            {pendingRecs.map(rec => (
              <RecommendationItem key={rec.id} rec={rec} isRTL={isRTL} />
            ))}
            {pendingRecs.length === 0 && (
              <p className="text-secondary text-sm">
                {isRTL ? 'لا توجد توصيات معلقة' : 'No pending recommendations'}
              </p>
            )}
          </div>
        </div>

        {/* Conflicts */}
        <div className="ai-section">
          <h2 className="ai-section-title">
            {isRTL ? 'تنبيهات التضارب' : 'Conflict Alerts'}
          </h2>
          <div className="ai-list">
            {activeConflicts.map(conflict => (
              <ConflictItem key={conflict.id} conflict={conflict} isRTL={isRTL} />
            ))}
            {activeConflicts.length === 0 && (
              <p className="text-secondary text-sm">
                {isRTL ? 'لا توجد تنبيهات نشطة' : 'No active alerts'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
