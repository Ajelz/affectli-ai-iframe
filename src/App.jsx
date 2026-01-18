import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './components/pages/DashboardPage';
import MissionsPage from './components/pages/MissionsPage';
import EntitiesPage from './components/pages/EntitiesPage';
import TeamPage from './components/pages/TeamPage';
import AIPage from './components/pages/AIPage';
import ReportsPage from './components/pages/ReportsPage';
import SettingsPage from './components/pages/SettingsPage';
import { useDataSimulation } from './hooks/useDataSimulation';
import { personnel, allEntities } from './data/index';
import { missions, aiRecommendations, activityEvents, conflicts } from './data/missions';

function AppContent() {
  const { isRTL } = useLanguage();
  const { activePage } = useNavigation();

  const {
    metrics,
    simulatedMissions,
    simulatedRecommendations,
    acceptRecommendation,
    rejectRecommendation
  } = useDataSimulation({
    missions,
    recommendations: aiRecommendations,
    events: activityEvents,
    entities: allEntities,
    personnel,
  });

  const heroStats = {
    activeMissions: simulatedMissions.filter(m => m.phase !== 'closed').length,
    aiAcceptanceRate: metrics.aiAcceptanceRate,
    highRiskEntities: allEntities.filter(e => e.riskLevel === 'critical' || e.riskLevel === 'high').length,
    pendingReviews: simulatedRecommendations.filter(r => r.status === 'pending').length,
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            heroStats={heroStats}
            recommendations={simulatedRecommendations}
            onAcceptRecommendation={acceptRecommendation}
            onRejectRecommendation={rejectRecommendation}
            conflicts={conflicts}
          />
        );
      case 'missions':
        return <MissionsPage missions={simulatedMissions} />;
      case 'entities':
        return <EntitiesPage entities={allEntities} />;
      case 'team':
        return <TeamPage personnel={personnel} />;
      case 'ai':
        return <AIPage recommendations={aiRecommendations} conflicts={conflicts} />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            heroStats={heroStats}
            recommendations={simulatedRecommendations}
            onAcceptRecommendation={acceptRecommendation}
            onRejectRecommendation={rejectRecommendation}
            conflicts={conflicts}
          />
        );
    }
  };

  return (
    <div className={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-container">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </LanguageProvider>
  );
}

export default App;
