-- Seed data for Supabase tables
-- Execute this AFTER running supabase-schema.sql

-- Insert systems
INSERT INTO public.systems (id, name, description, color, icon, language, "database", "defaultPath", "createdAt", "updatedAt") VALUES
('sys-1', 'Sistema Financeiro', 'Controle financeiro completo com contas a pagar/receber, fluxo de caixa e relatórios gerenciais.', 'blue', 'bar-chart', 'Delphi 10.4', 'Firebird 3.0', 'C:\Sistemas\Financeiro', '2024-01-10T08:00:00Z', '2024-06-15T14:30:00Z'),
('sys-2', 'PDV', 'Ponto de venda com emissão de NF-e, SAT, controle de caixa e integração com balança.', 'green', 'shopping-cart', 'Delphi 11', 'Firebird 2.5', 'C:\Sistemas\PDV', '2024-02-01T09:00:00Z', '2024-06-20T11:00:00Z'),
('sys-3', 'Delivery', 'Sistema de gestão de pedidos delivery com rastreamento de entregadores e integração com iFood.', 'orange', 'truck', 'Delphi 11', 'PostgreSQL 14', 'C:\Sistemas\Delivery', '2024-03-15T10:00:00Z', '2024-06-25T16:00:00Z'),
('sys-4', 'ERP', 'Sistema ERP completo com módulos de estoque, compras, vendas, RH e contabilidade.', 'purple', 'layers', 'Delphi 10.4', 'SQL Server 2019', 'C:\Sistemas\ERP', '2023-11-01T08:00:00Z', '2024-06-18T09:00:00Z');

-- Insert versions
INSERT INTO public.versions (id, "systemId", version, date, responsible, status, observations, "updateSteps", checklist, "createdAt", "updatedAt") VALUES
('ver-1', 'sys-1', '1.0.0', '2024-01-10', 'Carlos Silva', 'published', 'Versão inicial do sistema financeiro.', '1. Fazer backup do banco\n2. Executar scripts SQL\n3. Substituir EXE\n4. Testar abertura do sistema', '[{"id": "c1", "text": "Backup do banco de dados", "done": true}, {"id": "c2", "text": "Scripts SQL executados", "done": true}, {"id": "c3", "text": "EXE substituído", "done": true}, {"id": "c4", "text": "Testes realizados", "done": true}]', '2024-01-10T08:00:00Z', '2024-01-15T10:00:00Z'),
('ver-2', 'sys-1', '1.0.1', '2024-02-05', 'Carlos Silva', 'published', 'Correção de bugs no relatório de fluxo de caixa.', '1. Fazer backup\n2. Substituir EXE\n3. Verificar relatórios', '[{"id": "c5", "text": "Backup realizado", "done": true}, {"id": "c6", "text": "EXE atualizado", "done": true}]', '2024-02-05T09:00:00Z', '2024-02-10T11:00:00Z'),
('ver-3', 'sys-1', '1.1.0', '2024-06-15', 'Carlos Silva', 'testing', 'Adicionado módulo de centro de custos e novos relatórios.', '1. Backup\n2. Executar script de criação de tabelas\n3. Executar script de procedures\n4. Substituir EXE e DLLs\n5. Configurar parâmetros\n6. Testar', '[{"id": "c7", "text": "Backup do banco", "done": true}, {"id": "c8", "text": "Script de tabelas executado", "done": true}, {"id": "c9", "text": "Script de procedures executado", "done": false}, {"id": "c10", "text": "EXE atualizado", "done": false}, {"id": "c11", "text": "DLLs atualizadas", "done": false}, {"id": "c12", "text": "Testes completos", "done": false}]', '2024-06-15T08:00:00Z', '2024-06-15T14:30:00Z'),
('ver-4', 'sys-2', '2.0.0', '2024-06-20', 'Ana Rodrigues', 'published', 'Integração com SAT Fiscal e novo layout de cupom.', '1. Backup\n2. Executar scripts\n3. Copiar DLLs do SAT\n4. Configurar SAT no sistema\n5. Testar emissão', '[{"id": "c13", "text": "Backup realizado", "done": true}, {"id": "c14", "text": "Scripts executados", "done": true}, {"id": "c15", "text": "DLLs do SAT copiadas", "done": true}]', '2024-06-20T09:00:00Z', '2024-06-22T15:00:00Z'),
('ver-5', 'sys-3', '1.2.0', '2024-06-25', 'João Mendes', 'development', 'Rastreamento em tempo real e integração com WhatsApp.', '', '[]', '2024-06-25T10:00:00Z', '2024-06-25T16:00:00Z');

