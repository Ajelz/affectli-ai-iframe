import { TrendingUp, TrendingDown, ClipboardList, AlertTriangle, Brain, Clock, CheckCircle } from 'lucide-react';
import Sparkline from '../charts/Sparkline';

const MetricCard = ({ title, value, suffix = '', icon: Icon, trend, trendValue, sparklineData, color }) => {
  const isPositive = trend === 'up';
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trendValue}%</span>
          </div>
        )}
      </div>

      <div className="mb-3">
        <p className="text-3xl font-bold text-slate-800">
          {typeof value === 'number' ? value.toLocaleString('ar-LY') : value}
          {suffix && <span className="text-lg text-slate-400 mr-1">{suffix}</span>}
        </p>
        <p className="text-sm text-slate-500 mt-1">{title}</p>
      </div>

      {sparklineData && (
        <div className="h-10">
          <Sparkline data={sparklineData} color={color} />
        </div>
      )}
    </div>
  );
};

export default function ExecutiveSummary({ metrics }) {
  const cards = [
    {
      title: 'إنجاز الخطة السنوية',
      value: metrics.planCompletion,
      suffix: '%',
      icon: CheckCircle,
      trend: 'up',
      trendValue: 3.2,
      sparklineData: metrics.sparklines.planCompletion,
      color: 'green',
    },
    {
      title: 'المهام النشطة',
      value: metrics.activeMissions,
      icon: ClipboardList,
      trend: 'up',
      trendValue: 5.1,
      sparklineData: metrics.sparklines.activeMissions,
      color: 'blue',
    },
    {
      title: 'جهات عالية الخطورة',
      value: metrics.highRiskEntities,
      icon: AlertTriangle,
      trend: 'down',
      trendValue: 8.0,
      sparklineData: metrics.sparklines.highRiskEntities,
      color: 'red',
    },
    {
      title: 'معدل قبول توصيات AI',
      value: metrics.aiAcceptanceRate,
      suffix: '%',
      icon: Brain,
      trend: 'up',
      trendValue: 1.5,
      sparklineData: metrics.sparklines.aiAcceptanceRate,
      color: 'purple',
    },
    {
      title: 'مراجعات معلقة',
      value: metrics.pendingReviews,
      icon: Clock,
      trend: 'down',
      trendValue: 12.0,
      sparklineData: metrics.sparklines.pendingReviews,
      color: 'orange',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <MetricCard {...card} />
        </div>
      ))}
    </div>
  );
}
