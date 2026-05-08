import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, CheckSquare, ArrowUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { TASK_PRIORITY_MAP, TASK_CATEGORY_MAP, TASK_STATUS_MAP } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { Modal } from '../ui/Modal';
import type { Task, TaskStatus } from '../../types';

interface TasksTabProps {
  versionId: string;
}

const emptyForm = (versionId: string): Omit<Task, 'id' | 'createdAt' | 'updatedAt'> => ({
  versionId,
  title: '',
  description: '',
  priority: 'medium',
  category: 'feature',
  status: 'pending',
  date: new Date().toISOString().split('T')[0],
});

export const TasksTab: React.FC<TasksTabProps> = ({ versionId }) => {
  const { tasks, addTask, updateTask, deleteTask } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>(emptyForm(versionId));
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const vTasks = tasks.filter(t => t.versionId === versionId);
  const filtered = vTasks.filter(t => {
    const matchSearch = search === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Sort: critical first, then high, then by status
  const sorted = [...filtered].sort((a, b) => {
    const pOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return pOrder[a.priority] - pOrder[b.priority];
  });

  const byStatus = {
    pending: vTasks.filter(t => t.status === 'pending').length,
    in_progress: vTasks.filter(t => t.status === 'in_progress').length,
    done: vTasks.filter(t => t.status === 'done').length,
    cancelled: vTasks.filter(t => t.status === 'cancelled').length,
  };

  const openForm = (task?: Task) => {
    if (task) {
      setEditingId(task.id);
      setForm({ ...task });
    } else {
      setEditingId(null);
      setForm(emptyForm(versionId));
    }
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editingId) {
      updateTask(editingId, form);
    } else {
      addTask(form);
    }
    setShowForm(false);
  };

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const cycleStatus = (task: Task) => {
    const order: TaskStatus[] = ['pending', 'in_progress', 'done', 'cancelled'];
    const idx = order.indexOf(task.status);
    updateTask(task.id, { status: order[(idx + 1) % order.length] });
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(byStatus).map(([status, count]) => {
          const info = TASK_STATUS_MAP[status as TaskStatus];
          return (
            <div key={status} className="bg-[#0d1117] border border-[#1e2d4d] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-xs text-gray-500">{info.label}</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Pesquisar tarefas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#1e2d4d] rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-[#0d1117] border border-[#1e2d4d] rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none"
        >
          <option value="all">Todos os status</option>
          {Object.entries(TASK_STATUS_MAP).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <Button variant="primary" size="md" onClick={() => openForm()}>
          <Plus size={15} />
          Adicionar
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {sorted.map(task => {
          const priority = TASK_PRIORITY_MAP[task.priority];
          const category = TASK_CATEGORY_MAP[task.category];
          const status = TASK_STATUS_MAP[task.status];
          return (
            <div
              key={task.id}
              className={`bg-[#0d1117] border border-[#1e2d4d] rounded-xl p-3.5 group transition-all hover:bg-[#111827] ${task.status === 'done' ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3">
                {/* Priority indicator */}
                <div className={`w-1 self-stretch rounded-full shrink-0 ${
                  task.priority === 'critical' ? 'bg-red-500' :
                  task.priority === 'high' ? 'bg-orange-500' :
                  task.priority === 'medium' ? 'bg-blue-500' : 'bg-gray-600'
                }`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-medium ${task.status === 'done' ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${priority.color}`}>
                      {priority.label}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${category.color}`}>
                      {category.label}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-xs text-gray-600">{formatDate(task.date)}</span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{task.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => cycleStatus(task)} title="Mudar status">
                    <ArrowUp size={12} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openForm(task)}>
                    <Edit2 size={12} />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deleteTask(task.id)}>
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckSquare size={36} className="text-gray-700 mb-3" />
            <p className="text-sm text-gray-500">
              {search || filterStatus !== 'all' ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa cadastrada'}
            </p>
            {!search && filterStatus === 'all' && (
              <Button variant="primary" size="sm" className="mt-4" onClick={() => openForm()}>
                <Plus size={14} />
                Adicionar Tarefa
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Editar Tarefa' : 'Nova Tarefa'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Título *" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Descrição breve da tarefa..." required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Prioridade" value={form.priority} onChange={e => set('priority', e.target.value)}>
              {Object.entries(TASK_PRIORITY_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </Select>
            <Select label="Categoria" value={form.category} onChange={e => set('category', e.target.value)}>
              {Object.entries(TASK_CATEGORY_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </Select>
            <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}>
              {Object.entries(TASK_STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </Select>
            <Input label="Data" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <Textarea label="Descrição detalhada" value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Detalhe o que foi feito ou precisa ser feito..." />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">{editingId ? 'Salvar' : 'Adicionar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
