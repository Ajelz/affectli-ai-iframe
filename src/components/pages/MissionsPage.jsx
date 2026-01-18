import { useState, useMemo } from 'react';
import { ClipboardList, Filter, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const phases = ['all', 'planning', 'fieldwork', 'review', 'reporting', 'closed'];
const riskLevels = ['all', 'high', 'medium', 'low'];

function ProgressBar({ value }) {
  return (
    <div className="progress-bar-sm">
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

function RiskBadge({ level, isRTL }) {
  const labels = {
    high: isRTL ? 'عالي' : 'High',
    medium: isRTL ? 'متوسط' : 'Medium',
    low: isRTL ? 'منخفض' : 'Low',
  };
  return <span className={`risk-badge risk-${level}`}>{labels[level]}</span>;
}

function PhaseBadge({ phase, isRTL }) {
  const labels = {
    planning: isRTL ? 'تخطيط' : 'Planning',
    fieldwork: isRTL ? 'ميداني' : 'Fieldwork',
    review: isRTL ? 'مراجعة' : 'Review',
    reporting: isRTL ? 'تقرير' : 'Reporting',
    closed: isRTL ? 'مغلق' : 'Closed',
  };
  return <span className={`phase-badge phase-${phase}`}>{labels[phase]}</span>;
}

export default function MissionsPage({ missions }) {
  const { isRTL, t } = useLanguage();
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredMissions = useMemo(() => {
    return missions.filter(m => {
      if (phaseFilter !== 'all' && m.phase !== phaseFilter) return false;
      if (riskFilter !== 'all' && m.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [missions, phaseFilter, riskFilter]);

  const phaseLabels = {
    all: isRTL ? 'الكل' : 'All',
    planning: isRTL ? 'تخطيط' : 'Planning',
    fieldwork: isRTL ? 'ميداني' : 'Fieldwork',
    review: isRTL ? 'مراجعة' : 'Review',
    reporting: isRTL ? 'تقرير' : 'Reporting',
    closed: isRTL ? 'مغلق' : 'Closed',
  };

  const riskLabels = {
    all: isRTL ? 'الكل' : 'All',
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
            <ClipboardList size={20} />
          </div>
          <div>
            <h1 className="page-title">{isRTL ? 'المهام' : 'Missions'}</h1>
            <p className="page-subtitle">
              {filteredMissions.length} {isRTL ? 'مهمة' : 'missions'}
              {(phaseFilter !== 'all' || riskFilter !== 'all') &&
                ` (${isRTL ? 'مفلترة' : 'filtered'})`}
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
            <label>{isRTL ? 'المرحلة' : 'Phase'}</label>
            <div className="filter-chips">
              {phases.map(phase => (
                <button
                  key={phase}
                  className={`filter-chip ${phaseFilter === phase ? 'active' : ''}`}
                  onClick={() => setPhaseFilter(phase)}
                >
                  {phaseLabels[phase]}
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

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isRTL ? 'المعرف' : 'ID'}</th>
              <th>{isRTL ? 'العنوان' : 'Title'}</th>
              <th>{isRTL ? 'الجهة' : 'Entity'}</th>
              <th>{isRTL ? 'المرحلة' : 'Phase'}</th>
              <th>{isRTL ? 'المخاطر' : 'Risk'}</th>
              <th>{isRTL ? 'التقدم' : 'Progress'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredMissions.slice(0, 20).map(mission => (
              <tr key={mission.id}>
                <td className="font-mono text-sm">{mission.id.split('-').pop()}</td>
                <td className="font-medium">
                  {isRTL ? mission.typeAr : mission.type.replace('_', ' ')}
                </td>
                <td className="text-secondary">
                  {isRTL ? mission.entityNameAr : mission.entityNameEn}
                </td>
                <td><PhaseBadge phase={mission.phase} isRTL={isRTL} /></td>
                <td><RiskBadge level={mission.riskLevel} isRTL={isRTL} /></td>
                <td>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={mission.progress} />
                    <span className="text-sm text-secondary">{mission.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredMissions.length > 20 && (
        <p className="text-center text-secondary text-sm mt-4">
          {isRTL
            ? `عرض 20 من ${filteredMissions.length} مهمة`
            : `Showing 20 of ${filteredMissions.length} missions`}
        </p>
      )}
    </div>
  );
}
