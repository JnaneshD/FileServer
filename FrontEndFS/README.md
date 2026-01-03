# File System Interface

A full-stack file system interface application built with React, TypeScript, and Vite.

## Features

- **File and Folder Browsing**: View files and folders using the `/files` API endpoint
- **Navigation**: Click on folders to navigate into them
- **Breadcrumbs**: Navigate back to parent folders using breadcrumbs with dropdown for child folders
- **URL Navigation**: Shareable URLs that reflect the current path (e.g., `?path=foldername/subfolder`)
- **Browser History**: Support for browser back/forward buttons
- **Responsive UI**: Modern, clean interface for browsing the file system

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://phoenix687254.dev3sub2phx.databasede3phx.oraclevcn.com:8080`

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the port shown in the terminal).

## API Endpoints

The application expects the following API endpoints to be available:

- `GET http://phoenix687254.dev3sub2phx.databasede3phx.oraclevcn.com:8080/files?path=<folderpath>` - Returns files and folders
- `GET http://phoenix687254.dev3sub2phx.databasede3phx.oraclevcn.com:8080/folders?path=<folderpath>` - Returns only folders (used for breadcrumbs)

Both endpoints support an optional `path` query parameter for navigating into subdirectories.

## Project Structure

```
src/
  ├── components/
  │   ├── Breadcrumbs.tsx      # Breadcrumb navigation component
  │   ├── Breadcrumbs.css
  │   ├── FileSystemView.tsx   # Main file/folder listing component
  │   └── FileSystemView.css
  ├── services/
  │   └── api.ts               # API service functions
  ├── types.ts                 # TypeScript type definitions
  ├── App.tsx                  # Main application component
  ├── App.css
  └── main.tsx                 # Application entry point
```

## Usage

1. Make sure your backend API is running on `http://phoenix687254.dev3sub2phx.databasede3phx.oraclevcn.com:8080`
2. Start the development server with `npm run dev`
3. Click on folders to navigate into them
4. Use breadcrumbs at the top to navigate back to parent folders
5. Click the dropdown arrow (▼) on breadcrumbs to see child folders
6. Share URLs with others - the path is automatically reflected in the URL query parameter

### URL Format

The application uses URL query parameters to track the current path:
- Root: `http://localhost:3000`
- Specific folder: `http://localhost:3000?path=foldername`
- Nested folder: `http://localhost:3000?path=foldername/subfolder`

You can share these URLs with others, and they will see the same folder view when they open the link.

## Build

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

