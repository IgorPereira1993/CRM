import React, { useState } from 'react';
import type { Version, VersionStatus } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input, Textarea, Select } from './ui/Input';

interface VersionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Version, 'id' | 'createdAt' | 'updatedAt'>) => void;
  systemId: string;
  initialData?: Version;
}

const defaultData = (systemId: string): Omit<Version, 'id' | 'createdAt' | 'updatedAt'> => ({
  systemId,
  version: '',
  date: new Date().toISOString().split('T')[0],
  responsible: '',
  status: 'development',
  observations: '',
  updateSteps: '',
  checklist: [],
});

export const VersionForm: React.FC<VersionFormProps> = ({ isOpen, onClose, onSubmit, systemId, initialData }) => {
  const [form, setForm] = useState<Omit<Version, 'id' | 'createdAt' | 'updatedAt'>>(
    initialData ?? defaultData(systemId)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.version.trim()) return;
    onSubmit(form);
    if (!initialData) setForm(defaultData(systemId));
    onClose();
  };

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Versão' : 'Nova Versão'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Número da Versão *"
            value={form.version}
            onChange={e => set('version', e.target.value)}
            placeholder="Ex: 1.0.0"
            required
          />
          <Input
            label="Data"
            type="date"
            value={form.date}
            onChange={e => set('date', e.target.value)}
          />
          <Input
            label="Responsável"
            value={form.responsible}
            onChange={e => set('responsible', e.target.value)}
            placeholder="Nome do desenvolvedor"
          />
          <Select
            label="Status"
            value={form.status}
            onChange={e => set('status', e.target.value as VersionStatus)}
          >
            <option value="development">Desenvolvimento</option>
            <option value="testing">Homologação</option>
            <option value="published">Publicado</option>
            <option value="deprecated">Descontinuado</option>
          </Select>
          <div className="col-span-2">
            <Textarea
              label="Observações"
              value={form.observations}
              onChange={e => set('observations', e.target.value)}
              rows={2}
              placeholder="Descreva o que muda nesta versão..."
            />
          </div>
          <div className="col-span-2">
            <Textarea
              label="Passos para Atualização"
              value={form.updateSteps}
              onChange={e => set('updateSteps', e.target.value)}
              rows={4}
              placeholder="1. Fazer backup do banco&#10;2. Executar scripts SQL&#10;3. Copiar DLLs&#10;4. Substituir EXE&#10;5. Testar sistema"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Salvar Alterações' : 'Criar Versão'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
