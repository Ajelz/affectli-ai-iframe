import AIHeroSection from '../dashboard/AIHeroSection';
import AIRecommendations from '../dashboard/AIRecommendations';

export default function DashboardPage({
  heroStats,
  recommendations,
  onAcceptRecommendation,
  onRejectRecommendation,
  conflicts
}) {
  return (
    <>
      <AIHeroSection stats={heroStats} />
      <AIRecommendations
        recommendations={recommendations}
        onAccept={onAcceptRecommendation}
        onReject={onRejectRecommendation}
        conflicts={conflicts}
      />
    </>
  );
}
