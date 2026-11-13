import { HeroCard, CharacterCard, NavigationCard, ProjectCards, TechStackCard, LearningCard, GitHubStatsCard, MediumArticlesCard, ContactCard } from "./components/Cards";
import { site } from "./config";

// Bento grid: 6 columns on desktop, 2 on tablet, 1 on mobile.
export default function App() {
  return (
    <div className="px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-8">
      <main className="mx-auto max-w-[1240px] rounded-frame bg-frame p-3 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.55)] sm:p-4 lg:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6 lg:gap-4">
          <HeroCard />
          <CharacterCard />
          <ProjectCards />
          <NavigationCard />
          <TechStackCard />
          <LearningCard />
          <GitHubStatsCard />
          <MediumArticlesCard />
          <ContactCard />
        </div>
        <footer className="flex justify-between px-3 pb-1 pt-5 font-mono text-[11px] text-mute">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>Data synced from GitHub & Medium</span>
        </footer>
      </main>
    </div>
  );
}
