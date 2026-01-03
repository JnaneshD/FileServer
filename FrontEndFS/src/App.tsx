import { useState, useEffect } from 'react';
import { Breadcrumbs } from './components/Breadcrumbs';
import { FileSystemView } from './components/FileSystemView';
import './App.css';

function App() {
  // Read initial path from URL
  const getPathFromURL = (): string | undefined => {
    const search = window.location.search;
    if (!search) return undefined;
    
    // Manually parse to preserve slashes
    const match = search.match(/[?&]path=([^&]*)/);
    if (match && match[1]) {
      // Decode the path segments but preserve slashes
      return decodeURIComponent(match[1].replace(/%2F/g, '/'));
    }
    return undefined;
  };

  const [currentPath, setCurrentPath] = useState<string | undefined>(getPathFromURL());

  // Update URL when path changes
  const updateURL = (path: string | undefined) => {
    const baseUrl = window.location.origin + window.location.pathname;
    
    if (path) {
      // Encode path but preserve slashes - split by /, encode each part, join with /
      const encodedPath = path
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/');
      
      const urlWithPath = `${baseUrl}?path=${encodedPath}`;
      window.history.pushState({ path }, '', urlWithPath);
    } else {
      window.history.pushState({ path: undefined }, '', baseUrl);
    }
  };

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = getPathFromURL();
      setCurrentPath(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handlePathChange = (path: string | undefined) => {
    setCurrentPath(path);
    updateURL(path);
  };

  const handleFolderClick = (folderPath: string) => {
    setCurrentPath(folderPath);
    updateURL(folderPath);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Index of Reports</h1>
        <Breadcrumbs currentPath={currentPath} onPathChange={handlePathChange} />
      </header>
      <main className="app-main">
        <FileSystemView 
          currentPath={currentPath} 
          onFolderClick={handleFolderClick}
        />
      </main>
    </div>
  );
}

export default App;

