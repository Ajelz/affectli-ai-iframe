import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Building2,
  AlertTriangle,
  Brain,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'لوحة التحكم', labelEn: 'Dashboard' },
  { id: 'missions', icon: ClipboardList, label: 'المهام', labelEn: 'Missions' },
  { id: 'entities', icon: Building2, label: 'الجهات', labelEn: 'Entities' },
  { id: 'team', icon: Users, label: 'الفريق', labelEn: 'Team' },
  { id: 'risks', icon: AlertTriangle, label: 'المخاطر', labelEn: 'Risks' },
  { id: 'ai', icon: Brain, label: 'الذكاء الاصطناعي', labelEn: 'AI' },
  { id: 'reports', icon: BarChart3, label: 'التقارير', labelEn: 'Reports' },
];

const bottomItems = [
  { id: 'settings', icon: Settings, label: 'الإعدادات', labelEn: 'Settings' },
  { id: 'help', icon: HelpCircle, label: 'المساعدة', labelEn: 'Help' },
];

export default function Sidebar({ isOpen, activeView, onViewChange }) {
  return (
    <aside
      className={`fixed right-0 top-0 h-full bg-slate-900 text-white z-50 transition-all duration-300 flex flex-col ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Logo Section */}
      <div className={`p-4 border-b border-slate-800 ${isOpen ? '' : 'flex justify-center'}`}>
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">د</span>
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-sm truncate">ديوان المحاسبة</h2>
              <p className="text-xs text-slate-400 truncate">Libyan Audit Bureau</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">د</span>
          </div>
        )}
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${isOpen ? '' : 'justify-center'}`}
              title={isOpen ? '' : item.label}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? '' : ''}`} />
              {isOpen && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {isOpen && isActive && (
                <ChevronLeft className="w-4 h-4 mr-auto" />
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Stats Card */}
      {isOpen && (
        <div className="mx-3 mb-3 p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">أداء AI</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">معدل القبول</span>
              <span className="text-green-400 font-semibold">94.2%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-l from-green-400 to-green-500 rounded-full" style={{ width: '94.2%' }}></div>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-slate-400">توصيات اليوم</span>
              <span className="text-blue-400 font-semibold">12</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Menu */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-slate-400 hover:bg-slate-800 hover:text-white ${
                isOpen ? '' : 'justify-center'
              }`}
              title={isOpen ? '' : item.label}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
