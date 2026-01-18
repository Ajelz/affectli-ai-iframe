import { useState, useMemo } from 'react';
import { Building2, Filter, ChevronDown, AlertTriangle, Calendar, Users, MapPin, Banknote, GitBranch } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const sectors = ['all', 'banking', 'oil_gas', 'utilities', 'ministry', 'sovereign', 'state_corp', 'education', 'healthcare'];
const riskLevels = ['all', 'critical', 'high', 'medium', 'low'];

function RiskBar({ score, maxScore = 25 }) {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const color = score >= 20 ? '#EF4444' : score >= 15 ? '#F59E0B' : score >= 10 ? '#3B82F6' : '#10B981';

  return (
    <div className="risk-bar">
      <div className="risk-bar-fill" style={{ width: `${percentage}%`, backgroundColor: color }} />
    </div>
  );
}

function formatAssets(value, isRTL) {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}${isRTL ? ' مليار' : 'B'} LYD`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}${isRTL ? ' مليون' : 'M'} LYD`;
  }
  return `${value.toLocaleString()} LYD`;
}

function EntityCard({ entity, isRTL }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const riskColors = {
    critical: 'var(--color-danger)',
    high: '#F59E0B',
    medium: 'var(--color-primary)',
    low: 'var(--color-success)',
  };

  const statusLabels = {
    overdue: isRTL ? 'متأخر' : 'Overdue',
    scheduled: isRTL ? 'مجدول' : 'Scheduled',
    in_progress: isRTL ? 'جاري' : 'In Progress',
    completed: isRTL ? 'مكتمل' : 'Completed',
  };

  const regionLabels = {
    tripoli: isRTL ? 'طرابلس' : 'Tripoli',
    benghazi: isRTL ? 'بنغازي' : 'Benghazi',
    misrata: isRTL ? 'مصراتة' : 'Misrata',
    zawiya: isRTL ? 'الزاوية' : 'Zawiya',
    sirte: isRTL ? 'سرت' : 'Sirte',
    sebha: isRTL ? 'سبها' : 'Sebha',
  };

  return (
    <div
      className={`entity-card ${isExpanded ? 'entity-card-expanded' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{ cursor: 'pointer' }}
    >
      <div className="entity-header">
        <h3 className="entity-name">{isRTL ? entity.nameAr : entity.nameEn}</h3>
        <div className="flex items-center gap-2">
          {entity.riskLevel === 'critical' && (
            <AlertTriangle size={16} className="text-danger" />
          )}
          <ChevronDown
            size={14}
            style={{
              color: '#9CA3AF',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          />
        </div>
      </div>
      <p className="entity-sector">{isRTL ? entity.sectorAr : entity.sector}</p>

      <div className="entity-risk">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-secondary">
            {isRTL ? 'درجة الخطورة' : 'Risk Score'}
          </span>
          <span className="text-sm font-semibold" style={{ color: riskColors[entity.riskLevel] }}>
            {entity.riskScore}
          </span>
        </div>
        <RiskBar score={entity.riskScore} />
      </div>

      <div className="entity-footer">
        <span className={`status-tag status-${entity.currentStatus}`}>
          {statusLabels[entity.currentStatus]}
        </span>
        <span className="text-xs text-secondary">
          {entity.daysSinceAudit} {isRTL ? 'يوم' : 'days'}
        </span>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="entity-details" onClick={(e) => e.stopPropagation()}>
          <div className="entity-details-grid">
            {entity.totalAssets && (
              <div className={`detail-item ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Banknote size={14} className="detail-icon" />
                <div>
                  <span className="detail-label">{isRTL ? 'إجمالي الأصول' : 'Total Assets'}</span>
                  <span className="detail-value">{formatAssets(entity.totalAssets, isRTL)}</span>
                </div>
              </div>
            )}
            {entity.employeeCount && (
              <div className={`detail-item ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Users size={14} className="detail-icon" />
                <div>
                  <span className="detail-label">{isRTL ? 'الموظفون' : 'Employees'}</span>
                  <span className="detail-value">{entity.employeeCount.toLocaleString()}</span>
                </div>
              </div>
            )}
            {entity.branches && (
              <div className={`detail-item ${isRTL ? 'flex-row-reverse' : ''}`}>
                <GitBranch size={14} className="detail-icon" />
                <div>
                  <span className="detail-label">{isRTL ? 'الفروع' : 'Branches'}</span>
                  <span className="detail-value">{entity.branches}</span>
                </div>
              </div>
            )}
            {entity.region && (
              <div className={`detail-item ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin size={14} className="detail-icon" />
                <div>
                  <span className="detail-label">{isRTL ? 'المنطقة' : 'Region'}</span>
                  <span className="detail-value">{regionLabels[entity.region] || entity.region}</span>
                </div>
              </div>
            )}
            {entity.lastAuditDate && (
              <div className={`detail-item ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar size={14} className="detail-icon" />
                <div>
                  <span className="detail-label">{isRTL ? 'آخر تدقيق' : 'Last Audit'}</span>
                  <span className="detail-value">
                    {new Date(entity.lastAuditDate).toLocaleDateString(isRTL ? 'ar-LY' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EntitiesPage({ entities }) {
  const { isRTL } = useLanguage();
  const [sectorFilter, setSectorFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEntities = useMemo(() => {
    return entities.filter(e => {
      if (sectorFilter !== 'all' && e.sector !== sectorFilter) return false;
      if (riskFilter !== 'all' && e.riskLevel !== riskFilter) return false;
      return true;
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [entities, sectorFilter, riskFilter]);

  const sectorLabels = {
    all: isRTL ? 'الكل' : 'All',
    banking: isRTL ? 'المصارف' : 'Banking',
    oil_gas: isRTL ? 'النفط والغاز' : 'Oil & Gas',
    utilities: isRTL ? 'المرافق' : 'Utilities',
    ministry: isRTL ? 'الوزارات' : 'Ministries',
    sovereign: isRTL ? 'الصناديق السيادية' : 'Sovereign',
    state_corp: isRTL ? 'الشركات الحكومية' : 'State Corp',
    education: isRTL ? 'التعليم' : 'Education',
    healthcare: isRTL ? 'الصحة' : 'Healthcare',
  };

  const riskLabels = {
    all: isRTL ? 'الكل' : 'All',
    critical: isRTL ? 'حرج' : 'Critical',
    high: isRTL ? 'عالي' : 'High',
    medium: isRTL ? 'متوسط' : 'Medium',
    low: isRTL ? 'منخفض' : 'Low',
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="icon-box">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="page-title">{isRTL ? 'الجهات' : 'Entities'}</h1>
            <p className="page-subtitle">
              {filteredEntities.length} {isRTL ? 'جهة' : 'entities'}
            </p>
          </div>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          <span>{isRTL ? 'تصفية' : 'Filter'}</span>
          <ChevronDown size={14} className={showFilters ? 'rotate-180' : ''} />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filters-bar">
          <div className="filter-group">
            <label>{isRTL ? 'القطاع' : 'Sector'}</label>
            <div className="filter-chips">
              {sectors.slice(0, 5).map(sector => (
                <button
                  key={sector}
                  className={`filter-chip ${sectorFilter === sector ? 'active' : ''}`}
                  onClick={() => setSectorFilter(sector)}
                >
                  {sectorLabels[sector]}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label>{isRTL ? 'المخاطر' : 'Risk'}</label>
            <div className="filter-chips">
              {riskLevels.map(level => (
                <button
                  key={level}
                  className={`filter-chip ${riskFilter === level ? 'active' : ''}`}
                  onClick={() => setRiskFilter(level)}
                >
                  {riskLabels[level]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="cards-grid">
        {filteredEntities.slice(0, 24).map(entity => (
          <EntityCard key={entity.id} entity={entity} isRTL={isRTL} />
        ))}
      </div>

      {filteredEntities.length > 24 && (
        <p className="text-center text-secondary text-sm mt-4">
          {isRTL
            ? `عرض 24 من ${filteredEntities.length} جهة`
            : `Showing 24 of ${filteredEntities.length} entities`}
        </p>
      )}
    </div>
  );
}
