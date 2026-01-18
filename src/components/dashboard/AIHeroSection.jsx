import { Target, TrendingUp, TrendingDown, AlertTriangle, ClipboardCheck, Gauge } from 'lucide-react';
import useCountUp, { formatNumber } from '../../hooks/useCountUp';
import { useLanguage } from '../../context/LanguageContext';

function KPICard({ icon: Icon, value, label, trend, trendUp, iconType, delay, isRTL }) {
  const animatedValue = useCountUp(value, 1200, delay);

  const iconStyles = {
    default: 'kpi-icon-default',
    danger: 'kpi-icon-danger',
    warning: 'kpi-icon-warning',
    success: 'kpi-icon-success',
  };

  return (
    <div className="kpi-card animate-scale-in" style={{ animationDelay: `${delay}ms` }}>
      <div className={`kpi-icon ${iconStyles[iconType] || iconStyles.default}`}>
        <Icon size={20} />
      </div>
      <div className="kpi-number">
        {formatNumber(animatedValue, isRTL)}
      </div>
      <div className="kpi-label">{label}</div>
      {trend && (
        <div className={`kpi-trend ${trendUp ? 'up' : 'down'}`}>
          {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

function GaugeKPICard({ value, label, sublabel, delay, isRTL }) {
  const animatedValue = useCountUp(value, 1200, delay);

  return (
    <div className="kpi-card animate-scale-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="kpi-icon kpi-icon-success">
        <Gauge size={20} />
      </div>
      <div className="kpi-number">
        {formatNumber(animatedValue, isRTL)}%
      </div>
      <div className="kpi-label">{label}</div>
      {sublabel && (
        <div className="text-xs text-gray-400 mt-1">{sublabel}</div>
      )}
    </div>
  );
}

export default function AIHeroSection({ stats }) {
  const { isRTL, t } = useLanguage();

  return (
    <div className="kpi-strip">
      <KPICard
        icon={Target}
        value={stats.activeMissions || 90}
        label={t('hero.activeMissions')}
        trend="+5.1%"
        trendUp={true}
        iconType="default"
        delay={0}
        isRTL={isRTL}
      />

      <GaugeKPICard
        value={stats.aiAcceptanceRate || 69}
        label={t('hero.aiAcceptanceRate')}
        sublabel={t('hero.last30Days')}
        delay={100}
        isRTL={isRTL}
      />

      <KPICard
        icon={AlertTriangle}
        value={stats.highRiskEntities || 36}
        label={t('hero.highRiskEntities')}
        trend="-8%"
        trendUp={false}
        iconType="danger"
        delay={200}
        isRTL={isRTL}
      />

      <KPICard
        icon={ClipboardCheck}
        value={stats.pendingReviews || 5}
        label={t('hero.pendingReviews')}
        trend="+12%"
        trendUp={true}
        iconType="warning"
        delay={300}
        isRTL={isRTL}
      />
    </div>
  );
}
