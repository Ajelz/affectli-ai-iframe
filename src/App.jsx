import { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ExecutiveSummary from './components/dashboard/ExecutiveSummary';
import MissionKanban from './components/dashboard/MissionKanban';
import AIRecommendations from './components/dashboard/AIRecommendations';
import RiskHeatMap from './components/dashboard/RiskHeatMap';
import TeamAllocation from './components/dashboard/TeamAllocation';
import ActivityFeed from './components/dashboard/ActivityFeed';
import { useDataSimulation } from './hooks/useDataSimulation';
import { personnel, allEntities } from './data/index';
import { missions, aiRecommendations, activityEvents, conflicts } from './data/missions';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);

  const {
    metrics,
    simulatedMissions,
    simulatedRecommendations,
    simulatedEvents,
    acceptRecommendation,
    rejectRecommendation
  } = useDataSimulation({
    missions,
    recommendations: aiRecommendations,
    events: activityEvents,
    entities: allEntities,
    personnel,
  });

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar
        isOpen={sidebarOpen}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-16'}`}>
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 p-6 overflow-auto">
          <ExecutiveSummary metrics={metrics} />

          <div className="grid grid-cols-12 gap-6 mt-6">
            <div className="col-span-12 xl:col-span-8">
              <MissionKanban
                missions={simulatedMissions}
                personnel={personnel}
                onMissionClick={setSelectedMission}
              />
            </div>

            <div className="col-span-12 xl:col-span-4">
              <AIRecommendations
                recommendations={simulatedRecommendations}
                onAccept={acceptRecommendation}
                onReject={rejectRecommendation}
                conflicts={conflicts}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <RiskHeatMap
                entities={allEntities}
                onEntityClick={setSelectedEntity}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <TeamAllocation
                personnel={personnel}
                missions={simulatedMissions}
              />
            </div>

            <div className="col-span-12">
              <ActivityFeed events={simulatedEvents} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
