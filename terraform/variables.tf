variable "admin_email" {
  description = "The Google account email of the admin"
  type        = string
}

variable "billing_account_id" {
  description = "The ID of the billing account"
  type        = string
}

variable "alert_email_address" {
  description = "Email address to receive budget alerts"
  type        = string
}

variable "project_id" {
  description = "The GCP project ID"
  type        = string
}