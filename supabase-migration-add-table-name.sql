-- Migration: Add tableName column to db_changes table
-- Execute this script no Supabase SQL Editor

ALTER TABLE public.db_changes ADD COLUMN IF NOT EXISTS "tableName" text;
