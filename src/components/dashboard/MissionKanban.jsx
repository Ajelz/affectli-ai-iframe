import { useState } from 'react';
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ClipboardList, Users, Calendar, AlertTriangle, GripVertical, Brain } from 'lucide-react';

const phases = [
  { id: 'planning', nameAr: 'تخطيط', color: 'bg-slate-500' },
  { id: 'fieldwork', nameAr: 'تنفيذ', color: 'bg-blue-500' },
  { id: 'review', nameAr: 'مراجعة', color: 'bg-yellow-500' },
  { id: 'reporting', nameAr: 'تقرير', color: 'bg-purple-500' },
  { id: 'closed', nameAr: 'مغلق', color: 'bg-green-500' },
];

const getRiskColor = (level) => {
  switch (level) {
    case 'high': return 'bg-red-100 text-red-700 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const MissionCard = ({ mission, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: mission.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border border-slate-200 p-3 mb-2 cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'shadow-xl opacity-90 scale-105' : 'shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="mt-1 text-slate-300 hover:text-slate-400">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getRiskColor(mission.riskLevel)}`}>
              {mission.riskLevel === 'high' ? 'عالي' : mission.riskLevel === 'medium' ? 'متوسط' : 'منخفض'}
            </span>
            {mission.aiRecommendation && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium flex items-center gap-1">
                <Brain className="w-3 h-3" />
                AI
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-slate-800 truncate">{mission.titleAr}</h4>
          <p className="text-xs text-slate-500 mt-1">{mission.entityNameAr}</p>

          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {mission.teamMembers?.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(mission.plannedEndDate).toLocaleDateString('ar-LY', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">التقدم</span>
              <span className="font-medium text-slate-700">{mission.progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-blue-500 to-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${mission.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ phase, missions }) => {
  const columnMissions = missions.filter(m => m.phase === phase.id);

  return (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${phase.color}`} />
        <h3 className="font-semibold text-slate-700">{phase.nameAr}</h3>
        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
          {columnMissions.length}
        </span>
      </div>

      <div className="bg-slate-50 rounded-xl p-2 min-h-[400px]">
        <SortableContext items={columnMissions.map(m => m.id)} strategy={verticalListSortingStrategy}>
          {columnMissions.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-slate-400 text-sm">
              لا توجد مهام
            </div>
          ) : (
            columnMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default function MissionKanban({ missions, personnel, onMissionClick }) {
  const [activeMission, setActiveMission] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const mission = missions.find(m => m.id === active.id);
    setActiveMission(mission);
  };

  const handleDragEnd = (event) => {
    setActiveMission(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">مركز قيادة المهام</h3>
              <p className="text-xs text-slate-500">{missions.length} مهمة نشطة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {phases.map((phase) => (
              <div key={phase.id} className="flex items-center gap-1 text-xs text-slate-500">
                <div className={`w-2 h-2 rounded-full ${phase.color}`} />
                <span>{missions.filter(m => m.phase === phase.id).length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-4 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4">
            {phases.map((phase) => (
              <KanbanColumn key={phase.id} phase={phase} missions={missions} />
            ))}
          </div>

          <DragOverlay>
            {activeMission && <MissionCard mission={activeMission} isDragging />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
