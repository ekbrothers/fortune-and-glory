// provider.tf
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  billing_project       = var.project_id
  user_project_override = true
  region  = "us-central1"  # Default region, can be changed
}

// main.tf
# Enable required APIs
resource "google_project_service" "earth_engine" {
  service = "earthengine.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_resource_manager" {
  service = "cloudresourcemanager.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "storage" {
  service = "storage.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "billing_budgets" {
  service = "billingbudgets.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_functions" {
  service = "cloudfunctions.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_build" {
  service = "cloudbuild.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "pubsub" {
  service = "pubsub.googleapis.com"
  disable_on_destroy = false
}

# Adding the new required APIs
resource "google_project_service" "cloud_billing" {
  service = "cloudbilling.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "service_usage" {
  service = "serviceusage.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "monitoring" {
  service = "monitoring.googleapis.com"
  disable_on_destroy = false
}

# Add dependency on API enablement for the budget resources
resource "time_sleep" "wait_30_seconds" {
  depends_on = [
    google_project_service.billing_budgets,
    google_project_service.cloud_functions,
    google_project_service.cloud_build,
    google_project_service.pubsub
  ]

  create_duration = "30s"
}