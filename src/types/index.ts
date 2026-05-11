export type SystemColor =
  | 'blue'
  | 'purple'
  | 'green'
  | 'orange'
  | 'red'
  | 'teal'
  | 'pink'
  | 'yellow'
  | 'indigo'
  | 'cyan';

export type SystemIcon =
  | 'monitor'
  | 'database'
  | 'shopping-cart'
  | 'truck'
  | 'bar-chart'
  | 'users'
  | 'settings'
  | 'globe'
  | 'box'
  | 'layers';

export type VersionStatus = 'development' | 'testing' | 'published' | 'deprecated';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskCategory = 'bugfix' | 'feature' | 'improvement' | 'hotfix' | 'refactor';
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'cancelled';
export type DBChangeType = 'table' | 'field' | 'index' | 'procedure' | 'trigger' | 'script' | 'view';
export type FileType = 'dll' | 'ocx' | 'exe' | 'config' | 'other';
export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'purple' | 'orange';

export interface DelphiSystem {
  id: string;
  name: string;
  description: string;
  color: SystemColor;
  icon: SystemIcon;
  language: string;
  database: string;
  defaultPath: string;
  createdAt: string;
  updatedAt: string;
}

export interface Version {
  id: string;
  systemId: string;
  version: string;
  date: string;
  responsible: string;
  status: VersionStatus;
  observations: string;
  updateSteps: string;
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface DBChange {
  id: string;
  versionId: string;
  type: DBChangeType;
  tableName?: string;
  name: string;
  description: string;
  sql: string;
  executed: boolean;
  executedAt?: string;
  executedBy?: string;
  createdAt: string;
}

export interface SystemFile {
  id: string;
  versionId: string;
  type: FileType;
  name: string;
  version: string;
  destinationPath: string;
  required: boolean;
  downloadLink: string;
  notes: string;
  createdAt: string;
}

export interface Task {
  id: string;
  versionId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  id: string;
  systemId: string;
  versionId?: string;
  action: string;
  description: string;
  author: string;
  date: string;
}

export interface StickyNote {
  id: string;
  systemId: string;
  title: string;
  content: string;
  color: NoteColor;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}
