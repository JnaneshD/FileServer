// API response format (capital field names)
export interface ApiFileItem {
  Name: string;
  Type: 'File' | 'Folder';
  LastModified?: string;
  Size?: number;
  Path?: string;
}

// Internal format (camelCase)
export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path?: string;
  size?: number;
  modified?: string;
}

export interface FolderItem {
  name: string;
  path?: string;
}

