# Sistema de Gerenciamento de Projetos

Interface web moderna para gerenciamento de sistemas, versões, mudanças de banco de dados, arquivos e tarefas.

## 🚀 Funcionalidades

- **Dashboard** com visão geral dos sistemas
- **Gerenciamento de Sistemas** Delphi
- **Controle de Versões** com checklist e status
- **Alterações de Banco de Dados** (SQL scripts)
- **Gerenciamento de Arquivos** (DLLs, EXEs, etc.)
- **Sistema de Tarefas** com prioridades
- **Histórico de Atividades**
- **Notas Fixadas** por sistema
- **Persistência no Supabase** (PostgreSQL)

## 🛠️ Tecnologias

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** + **Lucide Icons**
- **Zustand** (state management)
- **Supabase** (PostgreSQL + API)

## 📋 Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)

## ⚙️ Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd delphi-project-management-system
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

#### a) Crie um novo projeto no Supabase
- Acesse [supabase.com](https://supabase.com)
- Crie um novo projeto
- Anote a **URL do projeto** e **chave anônima**

#### b) Execute os scripts SQL
- Abra o **SQL Editor** no painel do Supabase
- Execute primeiro: `supabase-schema.sql` (cria as tabelas)
- Execute depois: `supabase-seed.sql` (dados iniciais)

#### c) Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas credenciais
VITE_SUPABASE_URL=https://seu-projeto-ref.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 4. Execute o projeto
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── tabs/           # Abas de detalhes da versão
│   └── ui/             # Componentes de UI reutilizáveis
├── lib/
│   └── supabase.ts     # Cliente Supabase
├── store/
│   └── useStore.ts     # Estado global (Zustand)
├── types/
│   └── index.ts        # Definições TypeScript
└── utils/              # Utilitários
```

## 🗄️ Estrutura do Banco

### Tabelas Principais

- **systems**: Sistemas Delphi cadastrados
- **versions**: Versões de cada sistema
- **db_changes**: Scripts SQL de mudanças
- **files**: Arquivos das versões (DLLs, EXEs)
- **tasks**: Tarefas das versões
- **history**: Log de atividades
- **notes**: Notas fixadas por sistema

### Relacionamentos

```
systems (1) ──── (N) versions
versions (1) ──── (N) db_changes
versions (1) ──── (N) files
versions (1) ──── (N) tasks
systems (1) ──── (N) history
systems (1) ──── (N) notes
```

## 🎯 Como Usar

1. **Dashboard**: Visão geral com estatísticas
2. **Sistemas**: Gerencie seus sistemas Delphi
3. **Versões**: Controle releases e implantações
4. **Abas da Versão**:
   - **Visão Geral**: Checklist e status
   - **Banco de Dados**: Scripts SQL
   - **Arquivos**: DLLs e executáveis
   - **Histórico**: Log de atividades
   - **Tarefas**: Itens a fazer

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

### Estrutura de Estado (Zustand)

O estado global gerencia:
- Dados dos sistemas, versões, tarefas, etc.
- Sincronização automática com Supabase
- Navegação entre telas
- Filtros e busca

### Componentes Principais

- `Dashboard`: Tela inicial com estatísticas
- `SystemsList`: Lista de sistemas
- `VersionList`: Lista de versões de um sistema
- `VersionDetails`: Detalhes da versão com abas
- `SystemForm` / `VersionForm`: Formulários de criação/edição

## 🚀 Deploy

O projeto gera um arquivo `dist/index.html` único (single-file) pronto para deploy em qualquer servidor web estático.

### Opções de Deploy
- **Vercel**: `npm run build` + deploy da pasta `dist`
- **Netlify**: Mesmo processo
- **GitHub Pages**: Configure para servir `dist/index.html`
- **Servidor próprio**: Sirva `dist/index.html` como página única

## 📝 Notas

- Dados são persistidos automaticamente no Supabase
- Interface responsiva para desktop e mobile
- Tema dark otimizado para desenvolvimento
- Suporte completo a CRUD de todas as entidades

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é open source. Use como quiser! 🎉# CRM
