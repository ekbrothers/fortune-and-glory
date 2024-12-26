# disable_apis.ps1
$PROJECT_ID = "ee-ekbrothers"

$APIS = @(
    "earthengine.googleapis.com",
    "storage.googleapis.com",
    "billingbudgets.googleapis.com",
    "cloudfunctions.googleapis.com",
    "cloudbuild.googleapis.com",
    "pubsub.googleapis.com"
)

Write-Host "Disabling APIs for project: $PROJECT_ID"
foreach ($api in $APIS) {
    Write-Host "Disabling $api..."
    gcloud services disable $api --project=$PROJECT_ID --force
}

Write-Host "APIs have been disabled"