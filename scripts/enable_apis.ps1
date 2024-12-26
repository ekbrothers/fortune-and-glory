# enable_apis.ps1
$PROJECT_ID = "ee-ekbrothers"

$APIS = @(
    "earthengine.googleapis.com",
    "storage.googleapis.com",
    "billingbudgets.googleapis.com",
    "cloudfunctions.googleapis.com",
    "cloudbuild.googleapis.com",
    "pubsub.googleapis.com"
)

Write-Host "Enabling APIs for project: $PROJECT_ID"
foreach ($api in $APIS) {
    Write-Host "Enabling $api..."
    gcloud services enable $api --project=$PROJECT_ID
}

Write-Host "APIs have been enabled"