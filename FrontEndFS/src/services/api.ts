import { FileItem, FolderItem, ApiFileItem } from '../types';

// Check if we're in demo mode (GitHub Pages)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const API_BASE_URL = 'http://localhost:8080';

// ============== MOCK DATA FOR DEMO ==============
const mockFileSystem: Record<string, FileItem[]> = {
  '': [
    { name: 'Documents', type: 'folder', path: 'Documents', modified: '2024-12-15T10:30:00Z' },
    { name: 'Downloads', type: 'folder', path: 'Downloads', modified: '2024-12-20T14:15:00Z' },
    { name: 'Projects', type: 'folder', path: 'Projects', modified: '2024-12-28T09:00:00Z' },
    { name: 'Pictures', type: 'folder', path: 'Pictures', modified: '2024-12-10T16:45:00Z' },
    { name: 'readme.txt', type: 'file', path: 'readme.txt', size: 1024, modified: '2024-12-01T08:00:00Z' },
    { name: 'config.json', type: 'file', path: 'config.json', size: 512, modified: '2024-11-25T12:30:00Z' },
  ],
  'Documents': [
    { name: 'Reports', type: 'folder', path: 'Documents/Reports', modified: '2024-12-10T11:20:00Z' },
    { name: 'Notes', type: 'folder', path: 'Documents/Notes', modified: '2024-12-05T09:15:00Z' },
    { name: 'resume.pdf', type: 'file', path: 'Documents/resume.pdf', size: 245760, modified: '2024-11-20T14:00:00Z' },
    { name: 'cover_letter.docx', type: 'file', path: 'Documents/cover_letter.docx', size: 32768, modified: '2024-11-22T10:30:00Z' },
    { name: 'meeting_notes.md', type: 'file', path: 'Documents/meeting_notes.md', size: 4096, modified: '2024-12-14T16:00:00Z' },
  ],
  'Documents/Reports': [
    { name: 'Q4_Report.xlsx', type: 'file', path: 'Documents/Reports/Q4_Report.xlsx', size: 524288, modified: '2024-12-08T17:00:00Z' },
    { name: 'Annual_Summary.pdf', type: 'file', path: 'Documents/Reports/Annual_Summary.pdf', size: 1048576, modified: '2024-12-09T11:30:00Z' },
    { name: 'Sales_Data.csv', type: 'file', path: 'Documents/Reports/Sales_Data.csv', size: 8192, modified: '2024-12-07T13:45:00Z' },
  ],
  'Documents/Notes': [
    { name: 'project_ideas.txt', type: 'file', path: 'Documents/Notes/project_ideas.txt', size: 2048, modified: '2024-12-03T15:20:00Z' },
    { name: 'todo.md', type: 'file', path: 'Documents/Notes/todo.md', size: 1024, modified: '2024-12-05T08:00:00Z' },
  ],
  'Downloads': [
    { name: 'nodejs-installer.msi', type: 'file', path: 'Downloads/nodejs-installer.msi', size: 31457280, modified: '2024-12-18T10:00:00Z' },
    { name: 'vscode-setup.exe', type: 'file', path: 'Downloads/vscode-setup.exe', size: 83886080, modified: '2024-12-15T14:30:00Z' },
    { name: 'photo.jpg', type: 'file', path: 'Downloads/photo.jpg', size: 3145728, modified: '2024-12-20T09:15:00Z' },
    { name: 'document.pdf', type: 'file', path: 'Downloads/document.pdf', size: 1572864, modified: '2024-12-19T16:45:00Z' },
  ],
  'Projects': [
    { name: 'FileServer', type: 'folder', path: 'Projects/FileServer', modified: '2024-12-28T09:00:00Z' },
    { name: 'WebApp', type: 'folder', path: 'Projects/WebApp', modified: '2024-12-25T11:30:00Z' },
    { name: 'README.md', type: 'file', path: 'Projects/README.md', size: 2048, modified: '2024-12-20T10:00:00Z' },
  ],
  'Projects/FileServer': [
    { name: 'internal', type: 'folder', path: 'Projects/FileServer/internal', modified: '2024-12-27T14:00:00Z' },
    { name: 'models', type: 'folder', path: 'Projects/FileServer/models', modified: '2024-12-26T09:30:00Z' },
    { name: 'FrontEndFS', type: 'folder', path: 'Projects/FileServer/FrontEndFS', modified: '2024-12-28T08:45:00Z' },
    { name: 'main.go', type: 'file', path: 'Projects/FileServer/main.go', size: 512, modified: '2024-12-25T15:00:00Z' },
    { name: 'go.mod', type: 'file', path: 'Projects/FileServer/go.mod', size: 128, modified: '2024-12-20T11:00:00Z' },
    { name: 'README.md', type: 'file', path: 'Projects/FileServer/README.md', size: 8192, modified: '2024-12-28T09:00:00Z' },
  ],
  'Projects/FileServer/internal': [
    { name: 'handlers', type: 'folder', path: 'Projects/FileServer/internal/handlers', modified: '2024-12-27T13:00:00Z' },
    { name: 'router', type: 'folder', path: 'Projects/FileServer/internal/router', modified: '2024-12-26T16:00:00Z' },
    { name: 'service', type: 'folder', path: 'Projects/FileServer/internal/service', modified: '2024-12-27T10:30:00Z' },
  ],
  'Projects/WebApp': [
    { name: 'src', type: 'folder', path: 'Projects/WebApp/src', modified: '2024-12-25T10:00:00Z' },
    { name: 'public', type: 'folder', path: 'Projects/WebApp/public', modified: '2024-12-24T14:30:00Z' },
    { name: 'package.json', type: 'file', path: 'Projects/WebApp/package.json', size: 1024, modified: '2024-12-23T09:00:00Z' },
    { name: 'vite.config.ts', type: 'file', path: 'Projects/WebApp/vite.config.ts', size: 512, modified: '2024-12-22T16:00:00Z' },
  ],
  'Pictures': [
    { name: 'Vacation', type: 'folder', path: 'Pictures/Vacation', modified: '2024-12-01T12:00:00Z' },
    { name: 'Screenshots', type: 'folder', path: 'Pictures/Screenshots', modified: '2024-12-08T15:30:00Z' },
    { name: 'profile.png', type: 'file', path: 'Pictures/profile.png', size: 524288, modified: '2024-11-15T10:00:00Z' },
    { name: 'background.jpg', type: 'file', path: 'Pictures/background.jpg', size: 2097152, modified: '2024-10-20T14:00:00Z' },
  ],
  'Pictures/Vacation': [
    { name: 'beach.jpg', type: 'file', path: 'Pictures/Vacation/beach.jpg', size: 4194304, modified: '2024-08-15T16:30:00Z' },
    { name: 'mountain.jpg', type: 'file', path: 'Pictures/Vacation/mountain.jpg', size: 3670016, modified: '2024-08-16T09:00:00Z' },
    { name: 'sunset.jpg', type: 'file', path: 'Pictures/Vacation/sunset.jpg', size: 2621440, modified: '2024-08-17T18:45:00Z' },
  ],
  'Pictures/Screenshots': [
    { name: 'app_demo.png', type: 'file', path: 'Pictures/Screenshots/app_demo.png', size: 1048576, modified: '2024-12-08T15:00:00Z' },
    { name: 'error_log.png', type: 'file', path: 'Pictures/Screenshots/error_log.png', size: 786432, modified: '2024-12-05T11:30:00Z' },
  ],
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// ============== END MOCK DATA ==============

// Transform API response to internal format
const transformFileItem = (apiItem: ApiFileItem): FileItem => {
  return {
    name: apiItem.Name,
    type: apiItem.Type === 'Folder' ? 'folder' : 'file',
    path: apiItem.Path,
    size: apiItem.Size,
    modified: apiItem.LastModified,
  };
};

export const fetchFiles = async (path?: string): Promise<FileItem[]> => {
  // Use mock data in demo mode
  if (USE_MOCK) {
    await delay(300);
    const normalizedPath = path || '';
    return mockFileSystem[normalizedPath] || [];
  }

  const url = new URL(`${API_BASE_URL}/files`);
  if (path) {
    url.searchParams.set('path', path);
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch files: ${response.statusText}`);
  }
  
  const data: ApiFileItem[] = await response.json();
  return data.map(transformFileItem);
};

export const fetchFolders = async (path?: string): Promise<FolderItem[]> => {
  // Use mock data in demo mode
  if (USE_MOCK) {
    await delay(200);
    const normalizedPath = path || '';
    const files = mockFileSystem[normalizedPath] || [];
    return files
      .filter(item => item.type === 'folder')
      .map(item => ({ name: item.name, path: item.path }));
  }

  const url = new URL(`${API_BASE_URL}/folders`);
  if (path) {
    url.searchParams.set('path', path);
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch folders: ${response.statusText}`);
  }
  
  const data: ApiFileItem[] = await response.json();
  return data.map(item => ({
    name: item.Name,
    path: item.Path,
  }));
};

export const getFileUrl = (filePath: string): string => {
  if (USE_MOCK) {
    return `#file:${filePath}`;
  }
  const url = new URL(`${API_BASE_URL}/files`);
  url.searchParams.set('path', filePath);
  return url.toString();
};

export const fetchFileContent = async (filePath: string): Promise<Response> => {
  if (USE_MOCK) {
    await delay(200);
    const mockContent = `Demo preview of: ${filePath}\n\nIn the live version, actual file content would be displayed here.`;
    return new Response(mockContent, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  const url = new URL(`${API_BASE_URL}/files`);
  url.searchParams.set('path', filePath);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${response.statusText}`);
  }
  return response;
};
