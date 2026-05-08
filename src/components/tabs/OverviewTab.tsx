import React, { useState } from 'react';
import { CheckCircle, Circle, Plus, Trash2, Send, FileText, Download } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { VERSION_STATUS_MAP } from '../../utils/constants';
import { formatDate, generateUpdateReport } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface OverviewTabProps {
  versionId: string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ versionId }) => {
  const {
    versions, systems, dbChanges, files, tasks,
    addChecklistItem, toggleChecklistItem, deleteChecklistItem,
    publishVersion,
  } = useStore();
  const [newItem, setNewItem] = useState('');

  const ver = versions.find(v => v.id === versionId);
  if (!ver) return null;
  const sys = systems.find(s => s.id === ver.systemId);
  const statusInfo = VERSION_STATUS_MAP[ver.status];
  const doneCL = ver.checklist.filter(c => c.done).length;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    addChecklistItem(versionId, newItem.trim());
    setNewItem('');
  };

  const handleExport = () => {
    const vDBChanges = dbChanges.filter(d => d.versionId === versionId);
    const vFiles = files.filter(f => f.versionId === versionId);
    const vTasks = tasks.filter(t => t.versionId === versionId);
    const report = generateUpdateReport(
      sys?.name ?? '',
      ver.version,
      formatDate(ver.date),
      ver.responsible,
      ver.updateSteps,
      ver.checklist,
      vDBChanges.map(d => ({ type: d.type, name: d.name, description: d.description, sql: d.sql })),
      vFiles.map(f => ({ type: f.type, name: f.name, version: f.version, destinationPath: f.destinationPath, required: f.required })),
      vTasks.map(t => ({ title: t.title, category: t.category, priority: t.priority, description: t.description }))
    );
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_v${ver.version}_${sys?.name ?? 'sistema'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Version Info */}
      <div className="bg-[#0d1117] rounded-xl border border-[#1e2d4d] p-4">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <FileText size={15} className="text-blue-400" />
          Informações da Versão
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Versão</p>
              <p className="text-sm font-mono font-bold text-white">v{ver.version}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Status</p>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Data</p>
              <p className="text-sm text-gray-300">{formatDate(ver.date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Responsável</p>
              <p className="text-sm text-gray-300">{ver.responsible || '—'}</p>
            </div>
          </div>
          {ver.observations && (
            <div className="pt-3 border-t border-[#1e2d4d]">
              <p className="text-xs text-gray-600 mb-1">Observações</p>
              <p className="text-sm text-gray-400 leading-relaxed">{ver.observations}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-[#1e2d4d]">
          {ver.status !== 'published' && (
            <Button variant="success" size="sm" onClick={() => publishVersion(versionId)}>
              <Send size={13} />
              Publicar Versão
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download size={13} />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Update Steps */}
      <div className="bg-[#0d1117] rounded-xl border border-[#1e2d4d] p-4">
        <h3 className="text-sm font-semibold text-white mb-4">📋 Passos para Atualização</h3>
        {ver.updateSteps ? (
          <pre className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap font-sans">
            {ver.updateSteps}
          </pre>
        ) : (
          <p className="text-sm text-gray-600">Nenhum passo definido.</p>
        )}
      </div>

      {/* Checklist */}
      <div className="lg:col-span-2 bg-[#0d1117] rounded-xl border border-[#1e2d4d] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle size={15} className="text-green-400" />
            Checklist de Atualização
          </h3>
          {ver.checklist.length > 0 && (
            <span className="text-xs text-gray-500">
              {doneCL}/{ver.checklist.length} concluído{doneCL !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {ver.checklist.length > 0 && (
          <div className="w-full bg-[#1e2d4d] rounded-full h-1.5 mb-4">
            <div
              className="h-1.5 rounded-full bg-green-500 transition-all duration-300"
              style={{ width: `${(doneCL / ver.checklist.length) * 100}%` }}
            />
          </div>
        )}

        <div className="space-y-1.5 mb-4">
          {ver.checklist.map((item) => (
            <div key={item.id} className="flex items-center gap-3 group p-2 rounded-lg hover:bg-white/3 transition-colors">
              <button
                onClick={() => toggleChecklistItem(versionId, item.id)}
                className="shrink-0 text-gray-500 hover:text-green-400 transition-colors"
              >
                {item.done
                  ? <CheckCircle size={16} className="text-green-400" />
                  : <Circle size={16} />
                }
              </button>
              <span className={`text-sm flex-1 ${item.done ? 'line-through text-gray-600' : 'text-gray-300'}`}>
                {item.text}
              </span>
              <button
                onClick={() => deleteChecklistItem(versionId, item.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {ver.checklist.length === 0 && (
            <p className="text-sm text-gray-600 text-center py-3">Nenhum item no checklist</p>
          )}
        </div>

        <form onSubmit={handleAddItem} className="flex gap-2">
          <Input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            placeholder="Adicionar item ao checklist..."
            className="flex-1"
          />
          <Button type="submit" variant="secondary" size="md">
            <Plus size={15} />
          </Button>
        </form>
      </div>
    </div>
  );
};
