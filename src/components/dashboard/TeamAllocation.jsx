import { Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const specializations = [
  { id: 'banking', nameAr: 'المصارف', color: 'bg-blue-500' },
  { id: 'oil_gas', nameAr: 'النفط والغاز', color: 'bg-orange-500' },
  { id: 'utilities', nameAr: 'المرافق', color: 'bg-green-500' },
  { id: 'compliance', nameAr: 'الالتزام', color: 'bg-purple-500' },
  { id: 'forensic', nameAr: 'الجنائي', color: 'bg-red-500' },
  { id: 'it_systems', nameAr: 'نظم المعلومات', color: 'bg-cyan-500' },
];

const getAvailabilityColor = (percent) => {
  if (percent >= 70) return 'bg-green-500';
  if (percent >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getAvailabilityStatus = (percent) => {
  if (percent >= 70) return { text: 'متاح', color: 'text-green-600', bg: 'bg-green-50' };
  if (percent >= 40) return { text: 'مشغول جزئياً', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  return { text: 'مشغول', color: 'text-red-600', bg: 'bg-red-50' };
};

const AuditorCard = ({ auditor }) => {
  const status = getAvailabilityStatus(auditor.availabilityPercent);
  const spec = specializations.find(s => s.id === auditor.specialization);

  return (
    <div className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-white font-semibold text-sm">
            {auditor.nameAr.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-slate-800 text-sm truncate">{auditor.nameAr}</h4>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.bg} ${status.color}`}>
              {status.text}
            </span>
          </div>
          <p className="text-xs text-slate-500">{auditor.department}</p>

          <div className="flex items-center gap-2 mt-2">
            {spec && (
              <span className={`w-2 h-2 rounded-full ${spec.color}`} title={spec.nameAr} />
            )}
            <span className="text-xs text-slate-400">{auditor.yearsExperience} سنة خبرة</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400">{auditor.currentAssignments} مهام</span>
          </div>

          {/* Availability Bar */}
          <div className="mt-2">
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getAvailabilityColor(auditor.availabilityPercent)}`}
                style={{ width: `${auditor.availabilityPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TeamAllocation({ personnel, missions }) {
  // Calculate stats
  const available = personnel.filter(p => p.availabilityPercent >= 70).length;
  const partial = personnel.filter(p => p.availabilityPercent >= 40 && p.availabilityPercent < 70).length;
  const busy = personnel.filter(p => p.availabilityPercent < 40).length;

  // Group by specialization
  const bySpec = specializations.map(spec => ({
    ...spec,
    count: personnel.filter(p => p.specialization === spec.id).length,
    available: personnel.filter(p => p.specialization === spec.id && p.availabilityPercent >= 70).length,
  }));

  // Sort personnel by availability
  const sortedPersonnel = [...personnel].sort((a, b) => b.availabilityPercent - a.availabilityPercent);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">مصفوفة توزيع الفرق</h3>
              <p className="text-xs text-slate-500">{personnel.length} مدقق</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-slate-600">{available} متاح</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-slate-600">{partial} جزئي</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-slate-600">{busy} مشغول</span>
          </div>
        </div>
      </div>

      {/* Specialization Grid */}
      <div className="p-4 border-b border-slate-100">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">التوزيع حسب التخصص</h4>
        <div className="grid grid-cols-3 gap-2">
          {bySpec.map((spec) => (
            <div key={spec.id} className="p-2 bg-slate-50 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className={`w-2 h-2 rounded-full ${spec.color}`} />
                <span className="text-xs font-medium text-slate-600">{spec.nameAr}</span>
              </div>
              <div className="text-lg font-bold text-slate-800">{spec.count}</div>
              <div className="text-xs text-green-600">{spec.available} متاح</div>
            </div>
          ))}
        </div>
      </div>

      {/* Auditor List */}
      <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">المدققون حسب التوفر</h4>
        {sortedPersonnel.slice(0, 10).map((auditor) => (
          <AuditorCard key={auditor.id} auditor={auditor} />
        ))}

        {personnel.length > 10 && (
          <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            عرض الكل ({personnel.length})
          </button>
        )}
      </div>
    </div>
  );
}
