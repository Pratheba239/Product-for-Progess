#!/bin/bash

# ==============================================================================
# PP_OS: MASTER AZURE DEPLOYMENT SCRIPT
# This script provisions Resource Groups, SQL, App Service, and Static Web Apps.
# It also registers Entra ID apps and sets GitHub secrets automatically.
# ==============================================================================

# --- CONFIGURATION (Feel free to change) ---
RESOURCE_GROUP="PP_App_Resources"
LOCATION="southeastasia" # Known working region for this student subscription
SQL_SERVER_NAME="pp-sql-server-prod"
SQL_DB_NAME="ppdb"
SQL_ADMIN_USER="dbadmin"
SQL_ADMIN_PASSWORD="Once@time26"
APP_SERVICE_NAME="pp-api-backend-prod"
APP_SERVICE_PLAN="pp-backend-plan"
SWA_NAME="pp-frontend-swa-prod"
REPO_URL="https://github.com/Pratheba239/Product-for-Progess"
# -------------------------------------------

echo "🚀 Starting PP_OS Azure Automation..."

# 1. Create Resource Group
echo "Creating Resource Group: $RESOURCE_GROUP..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# 2. Create Azure SQL Server and Database
echo "Creating Azure SQL Server ($SQL_SERVER_NAME)..."
az sql server create --name $SQL_SERVER_NAME --resource-group $RESOURCE_GROUP --location $LOCATION --admin-user $SQL_ADMIN_USER --admin-password "$SQL_ADMIN_PASSWORD"

echo "Creating Database: $SQL_DB_NAME (Standard Free Tier)..."
# Using Basic tier for reliable student provisioning
az sql db create --resource-group $RESOURCE_GROUP --server $SQL_SERVER_NAME --name $SQL_DB_NAME --edition Basic --service-objective Basic

echo "Opening Firewall for Azure Services..."
az sql server firewall-rule create --resource-group $RESOURCE_GROUP --server $SQL_SERVER_NAME --name AllowAzureServices --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0

# 3. Create Web App for Backend
echo "Creating App Service Plan (FREE F1 TIER)..."
az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --sku F1 --is-linux

echo "Creating Web App: $APP_SERVICE_NAME..."
az webapp create --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --name $APP_SERVICE_NAME --runtime "NODE:22-lts"

# 4. Create Static Web App for Frontend
echo "Creating Static Web App: $SWA_NAME..."
SWA_TOKEN=$(az staticwebapp create --name $SWA_NAME --resource-group $RESOURCE_GROUP --source $REPO_URL --location "centralus" --branch main --app-location "/client" --output-location ".next" --login-with-github --query "properties.apiKey" -o tsv)

# 5. Entra ID App Registration (CIAM)
echo "Registering Entra ID Apps..."
BACKEND_APP=$(az ad app create --display-name "PP_Backend_API" --query "appId" -o tsv)
FRONTEND_APP=$(az ad app create --display-name "PP_Frontend" --query "appId" -o tsv)
TENANT_ID=$(az account show --query "tenantId" -o tsv)

# 6. Set GitHub Secrets
echo "Setting GitHub Secrets..."
if command -v gh &> /dev/null
then
    # Note: Requires 'gh auth login' or GH_TOKEN to be set
    gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --body "$SWA_TOKEN" --repo $REPO_URL
    gh secret set AZURE_APP_SERVICE_NAME --body "$APP_SERVICE_NAME" --repo $REPO_URL
    gh secret set DB_HOST --body "${SQL_SERVER_NAME}.database.windows.net" --repo $REPO_URL
    gh secret set DB_USER --body "$SQL_ADMIN_USER" --repo $REPO_URL
    gh secret set DB_PASSWORD --body "$SQL_ADMIN_PASSWORD" --repo $REPO_URL
    gh secret set DB_NAME --body "$SQL_DB_NAME" --repo $REPO_URL
    gh secret set AZURE_AD_CLIENT_ID --body "$BACKEND_APP" --repo $REPO_URL
    gh secret set AZURE_AD_ISSUER --body "https://login.microsoftonline.com/$TENANT_ID/v2.0" --repo $REPO_URL
    gh secret set AZURE_AD_JWKS_URL --body "https://login.microsoftonline.com/$TENANT_ID/discovery/v2.0/keys" --repo $REPO_URL
else
    echo "⚠️ gh CLI not found. Please set the secrets manually in GitHub Settings."
fi

echo "===================================================="
echo "✅ DEPLOYMENT SETUP COMPLETE!"
echo "Database Connection Info (SAVE THIS):"
echo "Host: ${SQL_SERVER_NAME}.database.windows.net"
echo "User: $SQL_ADMIN_USER"
echo "Pass: $SQL_ADMIN_PASSWORD"
echo "===================================================="
echo "Note: Head to GitHub Actions to watch the deployment build!"
