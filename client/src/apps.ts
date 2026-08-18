import type { LucideIcon } from 'lucide-react';
import {
  User,
  BarChart3,
  Sprout,
  Package,
  CalendarDays,
  FolderOpen,
  Users,
  ClipboardCheck,
} from 'lucide-react';

export type AppStatus = 'in-development' | 'coming-soon';

export interface AppEntry {
  id: string;
  title: string;
  description: string;
  status: AppStatus;
  icon: LucideIcon;
  bg: string;
  iconBg: string;
  href: string | null;
}

// Central registry of every app surfaced on the Switchboard.
// `href` is left null until each app has a real deployed URL to link to —
// wire it up here once the backend/routing for that app exists.
export const apps: AppEntry[] = [
  {
    id: 'consultant-hub',
    title: 'Consultant Hub',
    description: 'Screen, review and onboard consultants with confidence.',
    status: 'in-development',
    icon: User,
    bg: '#e4dbfa',
    iconBg: '#4b39d9',
    href: null,
  },
  {
    id: 'project-pulse',
    title: 'Project Pulse',
    description: 'Manage projects and track their RAG status at a glance.',
    status: 'in-development',
    icon: BarChart3,
    bg: '#fbd9ce',
    iconBg: '#e43e2f', // Kidzink Red (official swatch)
    href: null,
  },
  {
    id: 'peopleflow',
    title: 'PeopleFlow',
    description: 'Connect, grow and manage Kidzink talent.',
    status: 'coming-soon',
    icon: Sprout,
    bg: '#c9f0da',
    iconBg: '#1f8f5f',
    href: null,
  },
  {
    id: 'resource-library',
    title: 'Resource Library',
    description: 'Find and share what you need.',
    status: 'coming-soon',
    icon: Package,
    bg: '#fbe7b6',
    iconBg: '#f5af4d', // Kidzink Yellow (official swatch)
    href: null,
  },
  {
    id: 'workplace',
    title: 'Workplace',
    description: 'Tools for a better day-to-day.',
    status: 'coming-soon',
    icon: CalendarDays,
    bg: '#c7eee9',
    iconBg: '#2e9c93',
    href: null,
  },
  {
    id: 'docs-resources',
    title: 'Docs & Resources',
    description: 'Keep everything in one place.',
    status: 'coming-soon',
    icon: FolderOpen,
    bg: '#cfe2fa',
    iconBg: '#2d6fe0',
    href: null,
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    description: 'Work better together.',
    status: 'coming-soon',
    icon: Users,
    bg: '#e1d6f7',
    iconBg: '#7c5cd1',
    href: null,
  },
  {
    id: 'quality',
    title: 'Quality',
    description: 'Track progress. Raise standards.',
    status: 'coming-soon',
    icon: ClipboardCheck,
    bg: '#c7f0de',
    iconBg: '#189a6d',
    href: null,
  },
];

export const STATUS_LABEL: Record<AppStatus, string> = {
  'in-development': 'In development',
  'coming-soon': 'Coming soon',
};
