package handlers

import (
	"FileSystem/internal/service"
	utils "FileSystem/internal/utils"
	model "FileSystem/models"
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

func getUIBaseURL() string {
	if v := os.Getenv("UI_BASE_URL"); v != "" {
		return v
	}
	// fallback default for your case
	return "http://localhost:3000/dist"
}

var uiBaseURL = getUIBaseURL() // e.g. http://localhost:3000

func isBrowserNavigation(r *http.Request) bool {
	// If frontend sets X-Requested-With (fetch/XHR), treat as API
	if r.Header.Get("X-Requested-With") != "" {
		return false
	}

	accept := r.Header.Get("Accept")
	// Browser direct navigation usually includes text/html
	if strings.Contains(accept, "text/html") {
		return true
	}
	return false
}

func Getfileshandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Query().Get("path")

	// If no path => you can decide: list CWD as JSON or redirect to UI root
	if path == "" {

		allfiles, appErr := service.ListAllFilesAndFolders()
		if appErr != nil {
			w.Header().Set("Content-Type", "application/json")
			utils.SendErrorResponse(w, appErr)
			return
		}

		jsonData, err := json.MarshalIndent(allfiles, "", "  ")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(jsonData)
		return
	}

	// Resolve relative vs absolute path on the filesystem
	fsPath := path
	if !filepath.IsAbs(fsPath) {
		cwd, err := os.Getwd()
		if err != nil {
			appErr := model.NewInternalServerError(err, "Error getting current working directory")
			w.Header().Set("Content-Type", "application/json")
			utils.SendErrorResponse(w, appErr)
			return
		}
		fsPath = filepath.Join(cwd, fsPath)
	}

	info, err := os.Stat(fsPath)
	if err != nil {
		appErr := model.NewBadRequest(err, "Error: The path does not exist")
		w.Header().Set("Content-Type", "application/json")
		utils.SendErrorResponse(w, appErr)
		return
	}

	// If it's a directory ⇒ maybe redirect, else JSON
	if info.IsDir() {
		// Direct browser navigation: redirect to UI app

		// API call from frontend → respond with JSON
		allfiles, appErr := service.ListAllFilesAndFolders(fsPath)
		if appErr != nil {
			w.Header().Set("Content-Type", "application/json")
			utils.SendErrorResponse(w, appErr)
			return
		}

		jsonData, err := json.MarshalIndent(allfiles, "", "  ")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(jsonData)
		return
	}

	// If it's a file ⇒ always serve content (no redirect)
	fileData, appErr := service.GetFileData(fsPath)
	if appErr != nil {
		w.Header().Set("Content-Type", "application/json")
		utils.SendErrorResponse(w, appErr)
		return
	}

	contentType := http.DetectContentType(fileData)
	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Content-Length", strconv.Itoa(len(fileData)))
	w.Header().Set("Content-Disposition", "inline; filename=\""+info.Name()+"\"")

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(fileData)
}

func GetOnlyFoldersHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: implement listing only folders
	w.Header().Set("Content-Type", "application/json")
	path := r.URL.Query().Get("path")
	var folders []model.FileName
	var err *model.AppError
	if path != "" {
		folders, err = service.ListOnlyFolders(path)
	} else {
		folders, err = service.ListOnlyFolders()
	}
	if err != nil {
		utils.SendErrorResponse(w, err)
		return
	}
	json_data, err1 := json.MarshalIndent(folders, "", "  ")
	if err1 != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	w.WriteHeader(200)
	w.Write(json_data)

}

// Handler for Apache-style file serving at /files/*
// Route setup: router.HandleFunc("/files/", Getfileshandler2) or router.PathPrefix("/files/").HandlerFunc(Getfileshandler2)

// Write a new api for serving individual file data
func GetFileDataHandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Query().Get("path")
	if path == "" {
		appErr := model.NewBadRequest(nil, "query parameter 'path' is required")
		w.Header().Set("Content-Type", "application/json")
		utils.SendErrorResponse(w, appErr)
		return
	}

	// Let net/http handle content-type, range requests, etc.
	http.ServeFile(w, r, path)
}
