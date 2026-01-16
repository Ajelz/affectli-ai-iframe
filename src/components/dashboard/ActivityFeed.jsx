import { useState, useEffect, useRef } from 'react';
import { Activity, Play, CheckCircle, Brain, AlertTriangle, Users, Clock, TrendingUp, FileText, X, ChevronDown } from 'lucide-react';

const iconMap = {
  play: Play,
  check: CheckCircle,
  brain: Brain,
  alert: AlertTriangle,
  users: Users,
  clock: Clock,
  trending: TrendingUp,
  file: FileText,
  x: X,
};

const EventItem = ({ event, isNew }) => {
  const Icon = iconMap[event.iconType] || Activity;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'الآن';
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    return date.toLocaleDateString('ar-LY', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-500 ${
      isNew ? 'bg-blue-50 animate-fade-in' : 'hover:bg-slate-50'
    } ${!event.read ? 'border-r-2 border-blue-500' : ''}`}>
      <div className={`w-8 h-8 rounded-lg ${event.colorClass} flex items-center justify-center shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700">{event.message}</p>
        {event.entityAr && (
          <p className="text-xs text-slate-500 mt-0.5">{event.entityAr}</p>
        )}
        <p className="text-xs text-slate-400 mt-1">{formatTime(event.timestamp)}</p>
      </div>
      {!event.read && (
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
      )}
    </div>
  );
};

export default function ActivityFeed({ events }) {
  const [visibleCount, setVisibleCount] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [newEventIds, setNewEventIds] = useState(new Set());
  const feedRef = useRef(null);
  const prevEventsRef = useRef(events);

  // Track new events
  useEffect(() => {
    const prevIds = new Set(prevEventsRef.current.map(e => e.id));
    const newIds = events.filter(e => !prevIds.has(e.id)).map(e => e.id);

    if (newIds.length > 0) {
      setNewEventIds(new Set(newIds));

      // Clear new status after animation
      setTimeout(() => {
        setNewEventIds(new Set());
      }, 3000);
    }

    prevEventsRef.current = events;
  }, [events]);

  // Auto-scroll to top when new events arrive (if not paused)
  useEffect(() => {
    if (!isPaused && feedRef.current && newEventIds.size > 0) {
      feedRef.current.scrollTop = 0;
    }
  }, [newEventIds, isPaused]);

  const displayedEvents = events.slice(0, visibleCount);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">سجل النشاطات</h3>
              <p className="text-xs text-slate-500">{events.length} نشاط</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${isPaused ? 'hidden' : ''}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPaused ? 'bg-slate-400' : 'bg-green-500'}`}></span>
              </span>
              <span className="text-xs font-medium text-green-700">{isPaused ? 'متوقف' : 'مباشر'}</span>
            </div>

            {/* Pause button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isPaused
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isPaused ? 'استئناف' : 'إيقاف مؤقت'}
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div
        ref={feedRef}
        className="max-h-[400px] overflow-y-auto p-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="space-y-1">
          {displayedEvents.map((event, index) => (
            <EventItem
              key={event.id}
              event={event}
              isNew={newEventIds.has(event.id)}
            />
          ))}
        </div>

        {visibleCount < events.length && (
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + 10, events.length))}
            className="w-full py-3 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <ChevronDown className="w-4 h-4" />
            <span>عرض المزيد ({events.length - visibleCount} متبقي)</span>
          </button>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>آخر 24 ساعة</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              {events.filter(e => e.type === 'mission_completed').length} مكتمل
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              {events.filter(e => e.type === 'ai_recommendation').length} توصية AI
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              {events.filter(e => e.type === 'conflict_detected').length} تنبيه
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
