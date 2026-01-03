import React, { useEffect, useState, useRef } from 'react';
import { fetchFolders } from '../services/api';
import { FolderItem } from '../types';
import './Breadcrumbs.css';

interface BreadcrumbsProps {
  currentPath?: string;
  onPathChange: (path: string | undefined) => void;
}

interface BreadcrumbItem {
  name: string;
  path: string | undefined;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPath, onPathChange }) => {
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [siblingFolders, setSiblingFolders] = useState<FolderItem[]>([]);
  const [loadingSiblings, setLoadingSiblings] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const buildBreadcrumbs = async () => {
      if (!currentPath) {
        setBreadcrumbPath([{ name: 'Root', path: undefined }]);
        return;
      }

      const pathParts = currentPath.split('/').filter(Boolean);
      const breadcrumbs: BreadcrumbItem[] = [{ name: 'Root', path: undefined }];

      // Build breadcrumbs from path segments
      let accumulatedPath = '';
      for (let i = 0; i < pathParts.length; i++) {
        accumulatedPath = i === 0 
          ? pathParts[i] 
          : `${accumulatedPath}/${pathParts[i]}`;
        
        // Get parent path for fetching folders
        const parentPath = i === 0 ? undefined : pathParts.slice(0, i).join('/');
        
        try {
          // Fetch folders to get the proper folder name and path
          const folders = await fetchFolders(parentPath);
          const folder = folders.find(f => 
            f.name === pathParts[i] || 
            f.path === accumulatedPath ||
            (f.path && f.path.endsWith(pathParts[i])) ||
            (!f.path && f.name === pathParts[i])
          );
          // Use the folder's path from API if available, otherwise use accumulated path
          const folderPath = folder?.path || accumulatedPath;
          breadcrumbs.push({
            name: folder?.name || pathParts[i],
            path: folderPath || undefined
          });
        } catch (error) {
          // If API fails, use the path part as name and accumulated path
          breadcrumbs.push({
            name: pathParts[i],
            path: accumulatedPath
          });
        }
      }

      setBreadcrumbPath(breadcrumbs);
    };

    buildBreadcrumbs();
    setOpenDropdownIndex(null); // Close dropdown when path changes
    setDropdownPosition(null);
  }, [currentPath]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownIndex(null);
      }
    };

    if (openDropdownIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openDropdownIndex]);

  const handleBreadcrumbClick = (path: string | undefined) => {
    onPathChange(path);
  };

  const handleDropdownToggle = async (index: number, folderPath: string | undefined) => {
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(null);
      setDropdownPosition(null);
      return;
    }

    // Calculate dropdown position
    const button = buttonRefs.current.get(index);
    if (button) {
      const rect = button.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      });
    }

    setOpenDropdownIndex(index);
    setLoadingSiblings(true);
    
    try {
      // Fetch child folders of the clicked breadcrumb item
      const folders = await fetchFolders(folderPath);
      setSiblingFolders(folders);
    } catch (error) {
      console.error('Error fetching child folders:', error);
      setSiblingFolders([]);
    } finally {
      setLoadingSiblings(false);
    }
  };

  const handleFolderSelect = (folder: FolderItem, parentPath: string | undefined) => {
    // Build path based on folder selection
    let selectedPath: string | undefined;
    if (folder.path) {
      // Use the path from API if available
      selectedPath = folder.path;
    } else if (parentPath) {
      // Construct path: parentPath/folderName
      selectedPath = `${parentPath}/${folder.name}`;
    } else {
      // Root level folder
      selectedPath = folder.name;
    }
    
    onPathChange(selectedPath);
    setOpenDropdownIndex(null);
  };

  return (
    <nav className="breadcrumbs">
      {breadcrumbPath.map((item, index) => {
        const isLast = index === breadcrumbPath.length - 1;
        
        return (
          <React.Fragment key={index}>
            <div className="breadcrumb-wrapper" ref={index === openDropdownIndex ? dropdownRef : null}>
              <button
                className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                onClick={() => !isLast && handleBreadcrumbClick(item.path)}
                disabled={isLast}
              >
                {item.name}
              </button>
              
              {!isLast && (
                <button
                  ref={(el) => {
                    if (el) buttonRefs.current.set(index, el);
                    else buttonRefs.current.delete(index);
                  }}
                  className={`breadcrumb-dropdown-toggle ${openDropdownIndex === index ? 'open' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Fetch child folders of this breadcrumb item
                    handleDropdownToggle(index, item.path);
                  }}
                  aria-label={`Show folders in ${item.name}`}
                >
                  <span className="dropdown-arrow">▼</span>
                </button>
              )}
              
              {openDropdownIndex === index && dropdownPosition && (
                <div 
                  className="breadcrumb-dropdown"
                  ref={dropdownRef}
                  style={{
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`
                  }}
                >
                  {loadingSiblings ? (
                    <div className="dropdown-loading">Loading...</div>
                  ) : siblingFolders.length === 0 ? (
                    <div className="dropdown-empty">No folders available</div>
                  ) : (
                    <div className="dropdown-list">
                      {siblingFolders.map((folder, folderIndex) => {
                        // Check if this folder matches the next breadcrumb (if exists)
                        const nextItem = breadcrumbPath[index + 1];
                        const isCurrentFolder = nextItem && (
                          folder.path === nextItem.path ||
                          (folder.path === undefined && folder.name === nextItem.name && item.path === undefined) ||
                          (folder.name === nextItem.name && folder.path && folder.path === nextItem.path)
                        );
                        
                        return (
                          <button
                            key={folderIndex}
                            className={`dropdown-item ${isCurrentFolder ? 'active' : ''}`}
                            onClick={() => handleFolderSelect(folder, item.path)}
                          >
                            <span className="folder-icon">📁</span>
                            {folder.name}
                            {isCurrentFolder && <span className="current-indicator">●</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            {index < breadcrumbPath.length - 1 && (
              <span className="breadcrumb-separator">/</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

