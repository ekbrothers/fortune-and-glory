# Grant Cloud Functions service account permissions
data "google_project" "project" {
}

resource "google_project_iam_member" "artifact_registry_reader" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
}

resource "google_project_iam_member" "service_account_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
}

# Billing account level permissions
resource "google_billing_account_iam_member" "billing_admin" {
  billing_account_id = var.billing_account_id
  role              = "roles/billing.admin"
  member            = "user:${var.admin_email}"
}

resource "google_billing_account_iam_member" "billing_viewer" {
  billing_account_id = var.billing_account_id
  role              = "roles/billing.viewer"
  member            = "user:${var.admin_email}"
}

