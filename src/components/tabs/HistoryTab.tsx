import React from 'react';
import { Clock, GitBranch, Database, CheckSquare, Package, Edit2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
// history helpers imported as needed

interface HistoryTabProps {
  systemId: string;
}

const getActionIcon = (action: string) => {
  if (action.includes('Versão')) return GitBranch;
  if (action.includes('banco') || action.includes('Script') || action.includes('executado')) return Database;
  if (action.includes('Tarefa')) return CheckSquare;
  if (action.includes('Sistema')) return Package;
  return Edit2;
};

const getActionColor = (action: string) => {
  if (action.includes('publicada') || action.includes('executado')) return 'text-green-400 bg-green-500/10 border-green-500/20';
  if (action.includes('criada') || action.includes('criado')) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  if (action.includes('atualizada') || action.includes('atualizado')) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
  if (action.includes('excluída') || action.includes('excluído')) return 'text-red-400 bg-red-500/10 border-red-500/20';
  return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
};

export const HistoryTab: React.FC<HistoryTabProps> = ({ systemId }) => {
  const { history, versions } = useStore();
  const sysHistory = history
    .filter(h => h.systemId === systemId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group by date
  const grouped = sysHistory.reduce((acc, entry) => {
    const date = new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof sysHistory>);

  if (sysHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Clock size={36} className="text-gray-700 mb-3" />
        <p className="text-sm text-gray-500">Nenhum histórico registrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, entries]) => (
        <div key={date}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{date}</span>
            <div className="flex-1 h-px bg-[#1e2d4d]" />
          </div>
          <div className="space-y-2">
            {entries.map((entry, idx) => {
              const Icon = getActionIcon(entry.action);
              const colorClass = getActionColor(entry.action);
              const ver = entry.versionId ? versions.find(v => v.id === entry.versionId) : null;
              return (
                <div key={entry.id} className="flex gap-3 group">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className={`p-1.5 rounded-lg border ${colorClass} shrink-0`}>
                      <Icon size={13} />
                    </div>
                    {idx < entries.length - 1 && (
                      <div className="w-px flex-1 bg-[#1e2d4d] mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pb-4 flex-1 min-w-0 ${idx < entries.length - 1 ? '' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-200">{entry.action}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{entry.description}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-gray-600">por {entry.author}</span>
                          {ver && (
                            <>
                              <span className="text-gray-700">•</span>
                              <span className="text-xs text-gray-600 font-mono">v{ver.version}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 shrink-0 mt-0.5">
                        {new Date(entry.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
