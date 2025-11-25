package service

import (
	model "FileSystem/models"
	"os"
	"path/filepath"
	"time"
)

func ListAllFilesAndFolders(path ...string) ([]model.FileName, *model.AppError) {
	var cwd string
	var err error

	cwd, err = CheckForValidPath(path...)

	var fileNames []model.FileName

	entries, err := os.ReadDir(cwd)
	if err != nil {
		return nil, model.NewInternalServerError(err, "Error Getting the files in work directory")
	}

	for _, entry := range entries {
		fileName := model.FileName{
			Name: entry.Name(),
		}

		if entry.IsDir() {
			fileName.Type = "Folder"
		} else {
			fileName.Type = "File"
		}

		// Get file info for last modified time
		info, err := entry.Info()
		if err != nil {
			fileName.LastModified = "Unknown"
		} else {
			fileName.LastModified = info.ModTime().Format(time.RFC3339)
		}

		fileNames = append(fileNames, fileName)
	}

	return fileNames, nil
}

func ListOnlyFolders(path ...string) ([]model.FileName, *model.AppError) {
	// Add only the folders from the path
	fileNames := make([]model.FileName, 0)
	cwd, err1 := CheckForValidPath(path...)
	if err1 != nil {
		return nil, err1
	}
	entries, err := os.ReadDir(cwd)
	if err != nil {
		return nil, model.NewInternalServerError(err, "Unable to read folders")
	}
	for _, entry := range entries {
		info, _ := entry.Info()
		if entry.IsDir() {
			fileName := model.FileName{
				Name:         entry.Name(),
				Type:         "Folder",
				LastModified: info.ModTime().Format(time.RFC3339),
			}
			fileNames = append(fileNames, fileName)
		}
	}

	return fileNames, nil
}

func CheckForValidPath(path ...string) (string, *model.AppError) {
	var cwd string
	var err error
	if len(path) > 0 && path[0] != "" {
		// Handle both absolute and relative paths
		if filepath.IsAbs(path[0]) {
			// Absolute path provided
			cwd = path[0]
		} else {
			// Relative path provided - resolve it relative to current working directory
			currentDir, err := os.Getwd()
			if err != nil {
				return "", model.NewBadRequest(err, "Error Getting the current work directory")
			}
			cwd = filepath.Join(currentDir, path[0])
		}

		// Validate that the path exists and is a directory
		fileInfo, err := os.Stat(cwd)
		if err != nil {
			return "", model.NewBadRequest(err, "Error: The path does not exist")
		}
		if !fileInfo.IsDir() {
			return "", model.NewBadRequest(err, "Error: Provided path is not a folder")
		}
	} else {
		// No path provided, use current working directory
		cwd, err = os.Getwd()
		if err != nil {
			return "", model.NewBadRequest(err, "Error Getting the current work directory")
		}
	}
	return cwd, nil
}

// Write a function for sending individual file data
func GetFileData(filePath string) ([]byte, *model.AppError) {
	// Validate the file path
	if filePath == "" {
		return nil, model.NewBadRequest(nil, "File path cannot be empty")
	}
	// Check if the file exists and is not a directory
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		return nil, model.NewBadRequest(err, "Error: The file does not exist")
	}
	if fileInfo.IsDir() {
		return nil, model.NewBadRequest(err, "Error: Provided path is a folder, not a file")
	}
	// Read the file data
	fileData, err := os.ReadFile(filePath)
	if err != nil {
		return nil, model.NewInternalServerError(err, "Error reading the file data")
	}
	return fileData, nil
}
