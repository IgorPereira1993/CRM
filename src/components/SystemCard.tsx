import React, { useState } from 'react';
import { MoreVertical, GitBranch, Edit2, Trash2, FolderOpen } from 'lucide-react';
import type { DelphiSystem } from '../types';
import { COLOR_MAP, VERSION_STATUS_MAP } from '../utils/constants';
import { useStore } from '../store/useStore';
import { SystemIconComponent } from './ui/SystemIcon';

interface SystemCardProps {
  system: DelphiSystem;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SystemCard: React.FC<SystemCardProps> = ({ system, onClick, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { versions, notes } = useStore();
  const colors = COLOR_MAP[system.color];
  const sysVersions = versions.filter(v => v.systemId === system.id);
  const latestVersion = sysVersions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  const sysNotes = notes.filter(n => n.systemId === system.id && n.pinned);

  return (
    <div
      className={`group relative bg-[#0d1117] border ${colors.border} rounded-xl p-5 cursor-pointer hover:bg-[#111827] transition-all duration-200 hover:shadow-lg hover:${colors.glow} hover:scale-[1.01]`}
      onClick={onClick}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-4 right-4 h-px ${colors.text.replace('text-', 'bg-')}/30 rounded-full`} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${colors.bg} border ${colors.border} shadow-sm`}>
            <SystemIconComponent icon={system.icon} size={20} className={colors.text} />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight">{system.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{system.language}</p>
          </div>
        </div>
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-40 bg-[#141824] border border-[#1e2d4d] rounded-xl shadow-xl py-1">
                <button
                  onClick={() => { setMenuOpen(false); onEdit(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Edit2 size={13} /> Editar
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDelete(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={13} /> Excluir
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{system.description}</p>

      {/* Meta */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <FolderOpen size={12} />
          <span className="truncate font-mono">{system.defaultPath}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="w-3 h-3 rounded-full bg-[#1e2d4d] flex items-center justify-center text-[10px]">🗄️</span>
          <span>{system.database}</span>
        </div>
      </div>

      {/* Pinned notes indicator */}
      {sysNotes.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3 text-xs text-yellow-400/70">
          <span>📌</span>
          <span>{sysNotes.length} nota{sysNotes.length > 1 ? 's' : ''} fixada{sysNotes.length > 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#1e2d4d]">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <GitBranch size={12} />
          <span>{sysVersions.length} versões</span>
        </div>
        {latestVersion ? (
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-md border ${VERSION_STATUS_MAP[latestVersion.status].color}`}>
              {VERSION_STATUS_MAP[latestVersion.status].label}
            </span>
            <span className={`text-xs font-mono font-bold ${colors.text}`}>v{latestVersion.version}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-600">Sem versões</span>
        )}
      </div>
    </div>
  );
};
