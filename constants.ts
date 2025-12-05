import { User, AccessLevel, Tool } from './types';

export const DEFAULT_DEPARTMENTS = [
  'Engineering',
  'Sales',
  'HR',
  'Marketing',
  'Operations',
  'Executive'
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Chen',
    email: 'alex.c@nexushub.com',
    avatar: 'https://picsum.photos/100/100',
    department: 'Engineering',
    isAdmin: true,
  },
  {
    id: 'u2',
    name: 'Sarah Jones',
    email: 'sarah.j@nexushub.com',
    avatar: 'https://picsum.photos/101/101',
    department: 'Sales',
    isAdmin: false,
  },
  {
    id: 'u3',
    name: 'Michael Scott',
    email: 'm.scott@nexushub.com',
    avatar: 'https://picsum.photos/102/102',
    department: 'Executive',
    isAdmin: false,
  }
];

export const INITIAL_TOOLS: Tool[] = [
  {
    id: 't1',
    name: 'Replit',
    url: 'https://replit.com',
    description: 'Collaborative browser-based IDE',
    category: 'Development',
    accessLevel: AccessLevel.DEPARTMENT,
    department: 'Engineering',
    createdBy: 'u1',
    tags: ['Code', 'IDE', 'Cloud'],
    credentials: { username: 'dev_team_main', password: 'secure_password_123' }
  },
  {
    id: 't2',
    name: 'Google AI Studio',
    url: 'https://aistudio.google.com',
    description: 'Prototyping with Gemini models',
    category: 'AI & ML',
    accessLevel: AccessLevel.PUBLIC,
    createdBy: 'u1',
    tags: ['AI', 'Gemini', 'Google'],
  },
  {
    id: 't3',
    name: 'Salesforce CRM',
    url: 'https://salesforce.com',
    description: 'Customer relationship management platform',
    category: 'Sales',
    accessLevel: AccessLevel.DEPARTMENT,
    department: 'Sales',
    createdBy: 'u2',
    tags: ['CRM', 'Leads'],
  },
  {
    id: 't4',
    name: 'Q3 Financial Sheet',
    url: 'https://docs.google.com/spreadsheets',
    description: 'Q3 Budgeting and Forecast',
    category: 'Finance',
    accessLevel: AccessLevel.PRIVATE,
    createdBy: 'u1',
    tags: ['Sheets', 'Finance'],
    credentials: { notes: 'Only editable by Alex' }
  }
];

export const CATEGORIES = [
  'Development',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Productivity',
  'AI & ML',
  'Other'
];