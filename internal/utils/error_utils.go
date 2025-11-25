package utils

import (
	model "FileSystem/models"
	"encoding/json"
	"net/http"
)

func SendErrorResponse(w http.ResponseWriter, err *model.AppError) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(err.Code)

	errResp := model.ErrorResponse{
		Code:    err.Code,
		Message: err.Message,
		Detail:  err.Error(),
	}
	_ = json.NewEncoder(w).Encode(errResp)
}
