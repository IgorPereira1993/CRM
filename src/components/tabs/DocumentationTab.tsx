import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { FileText } from 'lucide-react';

interface DocumentationTabProps {
  versionId: string;
}

export const DocumentationTab: React.FC<DocumentationTabProps> = ({ versionId }) => {
  const { versions, updateVersion } = useStore();
  const version = versions.find((v) => v.id === versionId);
  const [documentation, setDocumentation] = useState(version?.documentation ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDocumentation(version?.documentation ?? '');
  }, [version?.documentation]);

  if (!version) return null;

  const handleSave = () => {
    updateVersion(versionId, { documentation });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText size={18} className="text-blue-400" />
        <h2 className="text-sm font-semibold text-white">Documentação da Versão</h2>
      </div>
      <p className="text-sm text-gray-400">Escreva aqui as informações, notas e detalhes técnicos desta versão.</p>
      <Textarea
        label="Documentação"
        value={documentation}
        onChange={(e) => setDocumentation(e.target.value)}
        rows={12}
        placeholder="Descreva a documentação desta versão..."
      />
      <div className="flex items-center justify-between gap-3">
        <Button variant="primary" onClick={handleSave}>
          Salvar Documentação
        </Button>
        {saved && <span className="text-sm text-green-400">Documentação salva!</span>}
      </div>
    </div>
  );
};
