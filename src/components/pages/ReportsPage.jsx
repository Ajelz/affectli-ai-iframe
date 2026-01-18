import { FileText, BarChart3, Users, Building2, AlertTriangle, Download } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const reports = [
  {
    id: 'annual-summary',
    icon: BarChart3,
    titleEn: 'Annual Audit Summary',
    titleAr: 'ملخص التدقيق السنوي',
    descEn: 'Overview of all audits completed this year',
    descAr: 'نظرة عامة على جميع عمليات التدقيق المكتملة هذا العام',
  },
  {
    id: 'entity-risk',
    icon: Building2,
    titleEn: 'Entity Risk Report',
    titleAr: 'تقرير مخاطر الجهات',
    descEn: 'Risk assessment for all monitored entities',
    descAr: 'تقييم المخاطر لجميع الجهات الخاضعة للرقابة',
  },
  {
    id: 'team-performance',
    icon: Users,
    titleEn: 'Team Performance Report',
    titleAr: 'تقرير أداء الفريق',
    descEn: 'Auditor productivity and assignment metrics',
    descAr: 'إنتاجية المدققين ومقاييس المهام',
  },
  {
    id: 'high-risk',
    icon: AlertTriangle,
    titleEn: 'High-Risk Entities Report',
    titleAr: 'تقرير الجهات عالية المخاطر',
    descEn: 'Detailed analysis of critical and high-risk entities',
    descAr: 'تحليل مفصل للجهات الحرجة وعالية المخاطر',
  },
  {
    id: 'mission-status',
    icon: FileText,
    titleEn: 'Mission Status Report',
    titleAr: 'تقرير حالة المهام',
    descEn: 'Current status of all active audit missions',
    descAr: 'الحالة الراهنة لجميع مهام التدقيق النشطة',
  },
];

function ReportCard({ report, isRTL, onGenerate }) {
  const Icon = report.icon;

  return (
    <div className="report-card">
      <div className="report-icon">
        <Icon size={20} />
      </div>
      <div className="report-content">
        <h3 className="report-title">
          {isRTL ? report.titleAr : report.titleEn}
        </h3>
        <p className="report-desc">
          {isRTL ? report.descAr : report.descEn}
        </p>
      </div>
      <button className="btn btn-primary btn-sm" onClick={() => onGenerate(report.id)}>
        <Download size={14} />
        <span>{isRTL ? 'إنشاء' : 'Generate'}</span>
      </button>
    </div>
  );
}

export default function ReportsPage() {
  const { isRTL } = useLanguage();

  const handleGenerate = (reportId) => {
    // In a real app, this would trigger report generation
    alert(isRTL ? `جاري إنشاء التقرير: ${reportId}` : `Generating report: ${reportId}`);
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="icon-box">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="page-title">{isRTL ? 'التقارير' : 'Reports'}</h1>
            <p className="page-subtitle">
              {isRTL ? 'إنشاء وتحميل التقارير' : 'Generate and download reports'}
            </p>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="reports-list">
        {reports.map(report => (
          <ReportCard
            key={report.id}
            report={report}
            isRTL={isRTL}
            onGenerate={handleGenerate}
          />
        ))}
      </div>
    </div>
  );
}
