import React, { useState } from 'react';
import { Plus, Search, Check, Database, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { DB_TYPE_MAP } from '../../utils/constants';
import { formatDateTime } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { CodeBlock } from '../ui/CodeBlock';
import type { DBChange } from '../../types';

interface DatabaseTabProps {
  versionId: string;
}

const emptyForm = (versionId: string): Omit<DBChange, 'id' | 'createdAt'> => ({
  versionId,
  type: 'table',
  tableName: '',
  name: '',
  description: '',
  sql: '',
  executed: false,
});

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ versionId }) => {
  const { dbChanges, addDBChange, updateDBChange, deleteDBChange, markDBChangeExecuted, currentUser } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<DBChange, 'id' | 'createdAt'>>(emptyForm(versionId));
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const changes = dbChanges.filter(d => d.versionId === versionId);
  const filtered = changes.filter(d => {
    const matchSearch = search === '' ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.sql.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || d.type === filterType;
    return matchSearch && matchType;
  });

  const pendingCount = changes.filter(d => !d.executed).length;
  const doneCount = changes.filter(d => d.executed).length;

  const openForm = (change?: DBChange) => {
    if (change) {
      setEditingId(change.id);
      setForm({ ...change });
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
      updateDBChange(editingId, form);
    } else {
      addDBChange(form);
    }
    setShowForm(false);
  };

  const set = (field: string, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0d1117] border border-[#1e2d4d] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-white">{changes.length}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-[#0d1117] border border-green-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{doneCount}</p>
          <p className="text-xs text-gray-500">Executados</p>
        </div>
        <div className="bg-[#0d1117] border border-orange-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-orange-400">{pendingCount}</p>
          <p className="text-xs text-gray-500">Pendentes</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Pesquisar alterações, scripts SQL..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#1e2d4d] rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="bg-[#0d1117] border border-[#1e2d4d] rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none"
        >
          <option value="all">Todos os tipos</option>
          {Object.entries(DB_TYPE_MAP).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <Button variant="primary" size="md" onClick={() => openForm()}>
          <Plus size={15} />
          Adicionar
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map(change => {
          const typeInfo = DB_TYPE_MAP[change.type];
          const isExpanded = expandedId === change.id;
          return (
            <div key={change.id} className="bg-[#0d1117] border border-[#1e2d4d] rounded-xl overflow-hidden">
              <div
                className="flex items-center gap-3 p-3.5 cursor-pointer hover:bg-white/3 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : change.id)}
              >
                {/* Status indicator */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${change.executed ? 'bg-green-500' : 'bg-orange-500'}`} />

                {/* Type badge */}
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium shrink-0 ${typeInfo.color}`}>
                  {typeInfo.icon} {typeInfo.label}
                </span>

                {/* Name */}
                <span className="font-mono text-sm font-medium text-gray-200 flex-1 truncate">
                  {change.tableName && <span className="text-gray-400">{change.tableName}</span>}
                  {change.tableName && change.name && <span className="text-gray-500 mx-1">→</span>}
                  {change.name}
                </span>

                {/* Executed */}
                {change.executed ? (
                  <span className="text-xs text-green-400 flex items-center gap-1 shrink-0">
                    <Check size={12} /> Executado
                  </span>
                ) : (
                  <span className="text-xs text-orange-400 shrink-0">Pendente</span>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                  {!change.executed && (
                    <Button variant="success" size="sm" onClick={() => markDBChangeExecuted(change.id, currentUser)} title="Marcar como executado">
                      <Check size={12} />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => openForm(change)}>
                    <Edit2 size={12} />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deleteDBChange(change.id)}>
                    <Trash2 size={12} />
                  </Button>
                </div>
                {isExpanded ? <ChevronUp size={14} className="text-gray-600 shrink-0" /> : <ChevronDown size={14} className="text-gray-600 shrink-0" />}
              </div>

              {isExpanded && (
                <div className="border-t border-[#1e2d4d] p-4 space-y-3 bg-[#080c14]">
                  {change.tableName && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Nome da Tabela</p>
                      <p className="font-mono text-sm text-gray-300">{change.tableName}</p>
                    </div>
                  )}
                  {change.description && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Descrição</p>
                      <p className="text-sm text-gray-400">{change.description}</p>
                    </div>
                  )}
                  {change.executed && change.executedAt && (
                    <div className="flex items-center gap-2 text-xs text-green-400/70">
                      <Check size={12} />
                      Executado por {change.executedBy} em {formatDateTime(change.executedAt)}
                    </div>
                  )}
                  {change.sql && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Script SQL</p>
                      <CodeBlock code={change.sql} language="sql" />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Database size={36} className="text-gray-700 mb-3" />
            <p className="text-sm text-gray-500">
              {search || filterType !== 'all' ? 'Nenhuma alteração encontrada' : 'Nenhuma alteração no banco cadastrada'}
            </p>
            {!search && filterType === 'all' && (
              <Button variant="primary" size="sm" className="mt-4" onClick={() => openForm()}>
                <Plus size={14} />
                Adicionar Alteração
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Editar Alteração' : 'Nova Alteração no Banco'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Tipo" value={form.type} onChange={e => set('type', e.target.value)}>
              {Object.entries(DB_TYPE_MAP).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.label}</option>
              ))}
            </Select>
            {form.type === 'field' && (
              <Input label="Nome da Tabela *" value={form.tableName || ''} onChange={e => set('tableName', e.target.value)} placeholder="Ex: TABELA_CLIENTE" required />
            )}
            <Input label={form.type === 'field' ? 'Nome do Campo *' : 'Nome *'} value={form.name} onChange={e => set('name', e.target.value)} placeholder={form.type === 'field' ? 'Ex: id_cliente' : 'Ex: TABELA_CLIENTE'} required />
            <div className="col-span-2">
              <Input label="Descrição" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Descreva o que faz esta alteração..." />
            </div>
            <div className="col-span-2">
              <Textarea label="Script SQL" value={form.sql} onChange={e => set('sql', e.target.value)} rows={10} placeholder="Cole o script SQL aqui..." className="font-mono text-xs" />
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
