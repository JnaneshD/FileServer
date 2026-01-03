import { FileItem, FolderItem, ApiFileItem } from '../types';

export const API_BASE_URL = 'http://phoenix687254.dev3sub2phx.databasede3phx.oraclevcn.com:8080';

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
  const url = new URL(`${API_BASE_URL}/folders`);
  if (path) {
    url.searchParams.set('path', path);
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch folders: ${response.statusText}`);
  }
  
  const data: ApiFileItem[] = await response.json();
  // Transform folders (API returns same format)
  return data.map(item => ({
    name: item.Name,
    path: item.Path,
  }));
};

// Build a URL to access a file via the same API base.
// The backend is expected to provide file content or a download when calling
// GET /files?path=<filePath> (same base used for listing). This keeps all
// file access routed through the same API base URL.
export const getFileUrl = (filePath: string): string => {
  const url = new URL(`${API_BASE_URL}/files`);
  url.searchParams.set('path', filePath);
  return url.toString();
};

// Fetch the raw file content. Returns a Response so caller can decide how to consume it.
export const fetchFileContent = async (filePath: string): Promise<Response> => {
  const url = new URL(`${API_BASE_URL}/files`);
  url.searchParams.set('path', filePath);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${response.statusText}`);
  }
  return response;
};

