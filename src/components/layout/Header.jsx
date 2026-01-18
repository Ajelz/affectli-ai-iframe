import { Bell, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function Header() {
  const { language, isRTL, t, switchLanguage } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      textEn: 'New AI recommendation awaiting review',
      textAr: 'توصية AI جديدة تنتظر المراجعة',
      timeEn: '5 minutes ago',
      timeAr: 'منذ 5 دقائق',
      unread: true
    },
    {
      id: 2,
      textEn: 'Potential conflict of interest detected',
      textAr: 'تم اكتشاف تضارب مصالح محتمل',
      timeEn: '15 minutes ago',
      timeAr: 'منذ 15 دقيقة',
      unread: true
    },
    {
      id: 3,
      textEn: 'Republic Bank mission completed',
      textAr: 'اكتملت مهمة مصرف الجمهورية',
      timeEn: '1 hour ago',
      timeAr: 'منذ ساعة',
      unread: false
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="header">
      {/* Left - Title */}
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="header-title">{t('header.title')}</h1>
          <p className="header-subtitle">{t('header.subtitle')}</p>
        </div>
      </div>

      {/* Center - AI Status */}
      <div className="ai-status hidden md:flex">
        <span className="ai-status-dot" />
        <span>{t('hero.aiProcessing')}</span>
      </div>

      {/* Right - Controls */}
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Language Toggle */}
        <button onClick={switchLanguage} className="lang-toggle">
          <Globe size={16} />
          <span>{language === 'en' ? 'عربي' : 'EN'}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="notification-btn"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="dropdown">
                <div className="dropdown-header">
                  {t('header.notifications')}
                </div>
                <div className="dropdown-body">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`dropdown-item ${notification.unread ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          {isRTL ? notification.textAr : notification.textEn}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {isRTL ? notification.timeAr : notification.timeEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar */}
        <div className="user-avatar">
          {isRTL ? 'خ' : 'KS'}
        </div>
      </div>
    </header>
  );
}
