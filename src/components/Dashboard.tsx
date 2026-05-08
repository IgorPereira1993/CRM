import React from 'react';
import {
  LayoutDashboard, Package, GitBranch, CheckSquare, Clock, TrendingUp, AlertCircle, Zap
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { COLOR_MAP, VERSION_STATUS_MAP, TASK_PRIORITY_MAP } from '../utils/constants';
import { formatDate, timeAgo } from '../utils/helpers';
import { SystemIconComponent } from './ui/SystemIcon';

export const Dashboard: React.FC = () => {
  const { systems, versions, tasks, history, setActiveSystem, setActiveVersion, setCurrentView, setActiveTab } = useStore();

  const totalSystems = systems.length;
  const totalVersions = versions.length;
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  const publishedVersions = versions.filter(v => v.status === 'published').length;
  const recentVersions = [...versions].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);
  const recentHistory = history.slice(0, 8);
  const pendingTasksList = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').slice(0, 5);

  const systemActivity = systems.map(sys => ({
    ...sys,
    versionCount: versions.filter(v => v.systemId === sys.id).length,
    lastVersion: versions
      .filter(v => v.systemId === sys.id)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0],
  })).sort((a, b) => b.versionCount - a.versionCount).slice(0, 4);

  const statsCards = [
    { label: 'Sistemas', value: totalSystems, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Versões', value: totalVersions, icon: GitBranch, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Publicadas', value: publishedVersions, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { label: 'Tarefas Pendentes', value: pendingTasks, icon: CheckSquare, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <LayoutDashboard size={22} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-gray-500">Visão geral dos seus sistemas Delphi</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentView('systems')}
          className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30 transition-all text-sm font-medium"
        >
          Ver Todos os Sistemas
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div key={card.label} className={`rounded-xl border ${card.border} ${card.bg} p-4`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 font-medium">{card.label}</p>
              <div className={`p-1.5 rounded-lg ${card.bg}`}>
                <card.icon size={16} className={card.color} />
              </div>
            </div>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Versions */}
        <div className="lg:col-span-2 bg-[#0d1117] rounded-xl border border-[#1e2d4d] p-4">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch size={16} className="text-purple-400" />
            <h2 className="text-sm font-semibold text-white">Versões Recentes</h2>
          </div>
          <div className="space-y-2">
            {recentVersions.map((ver) => {
              const sys = systems.find(s => s.id === ver.systemId);
              const colors = sys ? COLOR_MAP[sys.color] : null;
              const statusInfo = VERSION_STATUS_MAP[ver.status];
              return (
                <button
                  key={ver.id}
                  onClick={() => {
                    setActiveSystem(ver.systemId);
                    setActiveVersion(ver.id);
                    setActiveTab('overview');
                    setCurrentView('version');
                  }}
                  className="w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-[#1e2d4d] transition-all text-left group"
                >
                  {sys && colors && (
                    <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border} shrink-0`}>
                      <SystemIconComponent icon={sys.icon} size={14} className={colors.text} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-sm font-medium text-gray-200 truncate">{sys?.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${colors?.badge} inline-block whitespace-nowrap`}>v{ver.version}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 sm:mt-0.5 truncate">{ver.observations || 'Sem observações'}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusInfo.color} whitespace-nowrap`}>{statusInfo.label}</span>
                    <span className="text-xs text-gray-600 whitespace-nowrap">{formatDate(ver.date)}</span>
                  </div>
                </button>
              );
            })}
            {recentVersions.length === 0 && (
              <p className="text-sm text-gray-600 text-center py-4">Nenhuma versão cadastrada</p>
            )}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-[#0d1117] rounded-xl border border-[#1e2d4d] p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-teal-400" />
            <h2 className="text-sm font-semibold text-white">Atividade Recente</h2>
          </div>
          <div className="space-y-3">
            {recentHistory.map((entry) => {
              const sys = systems.find(s => s.id === entry.systemId);
              return (
                <div key={entry.id} className="flex gap-3 group">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                    <div className="w-px flex-1 bg-[#1e2d4d] mt-1" />
                  </div>
                  <div className="pb-3 min-w-0">
                    <p className="text-xs font-medium text-gray-300 truncate">{entry.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{sys?.name} • {entry.author}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{timeAgo(entry.date)}</p>
                  </div>
                </div>
              );
            })}
            {recentHistory.length === 0 && (
              <p className="text-sm text-gray-600 text-center py-4">Sem atividade</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Systems with most updates */}
        <div className="bg-[#0d1117] rounded-xl border border-[#1e2d4d] p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-yellow-400" />
            <h2 className="text-sm font-semibold text-white">Sistemas Mais Ativos</h2>
          </div>
          <div className="space-y-3">
            {systemActivity.map((sys) => {
              const colors = COLOR_MAP[sys.color];
              const maxCount = systemActivity[0]?.versionCount ?? 1;
              const pct = maxCount > 0 ? (sys.versionCount / maxCount) * 100 : 0;
              return (
                <button
                  key={sys.id}
                  onClick={() => { setActiveSystem(sys.id); setCurrentView('system'); }}
                  className="w-full text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-lg ${colors.bg} border ${colors.border} shrink-0`}>
                        <SystemIconComponent icon={sys.icon} size={13} className={colors.text} />
                      </div>
                      <span className="text-sm text-gray-300 truncate">{sys.name}</span>
                    </div>
                    <span className={`text-xs font-bold ${colors.text} whitespace-nowrap`}>{sys.versionCount} versões</span>
                  </div>
                  <div className="overflow-hidden">
                    <div className="w-full bg-[#1e2d4d] rounded-full h-1.5 sm:ml-8">
                      <div
                        className={`h-1.5 rounded-full ${colors.text.replace('text-', 'bg-').replace('-400', '-500')}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-[#0d1117] rounded-xl border border-[#1e2d4d] p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-orange-400" />
            <h2 className="text-sm font-semibold text-white">Tarefas Pendentes</h2>
          </div>
          <div className="space-y-2">
            {pendingTasksList.map((task) => {
              const ver = versions.find(v => v.id === task.versionId);
              const sys = ver ? systems.find(s => s.id === ver.systemId) : null;
              const priority = TASK_PRIORITY_MAP[task.priority];
              return (
                <div key={task.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/3 border border-[#1e2d4d]">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium mt-0.5 ${priority.color}`}>
                    {priority.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{task.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{sys?.name} • v{ver?.version}</p>
                  </div>
                </div>
              );
            })}
            {pendingTasksList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckSquare size={24} className="text-green-500 mb-2" />
                <p className="text-sm text-gray-500">Nenhuma tarefa pendente! 🎉</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
