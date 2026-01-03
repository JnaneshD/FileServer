import React, { useEffect, useState, useMemo } from 'react';
import { fetchFiles, getFileUrl } from '../services/api';
import { FileItem } from '../types';
import './FileSystemView.css';

interface FileSystemViewProps {
  currentPath?: string;
  onFolderClick: (folderPath: string) => void;
}

type SortColumn = 'name' | 'type' | 'size' | 'modified' | null;
type SortDirection = 'asc' | 'desc';

export const FileSystemView: React.FC<FileSystemViewProps> = ({ currentPath, onFolderClick }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFiles(currentPath);
        setFiles(data);
        // Reset sort when path changes
        setSortColumn(null);
        setSortDirection('asc');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load files');
        console.error('Error loading files:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [currentPath]);

  // Sort files based on selected column and direction
  const sortedFiles = useMemo(() => {
    if (!sortColumn) return files;

    return [...files].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'size':
          aValue = a.size ?? 0;
          bValue = b.size ?? 0;
          break;
        case 'modified':
          aValue = a.modified ? new Date(a.modified).getTime() : 0;
          bValue = b.modified ? new Date(b.modified).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [files, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, start with ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleItemClick = (item: FileItem, e: React.MouseEvent) => {
    if (item.type === 'folder') {
      e.preventDefault();
      e.stopPropagation();
      const newPath = currentPath 
        ? `${currentPath}/${item.name}` 
        : item.name;
      onFolderClick(newPath);
    }
    // For files, we'll use anchor tags which handle navigation automatically
  };

  const getFileUrlForItem = (item: FileItem): string => {
    const filePath = currentPath 
      ? `${currentPath}/${item.name}` 
      : item.name;
    // Use the shared API helper so all file access uses the same API base
    return getFileUrl(filePath);
  };

  const formatSize = (bytes?: number): string => {
    if (!bytes) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    // Web files (check first to override generic types)
    if (['html', 'htm'].includes(extension)) return '🌐'; // HTML
    if (['css', 'scss', 'sass', 'less'].includes(extension)) return '🎨'; // CSS
    
    // Code files
    if (['js', 'jsx', 'mjs', 'cjs'].includes(extension)) return '📜'; // JavaScript
    if (['ts', 'tsx'].includes(extension)) return '📘'; // TypeScript
    if (['py', 'pyw', 'pyc'].includes(extension)) return '🐍'; // Python
    if (['java', 'class', 'jar'].includes(extension)) return '☕'; // Java
    if (['cpp', 'cxx', 'cc', 'c', 'h', 'hpp'].includes(extension)) return '⚙️'; // C/C++
    if (['go'].includes(extension)) return '🐹'; // Go
    if (['rs'].includes(extension)) return '🦀'; // Rust
    if (['php'].includes(extension)) return '🐘'; // PHP
    if (['rb'].includes(extension)) return '💎'; // Ruby
    if (['swift'].includes(extension)) return '🐦'; // Swift
    if (['kt', 'kts'].includes(extension)) return '🟦'; // Kotlin
    if (['sh', 'bash', 'zsh', 'fish'].includes(extension)) return '💻'; // Shell
    if (['ps1', 'psm1', 'psd1'].includes(extension)) return '💻'; // PowerShell
    
    // Images (check before generic file types)
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'].includes(extension)) return '🖼️'; // Images
    
    // Archives
    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(extension)) return '📦'; // Archives
    
    // Audio
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'].includes(extension)) return '🎵'; // Audio
    
    // Video
    if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) return '🎬'; // Video
    
    // Documents
    if (['pdf'].includes(extension)) return '📕'; // PDF
    if (['doc', 'docx'].includes(extension)) return '📘'; // Word
    if (['xls', 'xlsx', 'xlsm'].includes(extension)) return '📗'; // Excel
    if (['ppt', 'pptx'].includes(extension)) return '📙'; // PowerPoint
    
    // Data/Config files
    if (['json'].includes(extension)) return '📋'; // JSON
    if (['xml', 'xsd', 'xslt'].includes(extension)) return '📄'; // XML
    if (['yaml', 'yml'].includes(extension)) return '📝'; // YAML
    if (['csv'].includes(extension)) return '📊'; // CSV
    if (['sql', 'sqlite', 'db'].includes(extension)) return '🗄️'; // Database
    
    // Text/Log files
    if (['txt', 'text', 'md', 'markdown'].includes(extension)) return '📝'; // Text
    if (['log', 'out'].includes(extension)) return '📋'; // Log/Output
    if (['rtf'].includes(extension)) return '📄'; // Rich Text
    
    // Default file icon
    return '📄';
  };

  if (loading) {
    return (
      <div className="file-system-view loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="file-system-view error">
        <p>Error: {error}</p>
      </div>
    );
  }

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <span className="sort-icon inactive">⇅</span>;
    }
    return sortDirection === 'asc' 
      ? <span className="sort-icon">↑</span>
      : <span className="sort-icon">↓</span>;
  };

  return (
    <div className="file-system-view">
      <table className="file-system-table">
        <thead>
          <tr>
            <th 
              className="sortable" 
              onClick={() => handleSort('name')}
              title="Sort by Name"
            >
              <div className="th-content">
                Name
                {getSortIcon('name')}
              </div>
            </th>
            <th 
              className="sortable" 
              onClick={() => handleSort('type')}
              title="Sort by Type"
            >
              <div className="th-content">
                Type
                {getSortIcon('type')}
              </div>
            </th>
            <th 
              className="sortable" 
              onClick={() => handleSort('size')}
              title="Sort by Size"
            >
              <div className="th-content">
                Size
                {getSortIcon('size')}
              </div>
            </th>
            <th 
              className="sortable" 
              onClick={() => handleSort('modified')}
              title="Sort by Last Modified"
            >
              <div className="th-content">
                Last Modified
                {getSortIcon('modified')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedFiles.length === 0 ? (
            <tr>
              <td colSpan={4} className="empty-state">
                <p>This folder is empty</p>
              </td>
            </tr>
          ) : (
            sortedFiles.map((item, index) => {
              if (item.type === 'folder') {
                return (
                  <tr
                    key={`${item.name}-${index}`}
                    className="table-row folder"
                    onClick={(e) => handleItemClick(item, e)}
                    title="Click to open folder"
                  >
                    <td className="name-cell">
                      <span className="icon folder" title="Folder">📁</span>
                      <span>{item.name}</span>
                    </td>
                    <td className="type-cell">{item.type}</td>
                    <td className="size-cell">-</td>
                    <td className="modified-cell">
                      {formatDate(item.modified)}
                    </td>
                  </tr>
                );
              } else {
                // File - use anchor tag for native browser context menu
                return (
                  <tr
                    key={`${item.name}-${index}`}
                    className="table-row file"
                  >
                    <td className="name-cell">
                        <a
                        href={getFileUrlForItem(item)}
                        className="file-link"
                        title="Click to view file, right-click for options"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="icon file" title={item.name}>{getFileIcon(item.name)}</span>
                        <span>{item.name}</span>
                      </a>
                    </td>
                    <td className="type-cell">{item.type}</td>
                    <td className="size-cell">
                      {formatSize(item.size)}
                    </td>
                    <td className="modified-cell">
                      {formatDate(item.modified)}
                    </td>
                  </tr>
                );
              }
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

