export enum AccessLevel {
  PRIVATE = 'PRIVATE', // Only the creator
  DEPARTMENT = 'DEPARTMENT', // Everyone in the same department
  PUBLIC = 'PUBLIC' // Everyone in the organization
}

// Changed from Enum to string type to allow dynamic creation in Settings
export type Department = string;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: Department;
  isAdmin: boolean;
}

export interface ToolCredentials {
  username?: string;
  password?: string; // In a real app, this should be encrypted
  notes?: string;
}

export interface Tool {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  iconUrl?: string;
  accessLevel: AccessLevel;
  department?: Department; // Required if AccessLevel is DEPARTMENT
  createdBy: string; // User ID
  credentials?: ToolCredentials;
  tags: string[];
}

export interface ToolSuggestion {
  category: string;
  description: string;
  tags: string[];
}