import { useState } from 'react';
import { AlertTriangle, Building2, X } from 'lucide-react';

const RiskCell = ({ likelihood, impact, entities, onClick }) => {
  const count = entities.length;
  const riskLevel = likelihood * impact;

  const getCellColor = () => {
    if (riskLevel >= 20) return 'bg-red-500 hover:bg-red-600';
    if (riskLevel >= 12) return 'bg-orange-400 hover:bg-orange-500';
    if (riskLevel >= 6) return 'bg-yellow-400 hover:bg-yellow-500';
    return 'bg-green-400 hover:bg-green-500';
  };

  return (
    <button
      onClick={() => count > 0 && onClick(entities)}
      className={`w-full aspect-square rounded-lg flex items-center justify-center text-white font-bold text-lg transition-all ${getCellColor()} ${
        count > 0 ? 'cursor-pointer shadow-sm' : 'opacity-30 cursor-default'
      }`}
    >
      {count > 0 ? count : ''}
    </button>
  );
};

const EntityModal = ({ entities, onClose }) => {
  if (!entities) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">الجهات في هذه الخلية ({entities.length})</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {entities.map((entity) => (
            <div key={entity.id} className="p-3 bg-slate-50 rounded-xl mb-2 last:mb-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{entity.nameAr}</h4>
                  <p className="text-xs text-slate-500">{entity.sectorAr}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  entity.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                  entity.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                  entity.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {entity.riskScore}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span>آخر تدقيق: {entity.daysSinceAudit} يوم</span>
                <span>{entity.employeeCount?.toLocaleString('ar-LY')} موظف</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function RiskHeatMap({ entities, onEntityClick }) {
  const [selectedEntities, setSelectedEntities] = useState(null);

  // Build risk matrix
  const buildMatrix = () => {
    const matrix = {};
    for (let l = 1; l <= 5; l++) {
      for (let i = 1; i <= 5; i++) {
        matrix[`${l}-${i}`] = [];
      }
    }

    entities.forEach((entity) => {
      // Calculate likelihood based on days since audit
      let likelihood = 1;
      if (entity.daysSinceAudit > 500) likelihood = 5;
      else if (entity.daysSinceAudit > 365) likelihood = 4;
      else if (entity.daysSinceAudit > 200) likelihood = 3;
      else if (entity.daysSinceAudit > 100) likelihood = 2;

      // Calculate impact based on risk score
      let impact = 1;
      if (entity.riskScore >= 20) impact = 5;
      else if (entity.riskScore >= 15) impact = 4;
      else if (entity.riskScore >= 10) impact = 3;
      else if (entity.riskScore >= 5) impact = 2;

      const key = `${likelihood}-${impact}`;
      if (matrix[key]) {
        matrix[key].push(entity);
      }
    });

    return matrix;
  };

  const matrix = buildMatrix();

  // Count by risk level
  const criticalCount = entities.filter(e => e.riskLevel === 'critical').length;
  const highCount = entities.filter(e => e.riskLevel === 'high').length;
  const mediumCount = entities.filter(e => e.riskLevel === 'medium').length;
  const lowCount = entities.filter(e => e.riskLevel === 'low').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">خريطة المخاطر</h3>
              <p className="text-xs text-slate-500">{entities.length} جهة</p>
            </div>
          </div>

          {/* Risk Legend */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-xs text-slate-600">{criticalCount + highCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-400" />
              <span className="text-xs text-slate-600">{mediumCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-400" />
              <span className="text-xs text-slate-600">{lowCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matrix */}
      <div className="p-4">
        <div className="flex">
          {/* Y-axis label */}
          <div className="w-8 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-400 transform -rotate-90 whitespace-nowrap">الاحتمالية</span>
          </div>

          <div className="flex-1">
            {/* Matrix Grid */}
            <div className="grid grid-cols-5 gap-2 mb-2">
              {[5, 4, 3, 2, 1].map((likelihood) =>
                [1, 2, 3, 4, 5].map((impact) => (
                  <RiskCell
                    key={`${likelihood}-${impact}`}
                    likelihood={likelihood}
                    impact={impact}
                    entities={matrix[`${likelihood}-${impact}`] || []}
                    onClick={(ents) => setSelectedEntities(ents)}
                  />
                ))
              )}
            </div>

            {/* X-axis label */}
            <div className="text-center mt-2">
              <span className="text-xs text-slate-400">التأثير ←</span>
            </div>
          </div>
        </div>

        {/* Top Risk Entities */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            أعلى الجهات خطورة
          </h4>
          <div className="space-y-2">
            {entities
              .filter(e => e.riskLevel === 'critical' || e.riskLevel === 'high')
              .sort((a, b) => b.riskScore - a.riskScore)
              .slice(0, 5)
              .map((entity) => (
                <div
                  key={entity.id}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                  onClick={() => onEntityClick && onEntityClick(entity)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      entity.riskLevel === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                    }`} />
                    <span className="text-sm text-slate-700">{entity.nameAr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{entity.daysSinceAudit} يوم</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                      {entity.riskScore}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Entity Modal */}
      {selectedEntities && (
        <EntityModal entities={selectedEntities} onClose={() => setSelectedEntities(null)} />
      )}
    </div>
  );
}
