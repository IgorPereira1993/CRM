import React, { useState } from 'react';
import { Plus, GitBranch, ChevronRight, Edit2, Trash2, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { VERSION_STATUS_MAP, COLOR_MAP } from '../utils/constants';
import { formatDate, compareVersions } from '../utils/helpers';
import { Button } from './ui/Button';
import { VersionForm } from './VersionForm';
import { SystemIconComponent } from './ui/SystemIcon';
import type { Version } from '../types';

export const VersionList: React.FC = () => {
  const {
    systems, versions, tasks, notes,
    activeSystemId,
    setActiveVersion, setCurrentView, setActiveTab,
    addVersion, updateVersion, deleteVersion, publishVersion,
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);

  const system = systems.find(s => s.id === activeSystemId);
  if (!system) return null;

  const colors = COLOR_MAP[system.color];
  const sysVersions = versions
    .filter(v => v.systemId === activeSystemId)
    .sort((a, b) => compareVersions(b.version, a.version));

  const handleSelectVersion = (versionId: string) => {
    setActiveVersion(versionId);
    setActiveTab('overview');
    setCurrentView('version');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <button
        onClick={() => setCurrentView('systems')}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-5 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Voltar para Sistemas
      </button>

      {/* System Header */}
      <div className={`flex items-start justify-between mb-6 p-5 rounded-xl ${colors.bg} border ${colors.border}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-[#0d1117]/50 border ${colors.border}`}>
            <SystemIconComponent icon={system.icon} size={26} className={colors.text} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{system.name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{system.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-gray-500">{system.language}</span>
              <span className="text-gray-700">•</span>
              <span className="text-xs text-gray-500">{system.database}</span>
              <span className="text-gray-700">•</span>
              <span className="text-xs font-mono text-gray-500">{system.defaultPath}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <Plus size={14} />
            Nova Versão
          </Button>
        </div>
      </div>

      {/* Version List */}
      <div className="flex items-center gap-2 mb-4">
        <GitBranch size={16} className={colors.text} />
        <h2 className="text-sm font-semibold text-white">Versões</h2>
        <span className="ml-auto text-xs text-gray-600">{sysVersions.length} versão(ões)</span>
      </div>

      <div className="space-y-2">
        {sysVersions.map((ver) => {
          const verTasks = tasks.filter(t => t.versionId === ver.id);
          const doneTasks = verTasks.filter(t => t.status === 'done').length;
          const doneChecklist = ver.checklist.filter(c => c.done).length;
          const statusInfo = VERSION_STATUS_MAP[ver.status];

          return (
            <div
              key={ver.id}
              className="group flex items-center gap-4 p-4 bg-[#0d1117] rounded-xl border border-[#1e2d4d] hover:border-[#2d3f5e] hover:bg-[#111827] transition-all duration-200 cursor-pointer"
              onClick={() => handleSelectVersion(ver.id)}
            >
              {/* Version badge */}
              <div className="shrink-0">
                <div className={`px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${colors.text} ${colors.bg} border ${colors.border}`}>
                  v{ver.version}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:flex-wrap">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${statusInfo.color} whitespace-nowrap`}>
                    {statusInfo.label}
                  </span>
                  {ver.checklist.length > 0 && (
                    <span className="text-xs text-gray-600 flex items-center gap-1 whitespace-nowrap">
                      <CheckCircle size={11} />
                      {doneChecklist}/{ver.checklist.length} checklist
                    </span>
                  )}
                  {verTasks.length > 0 && (
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      {doneTasks}/{verTasks.length} tarefas
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 md:mt-1.5 truncate">{ver.observations || 'Sem observações'}</p>
              </div>

              {/* Meta */}
              <div className="shrink-0 text-right">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 justify-end">
                  <Clock size={11} />
                  {formatDate(ver.date)}
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{ver.responsible}</p>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                {ver.status !== 'published' && (
                  <Button variant="success" size="sm" onClick={() => publishVersion(ver.id)} title="Publicar">
                    <CheckCircle size={13} />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setEditingVersion(ver)} title="Editar">
                  <Edit2 size={13} />
                </Button>
                <Button variant="danger" size="sm" onClick={() => deleteVersion(ver.id)} title="Excluir">
                  <Trash2 size={13} />
                </Button>
              </div>

              <ChevronRight size={16} className="text-gray-600 shrink-0 group-hover:text-gray-400 transition-colors" />
            </div>
          );
        })}

        {sysVersions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <GitBranch size={40} className="text-gray-700 mb-3" />
            <h3 className="text-base font-medium text-gray-500 mb-1">Nenhuma versão cadastrada</h3>
            <p className="text-sm text-gray-600 mb-5">Crie a primeira versão deste sistema</p>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <Plus size={14} />
              Nova Versão
            </Button>
          </div>
        )}
      </div>

      <VersionForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={(data) => addVersion(data)}
        systemId={system.id}
      />

      {editingVersion && (
        <VersionForm
          isOpen={true}
          onClose={() => setEditingVersion(null)}
          onSubmit={(data) => updateVersion(editingVersion.id, data)}
          systemId={system.id}
          initialData={editingVersion}
        />
      )}
    </div>
  );
};
