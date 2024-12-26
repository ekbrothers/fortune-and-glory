# files/main.py
import base64
import json
import os
import subprocess

def handle_budget_alert(event, context):
    """Handles budget alert messages from Pub/Sub."""
    print(f"Received budget alert: {event}")
    try:
        pubsub_message = base64.b64decode(event['data']).decode('utf-8')
        budget_notification = json.loads(pubsub_message)
        
        # Extract cost amount and threshold
        cost_amount = float(budget_notification['costAmount'])
        budget_amount = float(budget_notification['budgetAmount'])
        threshold = cost_amount / budget_amount
        
        project_id = os.environ.get('PROJECT_ID')
        print(f"Evaluated threshold: {threshold} for project: {project_id}")
        
        # If we've exceeded the budget, disable billing
        if threshold >= 1.0:
            print("Budget threshold exceeded, disabling services...")
            disable_project_services(project_id)
            print("Services disabled successfully")
            
    except Exception as e:
        print(f"Error processing budget alert: {str(e)}")
        raise

def disable_project_services(project_id):
    """Disables all non-essential services in the project."""
    try:
        # Get list of enabled services
        services = list_enabled_services(project_id)
        
        # Essential services that shouldn't be disabled
        essential_services = {
            "cloudresourcemanager.googleapis.com",
            "cloudbilling.googleapis.com",
            "iam.googleapis.com",
            "compute.googleapis.com"
        }
        
        # Disable non-essential services
        for service in services:
            if service not in essential_services:
                disable_service(project_id, service)
                print(f"Disabled service: {service}")
                
    except Exception as e:
        print(f"Error disabling services: {str(e)}")
        raise

def list_enabled_services(project_id):
    """Lists enabled services in the project."""
    try:
        command = f"gcloud services list --project {project_id} --format='value(config.name)' --filter='state:ENABLED'"
        result = subprocess.run(command, shell=True, capture_output=True, text=True, check=True)
        services = result.stdout.strip().split('\n')
        return [s for s in services if s]  # Remove empty strings
    except subprocess.CalledProcessError as e:
        print(f"Error listing services: {str(e)}")
        raise

def disable_service(project_id, service):
    """Disables a specific service."""
    try:
        command = f"gcloud services disable {service} --project {project_id} --force"
        subprocess.run(command, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error disabling service {service}: {str(e)}")
        raise