import type { SystemColor, SystemIcon, NoteColor } from '../types';

export const COLOR_MAP: Record<SystemColor, { bg: string; border: string; text: string; badge: string; glow: string }> = {
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400',   badge: 'bg-blue-500/20 text-blue-300',   glow: 'shadow-blue-500/20' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300', glow: 'shadow-purple-500/20' },
  green:  { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400',  badge: 'bg-green-500/20 text-green-300',  glow: 'shadow-green-500/20' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300', glow: 'shadow-orange-500/20' },
  red:    { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400',    badge: 'bg-red-500/20 text-red-300',    glow: 'shadow-red-500/20' },
  teal:   { bg: 'bg-teal-500/10',   border: 'border-teal-500/30',   text: 'text-teal-400',   badge: 'bg-teal-500/20 text-teal-300',   glow: 'shadow-teal-500/20' },
  pink:   { bg: 'bg-pink-500/10',   border: 'border-pink-500/30',   text: 'text-pink-400',   badge: 'bg-pink-500/20 text-pink-300',   glow: 'shadow-pink-500/20' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300', glow: 'shadow-yellow-500/20' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', badge: 'bg-indigo-500/20 text-indigo-300', glow: 'shadow-indigo-500/20' },
  cyan:   { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30',   text: 'text-cyan-400',   badge: 'bg-cyan-500/20 text-cyan-300',   glow: 'shadow-cyan-500/20' },
};

export const COLOR_DOT: Record<SystemColor, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  teal: 'bg-teal-500',
  pink: 'bg-pink-500',
  yellow: 'bg-yellow-500',
  indigo: 'bg-indigo-500',
  cyan: 'bg-cyan-500',
};

export const NOTE_COLORS: Record<NoteColor, { bg: string; border: string; title: string }> = {
  yellow: { bg: 'bg-yellow-500/15', border: 'border-yellow-500/40', title: 'text-yellow-300' },
  pink:   { bg: 'bg-pink-500/15',   border: 'border-pink-500/40',   title: 'text-pink-300' },
  blue:   { bg: 'bg-blue-500/15',   border: 'border-blue-500/40',   title: 'text-blue-300' },
  green:  { bg: 'bg-green-500/15',  border: 'border-green-500/40',  title: 'text-green-300' },
  purple: { bg: 'bg-purple-500/15', border: 'border-purple-500/40', title: 'text-purple-300' },
  orange: { bg: 'bg-orange-500/15', border: 'border-orange-500/40', title: 'text-orange-300' },
};

export const VERSION_STATUS_MAP = {
  development: { label: 'Desenvolvimento', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  testing:     { label: 'Homologação',     color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  published:   { label: 'Publicado',       color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  deprecated:  { label: 'Descontinuado',   color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
};

export const TASK_PRIORITY_MAP = {
  low:      { label: 'Baixa',    color: 'bg-gray-500/20 text-gray-400' },
  medium:   { label: 'Média',    color: 'bg-blue-500/20 text-blue-300' },
  high:     { label: 'Alta',     color: 'bg-orange-500/20 text-orange-300' },
  critical: { label: 'Crítica',  color: 'bg-red-500/20 text-red-300' },
};

export const TASK_CATEGORY_MAP = {
  bugfix:      { label: 'Bug Fix',        color: 'bg-red-500/15 text-red-400' },
  feature:     { label: 'Funcionalidade', color: 'bg-purple-500/15 text-purple-400' },
  improvement: { label: 'Melhoria',       color: 'bg-blue-500/15 text-blue-400' },
  hotfix:      { label: 'Hotfix',         color: 'bg-orange-500/15 text-orange-400' },
  refactor:    { label: 'Refatoração',    color: 'bg-teal-500/15 text-teal-400' },
};

export const TASK_STATUS_MAP = {
  pending:     { label: 'Pendente',       color: 'bg-gray-500/20 text-gray-400' },
  in_progress: { label: 'Em Progresso',   color: 'bg-blue-500/20 text-blue-300' },
  done:        { label: 'Concluída',      color: 'bg-green-500/20 text-green-300' },
  cancelled:   { label: 'Cancelada',      color: 'bg-red-500/20 text-red-400' },
};

export const DB_TYPE_MAP = {
  table:     { label: 'Tabela',    icon: '🗃️', color: 'bg-blue-500/15 text-blue-400' },
  field:     { label: 'Campo',     icon: '📋', color: 'bg-teal-500/15 text-teal-400' },
  index:     { label: 'Índice',    icon: '🔍', color: 'bg-purple-500/15 text-purple-400' },
  procedure: { label: 'Procedure', icon: '⚙️', color: 'bg-orange-500/15 text-orange-400' },
  trigger:   { label: 'Trigger',   icon: '⚡', color: 'bg-yellow-500/15 text-yellow-400' },
  script:    { label: 'Script',    icon: '📜', color: 'bg-gray-500/15 text-gray-400' },
  view:      { label: 'View',      icon: '👁️', color: 'bg-pink-500/15 text-pink-400' },
};

export const FILE_TYPE_MAP = {
  dll:    { label: 'DLL',    icon: '🔧', color: 'bg-blue-500/15 text-blue-400' },
  ocx:    { label: 'OCX',    icon: '🧩', color: 'bg-purple-500/15 text-purple-400' },
  exe:    { label: 'EXE',    icon: '▶️', color: 'bg-green-500/15 text-green-400' },
  config: { label: 'Config', icon: '⚙️', color: 'bg-orange-500/15 text-orange-400' },
  other:  { label: 'Outro',  icon: '📁', color: 'bg-gray-500/15 text-gray-400' },
};

export const SYSTEM_COLORS: SystemColor[] = ['blue', 'purple', 'green', 'orange', 'red', 'teal', 'pink', 'yellow', 'indigo', 'cyan'];
export const SYSTEM_ICONS: SystemIcon[] = ['monitor', 'database', 'shopping-cart', 'truck', 'bar-chart', 'users', 'settings', 'globe', 'box', 'layers'];
export const NOTE_COLOR_OPTIONS: NoteColor[] = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];
