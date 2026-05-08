import React, { useState } from 'react';
import { Plus, Search, Package, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SystemCard } from './SystemCard';
import { SystemForm } from './SystemForm';
import { Button } from './ui/Button';
import type { DelphiSystem } from '../types';

export const SystemsList: React.FC = () => {
  const { systems, addSystem, updateSystem, deleteSystem, setActiveSystem, setCurrentView } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingSystem, setEditingSystem] = useState<DelphiSystem | null>(null);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = systems.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase()) ||
    s.database.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteSystem(id);
    setConfirmDelete(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-300"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Package size={22} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Sistemas</h1>
            <p className="text-sm text-gray-500">{systems.length} sistema{systems.length !== 1 ? 's' : ''} cadastrado{systems.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          Novo Sistema
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Pesquisar sistemas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#0d1117] border border-[#1e2d4d] rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
        />
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(system => (
            <SystemCard
              key={system.id}
              system={system}
              onClick={() => { setActiveSystem(system.id); setCurrentView('system'); }}
              onEdit={() => { setEditingSystem(system); }}
              onDelete={() => setConfirmDelete(system.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package size={48} className="text-gray-700 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-1">
            {search ? 'Nenhum sistema encontrado' : 'Nenhum sistema cadastrado'}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {search ? 'Tente outros termos de pesquisa' : 'Comece criando seu primeiro sistema'}
          </p>
          {!search && (
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <Plus size={16} />
              Criar Sistema
            </Button>
          )}
        </div>
      )}

      {/* Create Form */}
      <SystemForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={(data) => addSystem(data)}
      />

      {/* Edit Form */}
      {editingSystem && (
        <SystemForm
          isOpen={true}
          onClose={() => setEditingSystem(null)}
          onSubmit={(data) => updateSystem(editingSystem.id, data)}
          initialData={editingSystem}
        />
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-[#141824] border border-[#1e2d4d] rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-semibold text-white mb-2">Excluir Sistema</h3>
            <p className="text-sm text-gray-400 mb-5">
              Tem certeza? Todas as versões, tarefas, arquivos e histórico serão excluídos permanentemente.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
              <Button variant="danger" onClick={() => handleDelete(confirmDelete)}>Excluir</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
