import { LayoutDashboard, ClipboardList, Building2, Users, Brain, FileText, Settings } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';

const navItems = [
  { icon: LayoutDashboard, id: 'dashboard', label: 'Dashboard', labelAr: 'لوحة التحكم' },
  { icon: ClipboardList, id: 'missions', label: 'Missions', labelAr: 'المهام' },
  { icon: Building2, id: 'entities', label: 'Entities', labelAr: 'الجهات' },
  { icon: Users, id: 'team', label: 'Team', labelAr: 'الفريق' },
  { icon: Brain, id: 'ai', label: 'AI', labelAr: 'الذكاء الاصطناعي' },
  { icon: FileText, id: 'reports', label: 'Reports', labelAr: 'التقارير' },
];

export default function Sidebar() {
  const { isRTL } = useLanguage();
  const { activePage, setActivePage } = useNavigation();

  const handleNavClick = (id) => {
    setActivePage(id);
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        {isRTL ? 'د' : 'AB'}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
            title={isRTL ? item.labelAr : item.label}
            onClick={() => handleNavClick(item.id)}
          >
            <item.icon size={20} />
          </button>
        ))}
      </nav>

      {/* Settings at bottom */}
      <div className="sidebar-bottom">
        <button
          className={`sidebar-item ${activePage === 'settings' ? 'active' : ''}`}
          title={isRTL ? 'الإعدادات' : 'Settings'}
          onClick={() => handleNavClick('settings')}
        >
          <Settings size={20} />
        </button>
      </div>
    </aside>
  );
}
