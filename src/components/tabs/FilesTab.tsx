import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, ExternalLink, Package } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { FILE_TYPE_MAP } from '../../utils/constants';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';
import type { SystemFile, FileType } from '../../types';

interface FilesTabProps {
  versionId: string;
}

const emptyForm = (versionId: string): Omit<SystemFile, 'id' | 'createdAt'> => ({
  versionId,
  type: 'dll',
  name: '',
  version: '',
  destinationPath: '',
  required: true,
  downloadLink: '',
  notes: '',
});

export const FilesTab: React.FC<FilesTabProps> = ({ versionId }) => {
  const { files, addFile, updateFile, deleteFile } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<SystemFile, 'id' | 'createdAt'>>(emptyForm(versionId));
  const [search, setSearch] = useState('');

  const vFiles = files.filter(f => f.versionId === versionId);
  const filtered = vFiles.filter(f =>
    search === '' ||
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.destinationPath.toLowerCase().includes(search.toLowerCase())
  );

  const required = vFiles.filter(f => f.required).length;
  const optional = vFiles.filter(f => !f.required).length;

  const openForm = (file?: SystemFile) => {
    if (file) {
      setEditingId(file.id);
      setForm({ ...file });
    } else {
      setEditingId(null);
      setForm(emptyForm(versionId));
    }
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      updateFile(editingId, form);
    } else {
      addFile(form);
    }
    setShowForm(false);
  };

  const set = (field: string, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }));

  const groupedByType = Object.keys(FILE_TYPE_MAP).reduce((acc, type) => {
    acc[type] = filtered.filter(f => f.type === type);
    return acc;
  }, {} as Record<string, SystemFile[]>);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0d1117] border border-[#1e2d4d] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-white">{vFiles.length}</p>
          <p className="text-xs text-gray-500">Total de Arquivos</p>
        </div>
        <div className="bg-[#0d1117] border border-red-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{required}</p>
          <p className="text-xs text-gray-500">Obrigatórios</p>
        </div>
        <div className="bg-[#0d1117] border border-gray-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-400">{optional}</p>
          <p className="text-xs text-gray-500">Opcionais</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Pesquisar arquivos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#1e2d4d] rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <Button variant="primary" size="md" onClick={() => openForm()}>
          <Plus size={15} />
          Adicionar
        </Button>
      </div>

      {/* Grouped List */}
      {Object.entries(groupedByType).map(([type, typeFiles]) => {
        if (typeFiles.length === 0) return null;
        const typeInfo = FILE_TYPE_MAP[type as FileType];
        return (
          <div key={type} className="bg-[#0d1117] border border-[#1e2d4d] rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1e2d4d] bg-[#080c14]">
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${typeInfo.color}`}>
                {typeInfo.icon} {typeInfo.label}
              </span>
              <span className="text-xs text-gray-600">{typeFiles.length} arquivo(s)</span>
            </div>
            <div className="divide-y divide-[#1e2d4d]">
              {typeFiles.map(file => (
                <div key={file.id} className="flex items-center gap-3 p-3.5 hover:bg-white/3 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-gray-200">{file.name}</span>
                      {file.version && (
                        <span className="text-xs text-gray-600 font-mono">v{file.version}</span>
                      )}
                      {file.required ? (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/20">Obrigatório</span>
                      ) : (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-500/15 text-gray-500 border border-gray-500/20">Opcional</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-600 font-mono truncate">→ {file.destinationPath}</span>
                    </div>
                    {file.notes && (
                      <p className="text-xs text-gray-600 mt-0.5">{file.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {file.downloadLink && (
                      <a href={file.downloadLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <ExternalLink size={12} />
                        </Button>
                      </a>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => openForm(file)}>
                      <Edit2 size={12} />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => deleteFile(file.id)}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package size={36} className="text-gray-700 mb-3" />
          <p className="text-sm text-gray-500">
            {search ? 'Nenhum arquivo encontrado' : 'Nenhum arquivo/DLL cadastrado'}
          </p>
          {!search && (
            <Button variant="primary" size="sm" className="mt-4" onClick={() => openForm()}>
              <Plus size={14} />
              Adicionar Arquivo
            </Button>
          )}
        </div>
      )}

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Editar Arquivo' : 'Novo Arquivo / DLL'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Tipo" value={form.type} onChange={e => set('type', e.target.value)}>
              {Object.entries(FILE_TYPE_MAP).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.label}</option>
              ))}
            </Select>
            <Input label="Nome do Arquivo *" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: IBComponents.dll" required />
            <Input label="Versão" value={form.version} onChange={e => set('version', e.target.value)} placeholder="Ex: 4.5.2" />
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={form.required}
                  onChange={e => set('required', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-300">Obrigatório</span>
              </label>
            </div>
            <div className="col-span-2">
              <Input label="Pasta Destino" value={form.destinationPath} onChange={e => set('destinationPath', e.target.value)} placeholder="Ex: C:\Windows\System32" />
            </div>
            <div className="col-span-2">
              <Input label="Link para Download" value={form.downloadLink} onChange={e => set('downloadLink', e.target.value)} placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <Input label="Observações" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Observações sobre este arquivo..." />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">{editingId ? 'Salvar' : 'Adicionar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
