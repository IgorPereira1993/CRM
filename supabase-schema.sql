-- Supabase / PostgreSQL schema for Delphi project management system
-- Execute this script no Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.systems (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  color text,
  icon text,
  language text,
  "database" text,
  "defaultPath" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.versions (
  id text PRIMARY KEY,
  "systemId" text NOT NULL REFERENCES public.systems(id) ON DELETE CASCADE,
  version text NOT NULL,
  date date,
  responsible text,
  status text CHECK (status IN ('development','testing','published','deprecated')),
  observations text,
  "updateSteps" text,
  checklist jsonb NOT NULL DEFAULT '[]',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.db_changes (
  id text PRIMARY KEY,
  "versionId" text NOT NULL REFERENCES public.versions(id) ON DELETE CASCADE,
  "type" text CHECK ("type" IN ('table','field','index','procedure','trigger','script','view')),
  name text,
  description text,
  sql text,
  executed boolean NOT NULL DEFAULT false,
  "executedAt" timestamptz,
  "executedBy" text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.files (
  id text PRIMARY KEY,
  "versionId" text NOT NULL REFERENCES public.versions(id) ON DELETE CASCADE,
  "type" text CHECK ("type" IN ('dll','ocx','exe','config','other')),
  name text,
  version text,
  "destinationPath" text,
  required boolean NOT NULL DEFAULT false,
  "downloadLink" text,
  notes text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id text PRIMARY KEY,
  "versionId" text NOT NULL REFERENCES public.versions(id) ON DELETE CASCADE,
  title text,
  description text,
  priority text CHECK (priority IN ('low','medium','high','critical')),
  category text CHECK (category IN ('bugfix','feature','improvement','hotfix','refactor')),
  status text CHECK (status IN ('pending','in_progress','done','cancelled')),
  date date,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.history (
  id text PRIMARY KEY,
  "systemId" text NOT NULL REFERENCES public.systems(id) ON DELETE CASCADE,
  "versionId" text REFERENCES public.versions(id) ON DELETE SET NULL,
  action text,
  description text,
  author text,
  date timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notes (
  id text PRIMARY KEY,
  "systemId" text NOT NULL REFERENCES public.systems(id) ON DELETE CASCADE,
  title text,
  content text,
  color text CHECK (color IN ('yellow','pink','blue','green','purple','orange')),
  pinned boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_versions_system_id ON public.versions("systemId");
CREATE INDEX IF NOT EXISTS idx_db_changes_version_id ON public.db_changes("versionId");
CREATE INDEX IF NOT EXISTS idx_files_version_id ON public.files("versionId");
CREATE INDEX IF NOT EXISTS idx_tasks_version_id ON public.tasks("versionId");
CREATE INDEX IF NOT EXISTS idx_history_system_id ON public.history("systemId");
CREATE INDEX IF NOT EXISTS idx_notes_system_id ON public.notes("systemId");
