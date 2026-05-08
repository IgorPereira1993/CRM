import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import type {
  DelphiSystem, Version, DBChange, SystemFile, Task, HistoryEntry, StickyNote,
} from '../types';

interface AppStore {
  // Data
  systems: DelphiSystem[];
  versions: Version[];
  dbChanges: DBChange[];
  files: SystemFile[];
  tasks: Task[];
  history: HistoryEntry[];
  notes: StickyNote[];
  
  loadFromSupabase: () => Promise<void>;

  // UI State
  activeSystemId: string | null;
  activeVersionId: string | null;
  activeTab: string;
  currentView: 'dashboard' | 'systems' | 'system' | 'version';
  searchQuery: string;
  currentUser: string;

  // Navigation
  setActiveSystem: (id: string | null) => void;
  setActiveVersion: (id: string | null) => void;
  setActiveTab: (tab: string) => void;
  setCurrentView: (view: 'dashboard' | 'systems' | 'system' | 'version') => void;
  setSearchQuery: (q: string) => void;
  setCurrentUser: (user: string) => void;

  // Systems CRUD
  addSystem: (data: Omit<DelphiSystem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateSystem: (id: string, data: Partial<DelphiSystem>) => void;
  deleteSystem: (id: string) => void;

  // Versions CRUD
  addVersion: (data: Omit<Version, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateVersion: (id: string, data: Partial<Version>) => void;
  deleteVersion: (id: string) => void;
  publishVersion: (id: string) => void;

  // Checklist
  addChecklistItem: (versionId: string, text: string) => void;
  toggleChecklistItem: (versionId: string, itemId: string) => void;
  deleteChecklistItem: (versionId: string, itemId: string) => void;

  // DB Changes CRUD
  addDBChange: (data: Omit<DBChange, 'id' | 'createdAt'>) => string;
  updateDBChange: (id: string, data: Partial<DBChange>) => void;
  deleteDBChange: (id: string) => void;
  markDBChangeExecuted: (id: string, executedBy: string) => void;

  // Files CRUD
  addFile: (data: Omit<SystemFile, 'id' | 'createdAt'>) => string;
  updateFile: (id: string, data: Partial<SystemFile>) => void;
  deleteFile: (id: string) => void;

  // Tasks CRUD
  addTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Notes CRUD
  addNote: (data: Omit<StickyNote, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNote: (id: string, data: Partial<StickyNote>) => void;
  deleteNote: (id: string) => void;

  // Selectors
  getSystemVersions: (systemId: string) => Version[];
  getVersionDBChanges: (versionId: string) => DBChange[];
  getVersionFiles: (versionId: string) => SystemFile[];
  getVersionTasks: (versionId: string) => Task[];
  getSystemHistory: (systemId: string) => HistoryEntry[];
  getSystemNotes: (systemId: string) => StickyNote[];
}

const now = () => new Date().toISOString();

const addHistory = (
  history: HistoryEntry[],
  entry: Omit<HistoryEntry, 'id' | 'date'>
): HistoryEntry[] => [
  {
    id: uuidv4(),
    date: now(),
    ...entry,
  },
  ...history,
];

const syncInsert = <T extends { id: string }>(table: string, row: T) => {
  supabase.from(table).insert(row).then(({ error }) => {
    if (error) console.error(`Supabase insert ${table} failed:`, error);
  });
};

const syncUpdate = <T>(table: string, id: string, data: Partial<T>) => {
  supabase.from(table).update(data).eq('id', id).then(({ error }) => {
    if (error) console.error(`Supabase update ${table} failed:`, error);
  });
};

const syncDelete = (table: string, id: string) => {
  supabase.from(table).delete().eq('id', id).then(({ error }) => {
    if (error) console.error(`Supabase delete ${table} failed:`, error);
  });
};

const syncDeleteWhere = (table: string, column: string, value: string | string[]) => {
  const query = supabase.from(table).delete();
  if (Array.isArray(value)) {
    query.in(column, value);
  } else {
    query.eq(column, value);
  }
  query.then(({ error }) => {
    if (error) console.error(`Supabase delete ${table} where ${column} failed:`, error);
  });
};

const loadFromSupabase = async (set: any) => {
  console.log('🔄 Tentando carregar dados do Supabase...');

  try {
    const [
      systemsRes,
      versionsRes,
      dbChangesRes,
      filesRes,
      tasksRes,
      historyRes,
      notesRes,
    ] = await Promise.all([
      supabase.from<DelphiSystem>('systems').select('*'),
      supabase.from<Version>('versions').select('*'),
      supabase.from<DBChange>('db_changes').select('*'),
      supabase.from<SystemFile>('files').select('*'),
      supabase.from<Task>('tasks').select('*'),
      supabase.from<HistoryEntry>('history').select('*'),
      supabase.from<StickyNote>('notes').select('*'),
    ]);

    const responses = [
      { name: 'systems', result: systemsRes },
      { name: 'versions', result: versionsRes },
      { name: 'db_changes', result: dbChangesRes },
      { name: 'files', result: filesRes },
      { name: 'tasks', result: tasksRes },
      { name: 'history', result: historyRes },
      { name: 'notes', result: notesRes },
    ];

    const errors = responses.filter((item) => item.result.error);
    const isTotalFailure = errors.length === responses.length;

    if (errors.length > 0) {
      console.warn('❌ Erro ao carregar do Supabase:', errors.map((item) => ({ table: item.name, error: item.result.error })));
      const partialData = {
        systems: systemsRes.data ?? [],
        versions: versionsRes.data ?? [],
        dbChanges: dbChangesRes.data ?? [],
        files: filesRes.data ?? [],
        tasks: tasksRes.data ?? [],
        history: historyRes.data ?? [],
        notes: notesRes.data ?? [],
      };
      console.log('ℹ️ Dados parciais do Supabase:', {
        systems: partialData.systems.length,
        versions: partialData.versions.length,
        dbChanges: partialData.dbChanges.length,
        files: partialData.files.length,
        tasks: partialData.tasks.length,
        history: partialData.history.length,
        notes: partialData.notes.length,
      });
      set(partialData);

      if (isTotalFailure) {
        console.log('🔄 Falha total de conexão. Carregando dados locais (fallback)...');
        set({
          systems: seedSystems,
          versions: seedVersions,
          dbChanges: seedDBChanges,
          files: seedFiles,
          tasks: seedTasks,
          history: seedHistory,
          notes: seedNotes,
        });
      }
      return;
    }

    console.log('✅ Dados carregados do Supabase com sucesso!');
    console.log('ℹ️ Quantidades carregadas:', {
      systems: systemsRes.data?.length ?? 0,
      versions: versionsRes.data?.length ?? 0,
      dbChanges: dbChangesRes.data?.length ?? 0,
      files: filesRes.data?.length ?? 0,
      tasks: tasksRes.data?.length ?? 0,
      history: historyRes.data?.length ?? 0,
      notes: notesRes.data?.length ?? 0,
    });
    set({
      systems: systemsRes.data ?? [],
      versions: versionsRes.data ?? [],
      dbChanges: dbChangesRes.data ?? [],
      files: filesRes.data ?? [],
      tasks: tasksRes.data ?? [],
      history: historyRes.data ?? [],
      notes: notesRes.data ?? [],
    });

  } catch (error) {
    console.error('❌ Erro de conexão com Supabase:', error);
    console.log('🔄 Carregando dados locais (fallback)...');
    set({
      systems: seedSystems,
      versions: seedVersions,
      dbChanges: seedDBChanges,
      files: seedFiles,
      tasks: seedTasks,
      history: seedHistory,
      notes: seedNotes,
    });
  }
};

// Seed data
const seedSystems: DelphiSystem[] = [
  {
    id: 'sys-1',
    name: 'Sistema Financeiro',
    description: 'Controle financeiro completo com contas a pagar/receber, fluxo de caixa e relatórios gerenciais.',
    color: 'blue',
    icon: 'bar-chart',
    language: 'Delphi 10.4',
    database: 'Firebird 3.0',
    defaultPath: 'C:\\Sistemas\\Financeiro',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-06-15T14:30:00Z',
  },
  {
    id: 'sys-2',
    name: 'PDV',
    description: 'Ponto de venda com emissão de NF-e, SAT, controle de caixa e integração com balança.',
    color: 'green',
    icon: 'shopping-cart',
    language: 'Delphi 11',
    database: 'Firebird 2.5',
    defaultPath: 'C:\\Sistemas\\PDV',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-06-20T11:00:00Z',
  },
  {
    id: 'sys-3',
    name: 'Delivery',
    description: 'Sistema de gestão de pedidos delivery com rastreamento de entregadores e integração com iFood.',
    color: 'orange',
    icon: 'truck',
    language: 'Delphi 11',
    database: 'PostgreSQL 14',
    defaultPath: 'C:\\Sistemas\\Delivery',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-06-25T16:00:00Z',
  },
  {
    id: 'sys-4',
    name: 'ERP',
    description: 'Sistema ERP completo com módulos de estoque, compras, vendas, RH e contabilidade.',
    color: 'purple',
    icon: 'layers',
    language: 'Delphi 10.4',
    database: 'SQL Server 2019',
    defaultPath: 'C:\\Sistemas\\ERP',
    createdAt: '2023-11-01T08:00:00Z',
    updatedAt: '2024-06-18T09:00:00Z',
  },
];

const seedVersions: Version[] = [
  {
    id: 'ver-1',
    systemId: 'sys-1',
    version: '1.0.0',
    date: '2024-01-10',
    responsible: 'Carlos Silva',
    status: 'published',
    observations: 'Versão inicial do sistema financeiro.',
    updateSteps: '1. Fazer backup do banco\n2. Executar scripts SQL\n3. Substituir EXE\n4. Testar abertura do sistema',
    checklist: [
      { id: 'c1', text: 'Backup do banco de dados', done: true },
      { id: 'c2', text: 'Scripts SQL executados', done: true },
      { id: 'c3', text: 'EXE substituído', done: true },
      { id: 'c4', text: 'Testes realizados', done: true },
    ],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'ver-2',
    systemId: 'sys-1',
    version: '1.0.1',
    date: '2024-02-05',
    responsible: 'Carlos Silva',
    status: 'published',
    observations: 'Correção de bugs no relatório de fluxo de caixa.',
    updateSteps: '1. Fazer backup\n2. Substituir EXE\n3. Verificar relatórios',
    checklist: [
      { id: 'c5', text: 'Backup realizado', done: true },
      { id: 'c6', text: 'EXE atualizado', done: true },
    ],
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z',
  },
  {
    id: 'ver-3',
    systemId: 'sys-1',
    version: '1.1.0',
    date: '2024-06-15',
    responsible: 'Carlos Silva',
    status: 'testing',
    observations: 'Adicionado módulo de centro de custos e novos relatórios.',
    updateSteps: '1. Backup\n2. Executar script de criação de tabelas\n3. Executar script de procedures\n4. Substituir EXE e DLLs\n5. Configurar parâmetros\n6. Testar',
    checklist: [
      { id: 'c7', text: 'Backup do banco', done: true },
      { id: 'c8', text: 'Script de tabelas executado', done: true },
      { id: 'c9', text: 'Script de procedures executado', done: false },
      { id: 'c10', text: 'EXE atualizado', done: false },
      { id: 'c11', text: 'DLLs atualizadas', done: false },
      { id: 'c12', text: 'Testes completos', done: false },
    ],
    createdAt: '2024-06-15T08:00:00Z',
    updatedAt: '2024-06-15T14:30:00Z',
  },
  {
    id: 'ver-4',
    systemId: 'sys-2',
    version: '2.0.0',
    date: '2024-06-20',
    responsible: 'Ana Rodrigues',
    status: 'published',
    observations: 'Integração com SAT Fiscal e novo layout de cupom.',
    updateSteps: '1. Backup\n2. Executar scripts\n3. Copiar DLLs do SAT\n4. Configurar SAT no sistema\n5. Testar emissão',
    checklist: [
      { id: 'c13', text: 'Backup realizado', done: true },
      { id: 'c14', text: 'Scripts executados', done: true },
      { id: 'c15', text: 'DLLs do SAT copiadas', done: true },
    ],
    createdAt: '2024-06-20T09:00:00Z',
    updatedAt: '2024-06-22T15:00:00Z',
  },
  {
    id: 'ver-5',
    systemId: 'sys-3',
    version: '1.2.0',
    date: '2024-06-25',
    responsible: 'João Mendes',
    status: 'development',
    observations: 'Rastreamento em tempo real e integração com WhatsApp.',
    updateSteps: '',
    checklist: [],
    createdAt: '2024-06-25T10:00:00Z',
    updatedAt: '2024-06-25T16:00:00Z',
  },
];

const seedDBChanges: DBChange[] = [
  {
    id: 'db-1',
    versionId: 'ver-3',
    type: 'table',
    name: 'CENTRO_CUSTO',
    description: 'Tabela de centros de custo para rateio de despesas',
    sql: `CREATE TABLE CENTRO_CUSTO (
  ID INTEGER NOT NULL,
  DESCRICAO VARCHAR(100) NOT NULL,
  CODIGO VARCHAR(20),
  ATIVO CHAR(1) DEFAULT 'S',
  DATA_CRIACAO DATE DEFAULT CURRENT_DATE,
  CONSTRAINT PK_CENTRO_CUSTO PRIMARY KEY (ID)
);

CREATE GENERATOR GEN_CENTRO_CUSTO;
SET GENERATOR GEN_CENTRO_CUSTO TO 0;`,
    executed: true,
    executedAt: '2024-06-15T09:00:00Z',
    executedBy: 'Carlos Silva',
    createdAt: '2024-06-15T08:00:00Z',
  },
  {
    id: 'db-2',
    versionId: 'ver-3',
    type: 'field',
    name: 'LANCAMENTOS.ID_CENTRO_CUSTO',
    description: 'Campo para vincular lançamentos ao centro de custo',
    sql: `ALTER TABLE LANCAMENTOS ADD ID_CENTRO_CUSTO INTEGER;
ALTER TABLE LANCAMENTOS ADD CONSTRAINT FK_LANC_CC
  FOREIGN KEY (ID_CENTRO_CUSTO) REFERENCES CENTRO_CUSTO(ID);`,
    executed: true,
    executedAt: '2024-06-15T09:15:00Z',
    executedBy: 'Carlos Silva',
    createdAt: '2024-06-15T08:10:00Z',
  },
  {
    id: 'db-3',
    versionId: 'ver-3',
    type: 'procedure',
    name: 'SP_RELATORIO_CENTRO_CUSTO',
    description: 'Procedure para relatório de gastos por centro de custo',
    sql: `CREATE OR ALTER PROCEDURE SP_RELATORIO_CENTRO_CUSTO (
  P_DATA_INI DATE,
  P_DATA_FIM DATE,
  P_ID_CC INTEGER = NULL
)
RETURNS (
  CENTRO_CUSTO VARCHAR(100),
  TOTAL_DESPESAS NUMERIC(15,2),
  TOTAL_RECEITAS NUMERIC(15,2)
)
AS
BEGIN
  FOR SELECT CC.DESCRICAO,
      SUM(CASE WHEN L.TIPO = 'D' THEN L.VALOR ELSE 0 END),
      SUM(CASE WHEN L.TIPO = 'R' THEN L.VALOR ELSE 0 END)
  FROM CENTRO_CUSTO CC
  LEFT JOIN LANCAMENTOS L ON L.ID_CENTRO_CUSTO = CC.ID
    AND L.DATA_LANC BETWEEN :P_DATA_INI AND :P_DATA_FIM
  WHERE (:P_ID_CC IS NULL OR CC.ID = :P_ID_CC)
  GROUP BY CC.DESCRICAO
  INTO :CENTRO_CUSTO, :TOTAL_DESPESAS, :TOTAL_RECEITAS
  DO SUSPEND;
END`,
    executed: false,
    createdAt: '2024-06-15T08:20:00Z',
  },
  {
    id: 'db-4',
    versionId: 'ver-4',
    type: 'table',
    name: 'CONFIG_SAT',
    description: 'Configurações do SAT Fiscal',
    sql: `CREATE TABLE CONFIG_SAT (
  ID INTEGER NOT NULL,
  CNPJ_SOFTWARE_HOUSE VARCHAR(18),
  CODIGO_ATIVACAO VARCHAR(50),
  ASSINATURA_AC VARCHAR(500),
  AMBIENTE INTEGER DEFAULT 2,
  CONSTRAINT PK_CONFIG_SAT PRIMARY KEY (ID)
);`,
    executed: true,
    executedAt: '2024-06-20T10:00:00Z',
    executedBy: 'Ana Rodrigues',
    createdAt: '2024-06-20T09:30:00Z',
  },
];

const seedFiles: SystemFile[] = [
  {
    id: 'f-1',
    versionId: 'ver-3',
    type: 'dll',
    name: 'IBComponents.dll',
    version: '4.5.2',
    destinationPath: 'C:\\Windows\\System32',
    required: true,
    downloadLink: '',
    notes: 'Componente Firebird atualizado',
    createdAt: '2024-06-15T08:00:00Z',
  },
  {
    id: 'f-2',
    versionId: 'ver-3',
    type: 'dll',
    name: 'FastReport6.dll',
    version: '6.8.1',
    destinationPath: 'C:\\Sistemas\\Financeiro',
    required: true,
    downloadLink: '',
    notes: 'Atualização do gerador de relatórios',
    createdAt: '2024-06-15T08:00:00Z',
  },
  {
    id: 'f-3',
    versionId: 'ver-3',
    type: 'exe',
    name: 'Financeiro.exe',
    version: '1.1.0',
    destinationPath: 'C:\\Sistemas\\Financeiro',
    required: true,
    downloadLink: '',
    notes: 'Executável principal',
    createdAt: '2024-06-15T08:00:00Z',
  },
  {
    id: 'f-4',
    versionId: 'ver-4',
    type: 'dll',
    name: 'SAT_CFe.dll',
    version: '1.0.0',
    destinationPath: 'C:\\Sistemas\\PDV',
    required: true,
    downloadLink: 'https://example.com/sat_cfe.dll',
    notes: 'DLL oficial do SAT Fiscal - Secretaria da Fazenda SP',
    createdAt: '2024-06-20T09:00:00Z',
  },
  {
    id: 'f-5',
    versionId: 'ver-4',
    type: 'ocx',
    name: 'MSCOMCTL.OCX',
    version: '6.0.0',
    destinationPath: 'C:\\Windows\\SysWOW64',
    required: false,
    downloadLink: '',
    notes: 'Necessário apenas em Windows 7',
    createdAt: '2024-06-20T09:00:00Z',
  },
];

const seedTasks: Task[] = [
  {
    id: 't-1',
    versionId: 'ver-3',
    title: 'Implementar tela de cadastro de Centro de Custo',
    description: 'Criar CRUD completo para centros de custo com hierarquia de grupos.',
    priority: 'high',
    category: 'feature',
    status: 'done',
    date: '2024-06-10',
    createdAt: '2024-06-10T08:00:00Z',
    updatedAt: '2024-06-14T17:00:00Z',
  },
  {
    id: 't-2',
    versionId: 'ver-3',
    title: 'Relatório de gastos por centro de custo',
    description: 'Novo relatório em FastReport com gráfico de barras mostrando despesas por CC.',
    priority: 'high',
    category: 'feature',
    status: 'in_progress',
    date: '2024-06-15',
    createdAt: '2024-06-15T08:00:00Z',
    updatedAt: '2024-06-15T14:00:00Z',
  },
  {
    id: 't-3',
    versionId: 'ver-3',
    title: 'Corrigir bug no fechamento de caixa',
    description: 'Erro na soma de cheques no relatório de fechamento quando há estorno.',
    priority: 'critical',
    category: 'bugfix',
    status: 'done',
    date: '2024-06-12',
    createdAt: '2024-06-12T10:00:00Z',
    updatedAt: '2024-06-13T09:00:00Z',
  },
  {
    id: 't-4',
    versionId: 'ver-4',
    title: 'Integração SAT Fiscal',
    description: 'Implementar envio de venda para o SAT seguindo layout da SEFAZ-SP.',
    priority: 'critical',
    category: 'feature',
    status: 'done',
    date: '2024-06-18',
    createdAt: '2024-06-18T08:00:00Z',
    updatedAt: '2024-06-20T15:00:00Z',
  },
  {
    id: 't-5',
    versionId: 'ver-4',
    title: 'Novo layout de cupom não fiscal',
    description: 'Layout modernizado com logo da empresa e QR Code de avaliação.',
    priority: 'medium',
    category: 'improvement',
    status: 'done',
    date: '2024-06-19',
    createdAt: '2024-06-19T08:00:00Z',
    updatedAt: '2024-06-20T11:00:00Z',
  },
];

const seedHistory: HistoryEntry[] = [
  {
    id: 'h-1',
    systemId: 'sys-1',
    versionId: 'ver-3',
    action: 'Versão criada',
    description: 'Versão 1.1.0 criada com módulo de centro de custos',
    author: 'Carlos Silva',
    date: '2024-06-15T08:00:00Z',
  },
  {
    id: 'h-2',
    systemId: 'sys-1',
    versionId: 'ver-3',
    action: 'Script executado',
    description: 'Tabela CENTRO_CUSTO criada com sucesso',
    author: 'Carlos Silva',
    date: '2024-06-15T09:00:00Z',
  },
  {
    id: 'h-3',
    systemId: 'sys-1',
    versionId: 'ver-2',
    action: 'Versão publicada',
    description: 'Versão 1.0.1 marcada como publicada',
    author: 'Carlos Silva',
    date: '2024-02-10T11:00:00Z',
  },
  {
    id: 'h-4',
    systemId: 'sys-2',
    versionId: 'ver-4',
    action: 'Versão publicada',
    description: 'Versão 2.0.0 com SAT publicada',
    author: 'Ana Rodrigues',
    date: '2024-06-22T15:00:00Z',
  },
];

const seedNotes: StickyNote[] = [
  {
    id: 'n-1',
    systemId: 'sys-1',
    title: '⚠️ Atenção',
    content: 'Banco do cliente XYZ ainda não foi migrado para o Firebird 3.0. Aguardando janela de manutenção.',
    color: 'yellow',
    pinned: true,
    createdAt: '2024-06-14T10:00:00Z',
    updatedAt: '2024-06-14T10:00:00Z',
  },
  {
    id: 'n-2',
    systemId: 'sys-1',
    title: 'Pendência',
    content: 'Solicitar para o cliente a lista de centros de custo antes de implantar a versão 1.1.0.',
    color: 'pink',
    pinned: false,
    createdAt: '2024-06-15T08:00:00Z',
    updatedAt: '2024-06-15T08:00:00Z',
  },
  {
    id: 'n-3',
    systemId: 'sys-2',
    title: 'SAT',
    content: 'Código de ativação do SAT: ATIVACAO-SAT-001. Guardar em local seguro!',
    color: 'blue',
    pinned: true,
    createdAt: '2024-06-20T10:00:00Z',
    updatedAt: '2024-06-20T10:00:00Z',
  },
];

export const useStore = create<AppStore>((set, get) => ({
  systems: [],
  versions: [],
  dbChanges: [],
  files: [],
  tasks: [],
  history: [],
  notes: [],

  activeSystemId: null,
  activeVersionId: null,
  activeTab: 'overview',
  currentView: 'dashboard',
  searchQuery: '',
  currentUser: 'Carlos Silva',

  setActiveSystem: (id) => set({ activeSystemId: id }),
  setActiveVersion: (id) => set({ activeVersionId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentView: (view) => set({ currentView: view }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setCurrentUser: (user) => set({ currentUser: user }),
  loadFromSupabase: async () => {
    await loadFromSupabase(set);
  },

  addSystem: (data) => {
    const id = uuidv4();
    const ts = now();
    const newSystem = { ...data, id, createdAt: ts, updatedAt: ts };
    set((s) => ({
      systems: [...s.systems, newSystem],
      history: addHistory(s.history, {
        systemId: id,
        action: 'Sistema criado',
        description: `Sistema "${data.name}" criado`,
        author: s.currentUser,
      }),
    }));
    syncInsert('systems', newSystem);
    return id;
  },
  updateSystem: (id, data) => {
    set((s) => ({
      systems: s.systems.map((sys) => sys.id === id ? { ...sys, ...data, updatedAt: now() } : sys),
      history: addHistory(s.history, {
        systemId: id,
        action: 'Sistema atualizado',
        description: `Sistema atualizado`,
        author: s.currentUser,
      }),
    }));
    syncUpdate<DelphiSystem>('systems', id, { ...data, updatedAt: now() });
  },
  deleteSystem: (id) => {
    const versionIds = get().versions.filter(v => v.systemId === id).map(v => v.id);
    set((s) => ({
      systems: s.systems.filter((sys) => sys.id !== id),
      versions: s.versions.filter((v) => v.systemId !== id),
      dbChanges: s.dbChanges.filter((d) => !versionIds.includes(d.versionId)),
      files: s.files.filter((f) => !versionIds.includes(f.versionId)),
      tasks: s.tasks.filter((t) => !versionIds.includes(t.versionId)),
      notes: s.notes.filter((n) => n.systemId !== id),
      history: s.history.filter((h) => h.systemId !== id),
    }));
    syncDelete('systems', id);
    syncDeleteWhere('versions', 'systemId', id);
    if (versionIds.length > 0) {
      syncDeleteWhere('db_changes', 'versionId', versionIds);
      syncDeleteWhere('files', 'versionId', versionIds);
      syncDeleteWhere('tasks', 'versionId', versionIds);
    }
    syncDeleteWhere('notes', 'systemId', id);
    syncDeleteWhere('history', 'systemId', id);
  },

  addVersion: (data) => {
    const id = uuidv4();
    const ts = now();
    const newVersion = { ...data, id, createdAt: ts, updatedAt: ts };
    set((s) => ({
      versions: [...s.versions, newVersion],
      history: addHistory(s.history, {
        systemId: data.systemId,
        versionId: id,
        action: 'Versão criada',
        description: `Versão ${data.version} criada`,
        author: s.currentUser,
      }),
    }));
    syncInsert('versions', newVersion);
    return id;
  },
  updateVersion: (id, data) => {
    set((s) => {
      const ver = s.versions.find(v => v.id === id);
      return {
        versions: s.versions.map((v) => v.id === id ? { ...v, ...data, updatedAt: now() } : v),
        history: ver ? addHistory(s.history, {
          systemId: ver.systemId,
          versionId: id,
          action: 'Versão atualizada',
          description: `Versão ${ver.version} atualizada`,
          author: s.currentUser,
        }) : s.history,
      };
    });
    syncUpdate<Version>('versions', id, { ...data, updatedAt: now() });
  },
  deleteVersion: (id) => {
    set((s) => ({
      versions: s.versions.filter((v) => v.id !== id),
      dbChanges: s.dbChanges.filter((d) => d.versionId !== id),
      files: s.files.filter((f) => f.versionId !== id),
      tasks: s.tasks.filter((t) => t.versionId !== id),
    }));
    syncDelete('versions', id);
    syncDeleteWhere('db_changes', 'versionId', id);
    syncDeleteWhere('files', 'versionId', id);
    syncDeleteWhere('tasks', 'versionId', id);
  },
  publishVersion: (id) => {
    set((s) => {
      const ver = s.versions.find(v => v.id === id);
      return {
        versions: s.versions.map((v) => v.id === id ? { ...v, status: 'published', updatedAt: now() } : v),
        history: ver ? addHistory(s.history, {
          systemId: ver.systemId,
          versionId: id,
          action: 'Versão publicada',
          description: `Versão ${ver.version} marcada como publicada`,
          author: s.currentUser,
        }) : s.history,
      };
    });
    syncUpdate<Version>('versions', id, { status: 'published', updatedAt: now() });
  },

  addChecklistItem: (versionId, text) => {
    const item = { id: uuidv4(), text, done: false };
    const current = get();
    const version = current.versions.find((v) => v.id === versionId);
    set((s) => ({
      versions: s.versions.map((v) =>
        v.id === versionId
          ? { ...v, checklist: [...v.checklist, item], updatedAt: now() }
          : v
      ),
    }));
    if (version) syncUpdate<Version>('versions', versionId, { checklist: [...version.checklist, item], updatedAt: now() });
  },
  toggleChecklistItem: (versionId, itemId) => {
    const current = get();
    const version = current.versions.find((v) => v.id === versionId);
    set((s) => ({
      versions: s.versions.map((v) =>
        v.id === versionId
          ? {
              ...v,
              checklist: v.checklist.map((c) => c.id === itemId ? { ...c, done: !c.done } : c),
              updatedAt: now(),
            }
          : v
      ),
    }));
    if (version) {
      const updatedChecklist = version.checklist.map((c) => c.id === itemId ? { ...c, done: !c.done } : c);
      syncUpdate<Version>('versions', versionId, { checklist: updatedChecklist, updatedAt: now() });
    }
  },
  deleteChecklistItem: (versionId, itemId) => {
    const current = get();
    const version = current.versions.find((v) => v.id === versionId);
    set((s) => ({
      versions: s.versions.map((v) =>
        v.id === versionId
          ? { ...v, checklist: v.checklist.filter((c) => c.id !== itemId), updatedAt: now() }
          : v
      ),
    }));
    if (version) {
      const updatedChecklist = version.checklist.filter((c) => c.id !== itemId);
      syncUpdate<Version>('versions', versionId, { checklist: updatedChecklist, updatedAt: now() });
    }
  },

  addDBChange: (data) => {
    const id = uuidv4();
    const ts = now();
    const newChange = { ...data, id, createdAt: ts };
    set((s) => {
      const ver = s.versions.find(v => v.id === data.versionId);
      return {
        dbChanges: [...s.dbChanges, newChange],
        history: ver ? addHistory(s.history, {
          systemId: ver.systemId,
          versionId: data.versionId,
          action: 'Alteração de banco adicionada',
          description: `${data.type.toUpperCase()} ${data.name} adicionado`,
          author: s.currentUser,
        }) : s.history,
      };
    });
    syncInsert('db_changes', newChange);
    return id;
  },
  updateDBChange: (id, data) => {
    set((s) => ({ dbChanges: s.dbChanges.map((d) => d.id === id ? { ...d, ...data } : d) }));
    syncUpdate<DBChange>('db_changes', id, data);
  },
  deleteDBChange: (id) => {
    set((s) => ({ dbChanges: s.dbChanges.filter((d) => d.id !== id) }));
    syncDelete('db_changes', id);
  },
  markDBChangeExecuted: (id, executedBy) => {
    set((s) => ({
      dbChanges: s.dbChanges.map((d) =>
        d.id === id ? { ...d, executed: true, executedAt: now(), executedBy } : d
      ),
      history: (() => {
        const change = s.dbChanges.find(d => d.id === id);
        const ver = change ? s.versions.find(v => v.id === change.versionId) : null;
        return ver ? addHistory(s.history, {
          systemId: ver.systemId,
          versionId: ver.id,
          action: 'Script executado',
          description: `${change?.name} marcado como executado`,
          author: executedBy,
        }) : s.history;
      })(),
    }));
    syncUpdate<DBChange>('db_changes', id, { executed: true, executedAt: now(), executedBy });
  },

  addFile: (data) => {
    const id = uuidv4();
    const newFile = { ...data, id, createdAt: now() };
    set((s) => ({ files: [...s.files, newFile] }));
    syncInsert('files', newFile);
    return id;
  },
  updateFile: (id, data) => {
    set((s) => ({ files: s.files.map((f) => f.id === id ? { ...f, ...data } : f) }));
    syncUpdate<SystemFile>('files', id, data);
  },
  deleteFile: (id) => {
    set((s) => ({ files: s.files.filter((f) => f.id !== id) }));
    syncDelete('files', id);
  },

  addTask: (data) => {
    const id = uuidv4();
    const ts = now();
    const newTask = { ...data, id, createdAt: ts, updatedAt: ts };
    set((s) => {
      const ver = s.versions.find(v => v.id === data.versionId);
      return {
        tasks: [...s.tasks, newTask],
        history: ver ? addHistory(s.history, {
          systemId: ver.systemId,
          versionId: data.versionId,
          action: 'Tarefa adicionada',
          description: data.title,
          author: s.currentUser,
        }) : s.history,
      };
    });
    syncInsert('tasks', newTask);
    return id;
  },
  updateTask: (id, data) => {
    set((s) => ({
      tasks: s.tasks.map((t) => t.id === id ? { ...t, ...data, updatedAt: now() } : t),
    }));
    syncUpdate<Task>('tasks', id, { ...data, updatedAt: now() });
  },
  deleteTask: (id) => {
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
    syncDelete('tasks', id);
  },

  addNote: (data) => {
    const id = uuidv4();
    const ts = now();
    const newNote = { ...data, id, createdAt: ts, updatedAt: ts };
    set((s) => ({ notes: [...s.notes, newNote] }));
    syncInsert('notes', newNote);
    return id;
  },
  updateNote: (id, data) => {
    set((s) => ({
      notes: s.notes.map((n) => n.id === id ? { ...n, ...data, updatedAt: now() } : n),
    }));
    syncUpdate<StickyNote>('notes', id, { ...data, updatedAt: now() });
  },
  deleteNote: (id) => {
    set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
    syncDelete('notes', id);
  },

  getSystemVersions: (systemId) => get().versions.filter((v) => v.systemId === systemId),
  getVersionDBChanges: (versionId) => get().dbChanges.filter((d) => d.versionId === versionId),
  getVersionFiles: (versionId) => get().files.filter((f) => f.versionId === versionId),
  getVersionTasks: (versionId) => get().tasks.filter((t) => t.versionId === versionId),
  getSystemHistory: (systemId) => get().history.filter((h) => h.systemId === systemId),
  getSystemNotes: (systemId) => get().notes.filter((n) => n.systemId === systemId),
}));
