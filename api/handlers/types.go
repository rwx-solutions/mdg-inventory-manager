package handlers

import "github.com/lf-hernandez/mdg-inventory-tools/api/models"

type PasswordResetRequest struct {
	CurrentPassword string `json:"currentPassword"`
	NewPassword     string `json:"newPassword"`
}

type LoginResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

type SignupResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

type GetItemsResponse struct {
	Items      []models.Item `json:"items"`
	TotalCount int           `json:"totalCount"`
}

type UserResponse struct {
	ID    string      `json:"id"`
	Name  string      `json:"name"`
	Email string      `json:"email"`
	Role  models.Role `json:"role"`
}
