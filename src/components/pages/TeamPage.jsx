import { useState, useMemo } from 'react';
import { Users, Filter, ChevronDown, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const departments = ['all', 'الرقابة المالية', 'رقابة الأداء', 'الرقابة المسبقة', 'التدقيق الجنائي', 'تدقيق نظم المعلومات', 'رقابة الالتزام'];
const grades = ['all', 'senior', 'mid', 'junior'];

function AvailabilityBar({ percent }) {
  const color = percent >= 70 ? '#10B981' : percent >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <div className="availability-bar">
      <div className="availability-fill" style={{ width: `${percent}%`, backgroundColor: color }} />
    </div>
  );
}

function AuditorCard({ auditor, isRTL }) {
  const gradeLabels = {
    senior: isRTL ? 'أول' : 'Senior',
    mid: isRTL ? 'ثاني' : 'Mid',
    junior: isRTL ? 'مبتدئ' : 'Junior',
  };

  const specLabels = {
    banking: isRTL ? 'مصارف' : 'Banking',
    oil_gas: isRTL ? 'نفط وغاز' : 'Oil & Gas',
    operations: isRTL ? 'عمليات' : 'Operations',
    contracts: isRTL ? 'عقود' : 'Contracts',
    compliance: isRTL ? 'امتثال' : 'Compliance',
    forensic: isRTL ? 'جنائي' : 'Forensic',
    it_systems: isRTL ? 'نظم معلومات' : 'IT Systems',
    healthcare: isRTL ? 'صحة' : 'Healthcare',
    education: isRTL ? 'تعليم' : 'Education',
    utilities: isRTL ? 'مرافق' : 'Utilities',
  };

  return (
    <div className="auditor-card">
      <div className="auditor-avatar">
        {(isRTL ? auditor.nameAr : auditor.nameEn).charAt(0)}
      </div>

      <div className="auditor-info">
        <h3 className="auditor-name">
          {isRTL ? auditor.nameAr : auditor.nameEn}
        </h3>
        <p className="auditor-meta">
          {gradeLabels[auditor.grade]} • {specLabels[auditor.specialization] || auditor.specialization}
        </p>
      </div>

      <div className="auditor-stats">
        <div className="stat-row">
          <span className="stat-label">{isRTL ? 'الخبرة' : 'Experience'}</span>
          <span className="stat-value">{auditor.yearsExperience} {isRTL ? 'سنة' : 'yrs'}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">{isRTL ? 'المهام' : 'Assignments'}</span>
          <span className="stat-value">{auditor.currentAssignments}</span>
        </div>
      </div>

      {auditor.certifications.length > 0 && (
        <div className="auditor-certs">
          <Award size={12} />
          {auditor.certifications.slice(0, 3).map(cert => (
            <span key={cert} className="cert-badge">{cert}</span>
          ))}
        </div>
      )}

      <div className="auditor-availability">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-secondary">
            {isRTL ? 'التوفر' : 'Availability'}
          </span>
          <span className="text-sm font-medium">{auditor.availabilityPercent}%</span>
        </div>
        <AvailabilityBar percent={auditor.availabilityPercent} />
      </div>
    </div>
  );
}

export default function TeamPage({ personnel }) {
  const { isRTL } = useLanguage();
  const [deptFilter, setDeptFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPersonnel = useMemo(() => {
    return personnel.filter(p => {
      if (deptFilter !== 'all' && p.department !== deptFilter) return false;
      if (gradeFilter !== 'all' && p.grade !== gradeFilter) return false;
      return true;
    }).sort((a, b) => b.availabilityPercent - a.availabilityPercent);
  }, [personnel, deptFilter, gradeFilter]);

  const deptLabelsEn = {
    'all': 'All',
    'الرقابة المالية': 'Financial Audit',
    'رقابة الأداء': 'Performance Audit',
    'الرقابة المسبقة': 'Pre-Contract',
    'التدقيق الجنائي': 'Forensic Audit',
    'تدقيق نظم المعلومات': 'IT Audit',
    'رقابة الالتزام': 'Compliance',
  };

  const gradeLabels = {
    all: isRTL ? 'الكل' : 'All',
    senior: isRTL ? 'أول' : 'Senior',
    mid: isRTL ? 'ثاني' : 'Mid',
    junior: isRTL ? 'مبتدئ' : 'Junior',
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="icon-box">
            <Users size={20} />
          </div>
          <div>
            <h1 className="page-title">{isRTL ? 'الفريق' : 'Team'}</h1>
            <p className="page-subtitle">
              {filteredPersonnel.length} {isRTL ? 'مدقق' : 'auditors'}
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
            <label>{isRTL ? 'القسم' : 'Department'}</label>
            <div className="filter-chips">
              {departments.slice(0, 4).map(dept => (
                <button
                  key={dept}
                  className={`filter-chip ${deptFilter === dept ? 'active' : ''}`}
                  onClick={() => setDeptFilter(dept)}
                >
                  {dept === 'all' ? (isRTL ? 'الكل' : 'All') : (isRTL ? dept : deptLabelsEn[dept])}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label>{isRTL ? 'الدرجة' : 'Grade'}</label>
            <div className="filter-chips">
              {grades.map(grade => (
                <button
                  key={grade}
                  className={`filter-chip ${gradeFilter === grade ? 'active' : ''}`}
                  onClick={() => setGradeFilter(grade)}
                >
                  {gradeLabels[grade]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="cards-grid cards-grid-sm">
        {filteredPersonnel.map(auditor => (
          <AuditorCard key={auditor.id} auditor={auditor} isRTL={isRTL} />
        ))}
      </div>
    </div>
  );
}
