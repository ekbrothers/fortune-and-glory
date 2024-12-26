// budget.tf

# Weekly-target Budget (implemented as monthly)
resource "google_billing_budget" "weekly_target_budget" {
  billing_account = var.billing_account_id
  display_name    = "Weekly Target Budget"

  budget_filter {
    projects = ["projects/${var.project_id}"]
    calendar_period = "MONTH"
  }

  amount {
    specified_amount {
      currency_code = "USD"
      units         = "20"  # $20 monthly but with early alerts
    }
  }

  # Alert at $5 (one week target)
  threshold_rules {
    threshold_percent = 0.25  # $5 is 25% of $20
    spend_basis      = "CURRENT_SPEND"
  }

  # Alert at $10 (two weeks)
  threshold_rules {
    threshold_percent = 0.50  # $10 is 50% of $20
    spend_basis      = "CURRENT_SPEND"
  }

  # Alert at $15 (three weeks)
  threshold_rules {
    threshold_percent = 0.75  # $15 is 75% of $20
    spend_basis      = "CURRENT_SPEND"
  }

  # Alert at $20 (full month/disable services)
  threshold_rules {
    threshold_percent = 1.0
    spend_basis      = "CURRENT_SPEND"
  }

  all_updates_rule {
    pubsub_topic = google_pubsub_topic.budget_alerts.id
    monitoring_notification_channels = [
      google_monitoring_notification_channel.email.id
    ]
    disable_default_iam_recipients = true
  }
  depends_on = [time_sleep.wait_30_seconds]
}

# Monthly Budget (serves as a backstop)
resource "google_billing_budget" "monthly_budget" {
  billing_account = var.billing_account_id
  display_name    = "Monthly Budget"

  budget_filter {
    projects = ["projects/${var.project_id}"]
    calendar_period = "MONTH"
  }

  amount {
    specified_amount {
      currency_code = "USD"
      units         = "20"  # $20 monthly budget
    }
  }

  threshold_rules {
    threshold_percent = 0.5  # Alert at 50%
    spend_basis      = "CURRENT_SPEND"
  }

  threshold_rules {
    threshold_percent = 0.9  # Alert at 90%
    spend_basis      = "CURRENT_SPEND"
  }

  threshold_rules {
    threshold_percent = 1.0  # Alert at 100%
    spend_basis      = "CURRENT_SPEND"
  }

  all_updates_rule {
    pubsub_topic = google_pubsub_topic.budget_alerts.id
    monitoring_notification_channels = [
      google_monitoring_notification_channel.email.id
    ]
    disable_default_iam_recipients = true
  }
  depends_on = [time_sleep.wait_30_seconds]
}

# Pub/Sub topic for budget alerts
resource "google_pubsub_topic" "budget_alerts" {
  name = "budget-alerts"
}

# Create requirements.txt for Cloud Function
resource "local_file" "requirements" {
  content  = <<-EOF
google-cloud-pubsub==2.18.4
EOF
  filename = "${path.module}/files/requirements.txt"
}
# Cloud Function to handle budget alerts
resource "google_cloudfunctions_function" "budget_handler" {
  name        = "budget-alert-handler"
  description = "Handles budget alerts and disables services when thresholds are reached"
  runtime     = "python39"

  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.processed_data.name
  source_archive_object = google_storage_bucket_object.function_archive.name
  entry_point          = "handle_budget_alert"
  
  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = google_pubsub_topic.budget_alerts.name
  }

  environment_variables = {
    PROJECT_ID = var.project_id
  }

  depends_on = [
    google_project_service.cloud_functions,
    google_project_service.pubsub,
    google_project_service.cloud_build,
    local_file.requirements
  ]
}

# Create ZIP file for Cloud Function
data "archive_file" "function_zip" {
  type        = "zip"
  output_path = "${path.module}/files/function.zip"
  source_dir  = "${path.module}/files"

  depends_on = [
    local_file.requirements
  ]
}

# Upload Cloud Function code
resource "google_storage_bucket_object" "function_archive" {
  name   = "budget-handler-function-${data.archive_file.function_zip.output_md5}.zip"
  bucket = google_storage_bucket.processed_data.name
  source = data.archive_file.function_zip.output_path
}

# Email notification channel
resource "google_monitoring_notification_channel" "email" {
  display_name = "Budget Alert Email"
  type         = "email"
  labels = {
    email_address = var.alert_email_address
  }
}

