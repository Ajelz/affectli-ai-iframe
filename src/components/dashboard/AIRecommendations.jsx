import { useState } from 'react';
import { Brain, Check, X, ChevronDown, ChevronUp, AlertTriangle, Clock, Users, TrendingUp } from 'lucide-react';

const ConfidenceBadge = ({ confidence }) => {
  const getColor = () => {
    if (confidence >= 85) return 'bg-green-100 text-green-700 border-green-200';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getColor()}`}>
      {confidence}%
    </span>
  );
};

const FactorBar = ({ factor, weight, score }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-slate-600">{factor}</span>
      <span className="text-slate-500">وزن {weight}%</span>
    </div>
    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-l from-blue-500 to-blue-400 rounded-full transition-all duration-500"
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

const RecommendationCard = ({ recommendation, onAccept, onReject }) => {
  const [expanded, setExpanded] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const getTypeIcon = () => {
    switch (recommendation.type) {
      case 'team_assignment': return Users;
      case 'deadline_extension': return Clock;
      case 'risk_escalation': return AlertTriangle;
      case 'conflict_alert': return AlertTriangle;
      default: return TrendingUp;
    }
  };

  const getTypeColor = () => {
    switch (recommendation.type) {
      case 'team_assignment': return 'text-blue-600 bg-blue-100';
      case 'deadline_extension': return 'text-orange-600 bg-orange-100';
      case 'risk_escalation': return 'text-red-600 bg-red-100';
      case 'conflict_alert': return 'text-red-600 bg-red-100';
      default: return 'text-purple-600 bg-purple-100';
    }
  };

  const Icon = getTypeIcon();
  const isPending = recommendation.status === 'pending';

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(recommendation.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  return (
    <div className={`bg-white rounded-xl border ${isPending ? 'border-purple-200' : 'border-slate-200'} overflow-hidden transition-all duration-300 ${isPending ? 'shadow-sm' : 'opacity-75'}`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg ${getTypeColor()} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ConfidenceBadge confidence={recommendation.confidence} />
              <span className="text-xs text-slate-400">
                {new Date(recommendation.createdAt).toLocaleTimeString('ar-LY', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">{recommendation.titleAr}</h4>
            <p className="text-xs text-slate-500 mt-1">{recommendation.recommendationAr}</p>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mt-3">
          <div className="confidence-bar">
            <div
              className={`confidence-fill ${
                recommendation.confidence >= 85 ? 'bg-green-500' :
                recommendation.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${recommendation.confidence}%` }}
            />
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-blue-600 mt-3 hover:text-blue-700"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{expanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}</span>
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 bg-slate-50">
          <p className="text-xs text-slate-600 mb-3">
            <span className="font-medium">السبب: </span>
            {recommendation.reasoning}
          </p>

          {recommendation.factors && (
            <div className="mb-3">
              <p className="text-xs font-medium text-slate-700 mb-2">عوامل التقييم:</p>
              {recommendation.factors.map((factor, idx) => (
                <FactorBar key={idx} {...factor} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {isPending && (
        <div className="flex border-t border-slate-100">
          <button
            onClick={() => onAccept(recommendation.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-green-600 hover:bg-green-50 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>قبول</span>
          </button>
          <div className="w-px bg-slate-100" />
          <button
            onClick={() => setShowRejectModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>رفض</span>
          </button>
        </div>
      )}

      {/* Status Badge */}
      {!isPending && (
        <div className={`px-4 py-2 text-xs font-medium text-center ${
          recommendation.status === 'accepted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {recommendation.status === 'accepted' ? 'تم القبول' : 'تم الرفض'}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">سبب الرفض</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="يرجى توضيح سبب رفض هذه التوصية..."
              className="w-full p-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                تأكيد الرفض
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AIRecommendations({ recommendations, onAccept, onReject, conflicts }) {
  const pendingRecs = recommendations.filter(r => r.status === 'pending');
  const decidedRecs = recommendations.filter(r => r.status !== 'pending');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-l from-purple-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">توصيات الذكاء الاصطناعي</h3>
              <p className="text-xs text-slate-500">{pendingRecs.length} توصية تنتظر المراجعة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {pendingRecs.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">لا توجد توصيات معلقة</p>
          </div>
        ) : (
          pendingRecs.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onAccept={onAccept}
              onReject={onReject}
            />
          ))
        )}

        {/* Conflicts Section */}
        {conflicts && conflicts.filter(c => c.resolution === 'pending').length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              تنبيهات تضارب المصالح
            </h4>
            {conflicts.filter(c => c.resolution === 'pending').map((conflict) => (
              <div key={conflict.id} className="p-3 bg-red-50 rounded-xl border border-red-100 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                    ثقة {conflict.aiConfidence}%
                  </span>
                </div>
                <p className="text-xs text-red-700">{conflict.descriptionAr}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
