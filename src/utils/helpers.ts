import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    try {
      return format(new Date(dateStr + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateStr;
    }
  }
};

export const formatDateTime = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return dateStr;
  }
};

export const timeAgo = (dateStr: string): string => {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: ptBR });
  } catch {
    return dateStr;
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const compareVersions = (a: string, b: string): number => {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na !== nb) return na - nb;
  }
  return 0;
};

export const generateUpdateReport = (
  systemName: string,
  version: string,
  date: string,
  responsible: string,
  updateSteps: string,
  checklist: { text: string; done: boolean }[],
  dbChanges: { type: string; name: string; description: string; sql: string }[],
  files: { type: string; name: string; version: string; destinationPath: string; required: boolean }[],
  tasks: { title: string; category: string; priority: string; description: string }[]
): string => {
  const lines: string[] = [
    `========================================`,
    `RELATÓRIO DE ATUALIZAÇÃO`,
    `========================================`,
    `Sistema:     ${systemName}`,
    `Versão:      ${version}`,
    `Data:        ${date}`,
    `Responsável: ${responsible}`,
    ``,
    `========================================`,
    `PASSOS PARA ATUALIZAÇÃO`,
    `========================================`,
    updateSteps || '(não informado)',
    ``,
    `========================================`,
    `CHECKLIST`,
    `========================================`,
    ...checklist.map(c => `[${c.done ? 'X' : ' '}] ${c.text}`),
    ``,
    `========================================`,
    `ALTERAÇÕES NO BANCO DE DADOS`,
    `========================================`,
    ...dbChanges.map(d => [
      `[${d.type.toUpperCase()}] ${d.name}`,
      `Descrição: ${d.description}`,
      `SQL:`,
      d.sql,
      `---`,
    ].join('\n')),
    ``,
    `========================================`,
    `ARQUIVOS / DLLs`,
    `========================================`,
    ...files.map(f => `[${f.type.toUpperCase()}] ${f.name} v${f.version} → ${f.destinationPath} ${f.required ? '(OBRIGATÓRIO)' : '(opcional)'}`),
    ``,
    `========================================`,
    `TAREFAS`,
    `========================================`,
    ...tasks.map(t => `[${t.category}][${t.priority}] ${t.title}\n  ${t.description}`),
    ``,
    `========================================`,
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    `========================================`,
  ];
  return lines.join('\n');
};
