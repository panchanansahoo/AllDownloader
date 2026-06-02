import React, { useState, useEffect } from "react";
import Toast from "./components/Toast";
import Layout from "./components/Layout";
import HomeView from "./views/HomeView";
import AudioView from "./views/AudioView";
import DownloadsView from "./views/DownloadsView";
import LibraryView from "./views/LibraryView";
import StatsView from "./views/StatsView";
import SettingsView from "./views/SettingsView";
import ThumbnailView from "./views/ThumbnailView";
import TrimView from "./views/TrimView";
import BulkView from "./views/BulkView";
import StoryView from "./views/StoryView";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DownloadProvider } from "./contexts/DownloadContext";

function AppContent() {
  const [currentTab, setCurrentTab] = useState("home");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const renderView = () => {
    switch (currentTab) {
      case "home":
        return <HomeView setToast={setToast} />;
      case "audio":
        return <AudioView setToast={setToast} />;
      case "downloads":
        return <DownloadsView setToast={setToast} />;
      case "library":
        return <LibraryView setToast={setToast} />;
      case "stats":
        return <StatsView setToast={setToast} />;
      case "settings":
        return <SettingsView setToast={setToast} />;
      case "thumbnail":
        return <ThumbnailView setToast={setToast} />;
      case "trim":
        return <TrimView setToast={setToast} />;
      case "bulk":
        return <BulkView setToast={setToast} />;
      case "story":
        return <StoryView setToast={setToast} />;
      default:
        return <HomeView setToast={setToast} />;
    }
  };

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {renderView()}
      <Toast toast={toast} />
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DownloadProvider>
        <AppContent />
      </DownloadProvider>
    </ThemeProvider>
  );
}
