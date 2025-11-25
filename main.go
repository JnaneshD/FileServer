package main

import (
	"FileSystem/internal/router"
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("Starting the Server...")
	r := router.SetupRouter()
	fmt.Println("Listening on port 8080")
	http.ListenAndServe(":8080", r)
}
