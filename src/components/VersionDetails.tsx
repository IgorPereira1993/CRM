import React from 'react';
import { ArrowLeft, FileText, Database, Folder, Clock, CheckSquare, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';
import { COLOR_MAP } from '../utils/constants';
import { SystemIconComponent } from './ui/SystemIcon';
import { OverviewTab } from './tabs/OverviewTab';
import { DatabaseTab } from './tabs/DatabaseTab';
import { FilesTab } from './tabs/FilesTab';
import { HistoryTab } from './tabs/HistoryTab';
import { TasksTab } from './tabs/TasksTab';

export const VersionDetails: React.FC = () => {
  const { systems, versions, activeSystemId, activeVersionId, activeTab, setCurrentView, setActiveTab } = useStore();

  const system = activeSystemId ? systems.find(s => s.id === activeSystemId) : null;
  const version = activeVersionId ? versions.find(v => v.id === activeVersionId) : null;

  if (!system || !version) return null;

  const colors = COLOR_MAP[system.color];

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Eye, component: OverviewTab },
    { id: 'database', label: 'Banco de Dados', icon: Database, component: DatabaseTab },
    { id: 'files', label: 'Arquivos', icon: Folder, component: FilesTab },
    { id: 'history', label: 'Histórico', icon: Clock, component: HistoryTab },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare, component: TasksTab },
  ];

  const currentTabComponent = tabs.find(t => t.id === activeTab)?.component;
  const TabComponent = currentTabComponent || OverviewTab;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <button
          onClick={() => setCurrentView('systems')}
          className="flex items-center gap-1 hover:text-gray-300 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Sistemas
        </button>
        <span className="text-gray-700">/</span>
        <button
          onClick={() => setCurrentView('system')}
          className="hover:text-gray-300 transition-colors"
        >
          {system.name}
        </button>
        <span className="text-gray-700">/</span>
        <span className="text-gray-400">v{version.version}</span>
      </div>

      {/* Header */}
      <div className={`flex items-start justify-between p-6 rounded-xl ${colors.bg} border ${colors.border}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-[#0d1117]/50 border ${colors.border}`}>
            <SystemIconComponent icon={system.icon} size={26} className={colors.text} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {system.name} <span className={`text-lg ${colors.text}`}>v{version.version}</span>
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">{version.observations}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>{version.responsible}</span>
              <span className="text-gray-700">•</span>
              <span>{new Date(version.date).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-[#1e2d4d] overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? `border-blue-500 text-blue-400 bg-blue-500/5`
                  : `border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700`
              }`}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-[#0d1117] rounded-xl border border-[#1e2d4d] p-6">
        <TabComponent versionId={activeVersionId} />
      </div>
    </div>
  );
};
