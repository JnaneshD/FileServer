package router

import (
	"FileSystem/internal/handlers"
	"net/http"
)

func SetupRouter() http.Handler {
	mux := http.NewServeMux()

	// Add routes
	mux.HandleFunc("/files", handlers.Getfileshandler)
	mux.HandleFunc("/folders", handlers.GetOnlyFoldersHandler)

	return corsMiddleware(mux)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow everything (wildcard)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		// If you don't need cookies/auth, keep wildcard. Do not set Allow-Credentials with "*".
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
