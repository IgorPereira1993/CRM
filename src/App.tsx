import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Dashboard } from './components/Dashboard';
import { SystemsList } from './components/SystemsList';
import { VersionList } from './components/VersionList';
import { VersionDetails } from './components/VersionDetails';

export default function App() {
  const { currentView, activeSystemId, loadFromSupabase } = useStore();

  useEffect(() => {
    console.log('App mounted. currentView:', currentView);
    loadFromSupabase();
  }, [currentView, loadFromSupabase]);

  return (
    <div className="min-h-screen bg-slate-950">
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'systems' && <SystemsList />}
      {currentView === 'system' && activeSystemId && <VersionList />}
      {currentView === 'version' && <VersionDetails />}
    </div>
  );
}
