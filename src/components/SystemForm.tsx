import React, { useState } from 'react';
import type { DelphiSystem, SystemColor, SystemIcon } from '../types';
import { SYSTEM_COLORS, SYSTEM_ICONS, COLOR_DOT } from '../utils/constants';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input, Textarea, Select } from './ui/Input';
import { SystemIconComponent } from './ui/SystemIcon';
import { cn } from '../utils/cn';

interface SystemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<DelphiSystem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: DelphiSystem;
}

const defaultData = {
  name: '',
  description: '',
  color: 'blue' as SystemColor,
  icon: 'monitor' as SystemIcon,
  language: 'Delphi 10.4',
  database: 'Firebird 3.0',
  defaultPath: 'C:\\Sistemas\\',
};

export const SystemForm: React.FC<SystemFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(initialData ?? defaultData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    if (!initialData) setForm(defaultData);
    onClose();
  };

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Sistema' : 'Novo Sistema'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input label="Nome do Sistema *" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Sistema Financeiro" required />
          </div>
          <div className="col-span-2">
            <Textarea label="Descrição" value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Descrição do sistema..." />
          </div>
          <Select label="Linguagem" value={form.language} onChange={e => set('language', e.target.value)}>
            <option>Delphi 7</option>
            <option>Delphi 2010</option>
            <option>Delphi XE2</option>
            <option>Delphi 10.2</option>
            <option>Delphi 10.3</option>
            <option>Delphi 10.4</option>
            <option>Delphi 11</option>
            <option>Delphi 12</option>
          </Select>
          <Select label="Banco de Dados" value={form.database} onChange={e => set('database', e.target.value)}>
            <option>Firebird 2.5</option>
            <option>Firebird 3.0</option>
            <option>PostgreSQL 14</option>
            <option>PostgreSQL 15</option>
            <option>SQL Server 2016</option>
            <option>SQL Server 2019</option>
            <option>MySQL 8.0</option>
            <option>SQLite</option>
          </Select>
          <div className="col-span-2">
            <Input label="Pasta Padrão" value={form.defaultPath} onChange={e => set('defaultPath', e.target.value)} placeholder="C:\Sistemas\NomeSistema" />
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Cor do Sistema</label>
          <div className="flex flex-wrap gap-2">
            {SYSTEM_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => set('color', color)}
                className={cn(
                  'w-7 h-7 rounded-full transition-all duration-150',
                  COLOR_DOT[color],
                  form.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#141824] scale-110' : 'opacity-60 hover:opacity-100'
                )}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Ícone</label>
          <div className="flex flex-wrap gap-2">
            {SYSTEM_ICONS.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => set('icon', icon)}
                className={cn(
                  'p-2.5 rounded-lg border transition-all duration-150',
                  form.icon === icon
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                    : 'bg-[#0d1117] border-[#1e2d4d] text-gray-500 hover:text-gray-300 hover:border-[#2d3f5e]'
                )}
              >
                <SystemIconComponent icon={icon as SystemIcon} size={18} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Salvar Alterações' : 'Criar Sistema'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
