package model

import "net/http"

type AppError struct {
	Code    int
	Message string
	Err     error
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return e.Err.Error()
	}
	return e.Message
}

func NewBadRequest(err error, message string) *AppError {
	return &AppError{Code: http.StatusBadRequest, Message: message, Err: err}
}

func NewInternalServerError(err error, message string) *AppError {
	return &AppError{Code: http.StatusInternalServerError, Message: message, Err: err}
}