-- Insert db_changes
INSERT INTO public.db_changes (id, "versionId", "type", name, description, sql, executed, "executedAt", "executedBy", "createdAt") VALUES
('db-1', 'ver-3', 'table', 'CENTRO_CUSTO', 'Tabela de centros de custo para rateio de despesas', 'CREATE TABLE CENTRO_CUSTO (
  ID INTEGER NOT NULL,
  DESCRICAO VARCHAR(100) NOT NULL,
  CODIGO VARCHAR(20),
  ATIVO CHAR(1) DEFAULT ''S'',
  DATA_CRIACAO DATE DEFAULT CURRENT_DATE,
  CONSTRAINT PK_CENTRO_CUSTO PRIMARY KEY (ID)
);

CREATE GENERATOR GEN_CENTRO_CUSTO;
SET GENERATOR GEN_CENTRO_CUSTO TO 0;', true, '2024-06-15T09:00:00Z', 'Carlos Silva', '2024-06-15T08:00:00Z');

-- Insert tasks
INSERT INTO public.tasks (id, "versionId", title, description, priority, category, status, date, "createdAt", "updatedAt") VALUES
('task-1', 'ver-3', 'Implementar centro de custos', 'Criar interface para cadastro e manutenção de centros de custo', 'high', 'feature', 'in_progress', '2024-06-15', '2024-06-15T08:00:00Z', '2024-06-15T14:30:00Z'),
('task-2', 'ver-3', 'Relatório de custos por centro', 'Desenvolver relatório de rateio de custos', 'medium', 'feature', 'pending', '2024-06-20', '2024-06-15T08:00:00Z', '2024-06-15T14:30:00Z'),
('task-3', 'ver-5', 'Integração WhatsApp', 'Implementar envio de notificações via WhatsApp', 'high', 'feature', 'pending', '2024-06-25', '2024-06-25T10:00:00Z', '2024-06-25T16:00:00Z');

-- Insert history
INSERT INTO public.history (id, "systemId", "versionId", action, description, author, date) VALUES
('hist-1', 'sys-1', 'ver-1', 'Sistema criado', 'Sistema "Sistema Financeiro" criado', 'Carlos Silva', '2024-01-10T08:00:00Z'),
('hist-2', 'sys-1', 'ver-1', 'Versão criada', 'Versão 1.0.0 criada', 'Carlos Silva', '2024-01-10T08:00:00Z'),
('hist-3', 'sys-1', 'ver-3', 'Versão criada', 'Versão 1.1.0 criada', 'Carlos Silva', '2024-06-15T08:00:00Z'),
('hist-4', 'sys-2', 'ver-4', 'Versão criada', 'Versão 2.0.0 criada', 'Ana Rodrigues', '2024-06-20T09:00:00Z'),
('hist-5', 'sys-3', 'ver-5', 'Versão criada', 'Versão 1.2.0 criada', 'João Mendes', '2024-06-25T10:00:00Z');

-- Insert notes
INSERT INTO public.notes (id, "systemId", title, content, color, pinned, "createdAt", "updatedAt") VALUES
('note-1', 'sys-1', '⚠️ Atenção', 'Banco do cliente XYZ ainda não foi migrado para o Firebird 3.0. Aguardando janela de manutenção.', 'yellow', true, '2024-06-14T10:00:00Z', '2024-06-14T10:00:00Z'),
('note-2', 'sys-1', 'Pendência', 'Solicitar para o cliente a lista de centros de custo antes de implantar a versão 1.1.0.', 'pink', false, '2024-06-15T08:00:00Z', '2024-06-15T08:00:00Z'),
('note-3', 'sys-2', 'SAT', 'Código de ativação do SAT: ATIVACAO-SAT-001. Guardar em local seguro!', 'blue', true, '2024-06-20T10:00:00Z', '2024-06-20T10:00:00Z');