import { Menu, Bell, Search, Calendar, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Header({ onToggleSidebar, sidebarOpen }) {
  const [dateRange, setDateRange] = useState('2024');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'توصية AI جديدة تنتظر المراجعة', time: 'منذ 5 دقائق', unread: true },
    { id: 2, text: 'تم اكتشاف تضارب مصالح محتمل', time: 'منذ 15 دقيقة', unread: true },
    { id: 3, text: 'اكتملت مهمة مصرف الجمهورية', time: 'منذ ساعة', unread: false },
    { id: 4, text: 'تحديث مستوى المخاطر للمؤسسة الوطنية للنفط', time: 'منذ ساعتين', unread: false },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Right Side - Logo and Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">د</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">ديوان المحاسبة الليبي</h1>
              <p className="text-xs text-slate-500">لوحة التحكم الذكية</p>
            </div>
          </div>
        </div>

        {/* Center - Search and Filters */}
        <div className="flex items-center gap-4 flex-1 max-w-2xl mx-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="البحث في المهام والجهات..."
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm hover:bg-slate-100 transition-colors">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700">{dateRange}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Sector Filter */}
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm hover:bg-slate-100 transition-colors">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700">جميع القطاعات</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Left Side - Notifications and User */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 left-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">الإشعارات</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <p className="text-sm text-slate-700">{notification.text}</p>
                      <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-slate-100">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                    عرض جميع الإشعارات
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User */}
          <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
            <div className="text-left">
              <p className="text-sm font-medium text-slate-800">خالد أحمد شكشك</p>
              <p className="text-xs text-slate-500">رئيس الديوان</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-semibold">خ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Update Indicator */}
      <div className="px-6 py-2 bg-gradient-to-l from-green-50 to-transparent border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs text-slate-500">
            تحديث مباشر • آخر تحديث: {new Date().toLocaleTimeString('ar-LY')}
          </span>
        </div>
      </div>
    </header>
  );
}
