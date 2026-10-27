/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { securityShield } from './services/securityEngine';
import { CinematicIntro } from './components/CinematicIntro';
import { WelcomeSlides } from './components/WelcomeSlides';
import { AuthView } from './components/AuthView';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ReelsView } from './components/ReelsView';
import { LiveChannelsView } from './components/LiveChannelsView';
import { MyListView } from './components/MyListView';
import { GroupsView } from './components/GroupsView';
import { SearchView } from './components/SearchView';
import { MovieDetailsView } from './components/MovieDetailsView';
import { VideoPlayerView } from './components/VideoPlayerView';
import { SettingsView } from './components/SettingsView';
import { WatchPartyView } from './components/WatchPartyView';
import { TriviaQuizView } from './components/TriviaQuizView';
import { KidsModeView } from './components/KidsModeView';
import { VideoIngestionStudioModal } from './components/VideoIngestionStudioModal';
import { NetflixArchitectureModal } from './components/NetflixArchitectureModal';
import { MoreSidebar } from './components/MoreSidebar';
import { ProfileView } from './components/ProfileView';
import { TVRemoteModal } from './components/TVRemoteModal';
import {
  PremiumModal,
  EvolutionStoreModal,
  ShareModal,
  AIChatSupportModal,
  NotificationDrawer,
  GlobalToast,
  AccountSwitcherModal
} from './components/Modals';

const AppContent: React.FC = () => {
  const { activeScreen, theme, startupStage, setStartupStage, isTVRemoteOpen, setIsTVRemoteOpen, isNetflixArchOpen, setIsNetflixArchOpen, showToast } = useApp();

  useEffect(() => {
    securityShield.init();

    // AudioContext cleanup safeguard
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      try {
        const audioCtx = new AudioCtx();
        return () => {
          if (audioCtx && audioCtx.state !== 'closed') {
            audioCtx.close().catch(() => {});
          }
        };
      } catch {}
    }
  }, []);

  // 1. Cinematic Startup Intro Splash
  if (startupStage === 'intro') {
    return <CinematicIntro onComplete={() => setStartupStage('welcome')} />;
  }

  // 2. Fluid Welcome Onboarding Slides
  if (startupStage === 'welcome') {
    return (
      <WelcomeSlides
        onFinish={() => setStartupStage('auth')}
        onSkipToAuth={() => setStartupStage('auth')}
      />
    );
  }

  // 3. Luxury VIP Authentication & Signup Screen
  if (startupStage === 'auth') {
    return <AuthView onSuccess={() => setStartupStage('main')} />;
  }

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeView />;
      case 'reels':
        return <ReelsView />;
      case 'live':
        return <LiveChannelsView />;
      case 'favorites':
        return <MyListView />;
      case 'groups':
        return <GroupsView />;
      case 'search':
        return <SearchView />;
      case 'details':
        return <MovieDetailsView />;
      case 'player':
        return <VideoPlayerView />;
      case 'watchparty':
        return <WatchPartyView />;
      case 'trivia':
        return <TriviaQuizView />;
      case 'kids':
        return <KidsModeView />;
      case 'account':
        return <ProfileView />;
      case 'settings':
      case 'subscription':
      case 'quality':
      case 'notifications':
      case 'privacy':
      case 'help':
      case 'about':
      case 'downloads':
      case 'subtitles':
      case 'audio':
      case 'security':
      case 'parent':
      case 'personal':
      case 'share':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  const isFullBleedScreen = activeScreen === 'reels';

  const themeClasses =
    theme === 'light'
      ? 'bg-[#f8fafc] text-[#0f172a] theme-light'
      : theme === 'cinema'
      ? 'bg-[#000000] text-[#f8fafc] theme-cinema'
      : 'bg-[#020617] text-[#f8fafc] theme-dark';

  return (
    <div
      className={`min-h-screen ${themeClasses} relative overflow-x-hidden flex flex-col font-sans selection:bg-[#e50914] selection:text-white transition-colors duration-300`}
    >
      {/* Frosted Glass Radial Background Highlights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {theme === 'light' ? (
          <>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-200/40 rounded-full blur-[120px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[140px] -ml-40 -mb-40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-[160px]" />
          </>
        ) : theme === 'cinema' ? (
          <>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-950/20 rounded-full blur-[120px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-950/20 rounded-full blur-[140px] -ml-40 -mb-40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-900/30 rounded-full blur-[160px]" />
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-950/30 rounded-full blur-[120px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-950/30 rounded-full blur-[140px] -ml-40 -mb-40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-950/10 rounded-full blur-[160px]" />
          </>
        )}
      </div>

      {/* Main Glass Header */}
      {activeScreen !== 'reels' && activeScreen !== 'player' && <Header />}

      {/* Main View Area */}
      <main
        className={`flex-1 relative z-10 transition-all duration-300 w-full ${
          isFullBleedScreen
            ? 'p-0'
            : 'max-w-full lg:max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-6 pb-28 sm:pb-32'
        }`}
      >
        {renderActiveScreen()}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav />

      {/* Global Modals & Notifications */}
      <PremiumModal />
      <EvolutionStoreModal />
      <ShareModal />
      <AIChatSupportModal />
      <NotificationDrawer />
      <AccountSwitcherModal />
      <VideoIngestionStudioModal />
      <NetflixArchitectureModal isOpen={isNetflixArchOpen} onClose={() => setIsNetflixArchOpen(false)} showToast={showToast} />
      <TVRemoteModal isOpen={isTVRemoteOpen} onClose={() => setIsTVRemoteOpen(false)} />
      <MoreSidebar />
      <GlobalToast />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
