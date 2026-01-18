import { Settings, Globe, Eye, Bell } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

function SettingSection({ title, children }) {
  return (
    <div className="setting-section">
      <h2 className="setting-section-title">{title}</h2>
      <div className="setting-section-content">{children}</div>
    </div>
  );
}

function LanguageToggle({ isRTL, onToggle }) {
  return (
    <div className="language-toggle">
      <button
        className={`lang-option ${!isRTL ? 'active' : ''}`}
        onClick={() => onToggle('en')}
      >
        English
      </button>
      <button
        className={`lang-option ${isRTL ? 'active' : ''}`}
        onClick={() => onToggle('ar')}
      >
        العربية
      </button>
    </div>
  );
}

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="toggle-row">
      <span className="toggle-label">{label}</span>
      <div className={`toggle-switch ${checked ? 'active' : ''}`} onClick={onChange}>
        <div className="toggle-thumb" />
      </div>
    </label>
  );
}

export default function SettingsPage() {
  const { isRTL, language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="icon-box">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="page-title">{isRTL ? 'الإعدادات' : 'Settings'}</h1>
            <p className="page-subtitle">
              {isRTL ? 'تخصيص تجربة لوحة التحكم' : 'Customize your dashboard experience'}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="settings-container">
        <SettingSection title={isRTL ? 'اللغة' : 'Language'}>
          <div className="setting-item">
            <div className="setting-info">
              <Globe size={18} />
              <div>
                <span className="setting-label">
                  {isRTL ? 'لغة الواجهة' : 'Interface Language'}
                </span>
                <span className="setting-desc">
                  {isRTL ? 'اختر اللغة المفضلة للوحة التحكم' : 'Choose your preferred dashboard language'}
                </span>
              </div>
            </div>
            <LanguageToggle isRTL={isRTL} onToggle={handleLanguageChange} />
          </div>
        </SettingSection>

        <SettingSection title={isRTL ? 'العرض' : 'Display'}>
          <div className="setting-item">
            <div className="setting-info">
              <Eye size={18} />
              <div>
                <span className="setting-label">
                  {isRTL ? 'إظهار نسب الثقة' : 'Show Confidence Scores'}
                </span>
                <span className="setting-desc">
                  {isRTL ? 'عرض نسب ثقة الذكاء الاصطناعي في التوصيات' : 'Display AI confidence percentages on recommendations'}
                </span>
              </div>
            </div>
            <ToggleSwitch checked={true} onChange={() => {}} label="" />
          </div>
        </SettingSection>

        <SettingSection title={isRTL ? 'الإشعارات' : 'Notifications'}>
          <div className="setting-item">
            <div className="setting-info">
              <Bell size={18} />
              <div>
                <span className="setting-label">
                  {isRTL ? 'التحديثات المباشرة' : 'Real-time Updates'}
                </span>
                <span className="setting-desc">
                  {isRTL ? 'تلقي تحديثات فورية للتوصيات والتنبيهات' : 'Receive instant updates for recommendations and alerts'}
                </span>
              </div>
            </div>
            <ToggleSwitch checked={true} onChange={() => {}} label="" />
          </div>
        </SettingSection>
      </div>
    </div>
  );
}
