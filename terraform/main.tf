# Create service account
resource "google_service_account" "gee_service_account" {
  account_id   = "gee-archaeological-detection"
  display_name = "Earth Engine Archaeological Detection Service Account"
  description  = "Service account for archaeological site detection using Google Earth Engine"
}

# Create service account key
resource "google_service_account_key" "gee_key" {
  service_account_id = google_service_account.gee_service_account.name
}

# Create storage buckets
resource "google_storage_bucket" "raw_data" {
  name          = "ee-ekbrothers-raw-data"
  location      = "US"
  force_destroy = true

  uniform_bucket_level_access = true

  lifecycle_rule {
    condition {
      age = 90  # Days
    }
    action {
      type = "Delete"
    }
  }
}

resource "google_storage_bucket" "processed_data" {
  name          = "ee-ekbrothers-processed-data"
  location      = "US"
  force_destroy = true

  uniform_bucket_level_access = true

  lifecycle_rule {
    condition {
      age = 30  # Days
    }
    action {
      type = "Delete"
    }
  }
}

# Grant Earth Engine roles
resource "google_project_iam_member" "gee_viewer" {
  project = "ee-ekbrothers"
  role    = "roles/viewer"
  member  = "serviceAccount:${google_service_account.gee_service_account.email}"
}

resource "google_project_iam_member" "storage_viewer" {
  project = "ee-ekbrothers"
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.gee_service_account.email}"
}

# Additional storage permissions
resource "google_project_iam_member" "storage_admin" {
  project = "ee-ekbrothers"
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.gee_service_account.email}"
}

# Bucket-specific permissions
resource "google_storage_bucket_iam_member" "raw_data_user" {
  bucket = google_storage_bucket.raw_data.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_service_account.gee_service_account.email}"
}

resource "google_storage_bucket_iam_member" "processed_data_admin" {
  bucket = google_storage_bucket.processed_data.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.gee_service_account.email}"
}

# Output the service account email and key
output "service_account_email" {
  value = google_service_account.gee_service_account.email
}

output "service_account_key" {
  value     = base64decode(google_service_account_key.gee_key.private_key)
  sensitive = true
}

output "raw_data_bucket" {
  value = google_storage_bucket.raw_data.name
}

output "processed_data_bucket" {
  value = google_storage_bucket.processed_data.name
}

