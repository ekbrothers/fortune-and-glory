# Archaeological Site Detection Using Machine Learning: GitHub-based Implementation

Update, December 27, 2024: Implemented with latest Earth Engine API and modern CI/CD practices!

## Table of Contents
1. [Overview](#overview)
2. [Research Foundation](#research-foundation)
3. [Implementation Architecture](#implementation-architecture)
4. [Setup & Prerequisites](#setup--prerequisites)
5. [Infrastructure](#infrastructure)
6. [Running the Detection](#running-the-detection)
7. [Limitations & Considerations](#limitations--considerations)
8. [References & Resources](#references--resources)

## Overview

This project implements the Orengo et al. (2020) approach to archaeological site detection using modern DevOps practices. We've transformed their Google Earth Engine script into a fully automated, GitHub-based workflow that can be triggered manually or run on a schedule.

### Core Objectives
- Reproduce Orengo's validated detection methodology
- Automate the entire process through GitHub Actions
- Ensure secure credential management
- Enable reproducible archaeological prospection

### Key Features
- Automated Earth Engine processing
- Secure service account authentication
- Cloud Storage integration
- Configurable execution schedules

## Research Foundation

This implementation is based on Orengo et al.'s 2020 paper:
- "Automated detection of archaeological mounds using machine-learning classification of multisensor and multitemporal satellite data"
- Published in: Proceedings of the National Academy of Sciences
- [Original paper](https://www.researchgate.net/publication/343098080)

## Implementation Architecture

### Platform Components
1. **GitHub Repository**
   - Source code management
   - Workflow automation
   - Secret management
   - Version control

2. **Google Cloud Platform**
   - Earth Engine API access
   - Service account authentication
   - Cloud Storage for results
   - Budget monitoring

3. **Earth Engine**
   - Satellite data processing
   - Machine learning execution
   - Result generation

### Directory Structure
```plaintext
fortune-and-glory/
├── .github/
│   └── workflows/
│       └── archaeological_detection.yml
├── src/
│   └── detection.js
├── terraform/
│   ├── main.tf
│   ├── budget.tf
│   └── provider.tf
├── key/
│
└── README.md
└── .gitignore
```

## Setup & Prerequisites

### Required Accounts
1. GitHub account with Actions enabled
2. Google Cloud Platform account
3. Earth Engine account

### Technical Requirements
- Git
- Terraform
- Google Cloud SDK
- Basic JavaScript knowledge

### Authentication Setup
```bash
# Generate service account key
terraform apply -target=google_service_account_key.gee_key

# Add to GitHub secrets
# Name: EE_SERVICE_ACCOUNT_JSON
# Value: [Base64 encoded key content]
```

## Infrastructure

### Terraform Resources
1. **Service Account**
   - Earth Engine authentication
   - Cloud Storage access
   - Budget monitoring

2. **Storage**
   - Raw data bucket
   - Processed results bucket

3. **Budget Controls**
   - Weekly limit: $5
   - Monthly limit: $20
   - Automatic service disable

### Security Considerations
- Service account key rotation
- GitHub secret management
- Least privilege access
- Budget enforcement

## Running the Detection

### Manual Execution
1. Fork the repository
2. Configure secrets
3. Trigger workflow manually

### Automated Schedule
```yaml
on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly runs
```

### Processing Steps
1. Authentication
2. Data collection
3. Site detection
4. Result export

## Limitations & Considerations

### Current Limitations
1. **Infrastructure**
   - Budget constraints
   - Processing timeouts
   - Storage limitations

2. **Detection**
   - Training data requirements
   - False positive handling
   - Size constraints

### Best Practices
1. Regular key rotation
2. Result validation
3. Cost monitoring
4. Version control

## References & Resources

### Implementation Resources
1. [Original Paper](https://www.researchgate.net/publication/343098080)
2. [Earth Engine JavaScript API](https://developers.google.com/earth-engine/guides/getstarted)
3. [GitHub Actions Documentation](https://docs.github.com/en/actions)

### Repository
- Main Repository: [fortune-and-glory](https://github.com/yourusername/fortune-and-glory)
- Related Projects: [Original Implementation](https://github.com/horengo/Orengo_et_al_2020_PNAS)

---

Note: This implementation has been tested with:
- Earth Engine API (December 2024)
- GitHub Actions (Latest)
- Terraform 1.6+
- Google Cloud Platform (Latest)