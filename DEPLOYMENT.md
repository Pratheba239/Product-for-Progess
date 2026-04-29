# PP Platform — Azure Deployment Checklist

Before the CI/CD pipeline can succeed, you must configure the following secrets and environment variables.

---

## Step 1: GitHub Repository Secrets

Go to: **GitHub → Your Repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Deployment token for Azure Static Web Apps | Azure Portal → Static Web Apps → your app → **Manage deployment token** |
| `AZURE_CREDENTIALS` | Service principal JSON for `azure/login` action | Run: `az ad sp create-for-rbac --name "pp-github-deploy" --sdk-auth --role contributor --scopes /subscriptions/<YOUR_SUB_ID>` |
| `AZURE_APP_SERVICE_NAME` | Name of your backend App Service | e.g., `pp-backend-api` (just the name, not the full URL) |
| `NEXT_PUBLIC_API_URL` | Full URL to the backend API | e.g., `https://pp-backend-api.azurewebsites.net/api` |
| `NEXT_PUBLIC_AZURE_AD_CLIENT_ID` | Azure AD app client ID for frontend auth | Azure Portal → Entra ID → App Registrations → your frontend app → Application (client) ID |
| `NEXT_PUBLIC_AZURE_AD_AUTHORITY` | Azure AD authority URL | e.g., `https://login.microsoftonline.com/<YOUR_TENANT_ID>` |

---

## Step 2: Azure App Service Environment Variables

Go to: **Azure Portal → App Service → your backend app → Configuration → Application settings**

Click **+ New application setting** for each:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `FRONTEND_URL` | Your Static Web App URL, e.g., `https://yellow-rock-123.azurestaticapps.net` |
| `DB_HOST` | `<your-sql-server>.database.windows.net` |
| `DB_USER` | Your SQL admin username |
| `DB_PASSWORD` | Your SQL admin password |
| `DB_NAME` | `ppdb` |
| `AZURE_AD_CLIENT_ID` | Backend App Registration client ID |
| `AZURE_AD_TENANT_ID` | Your Azure tenant ID |
| `AZURE_AD_ISSUER` | `https://login.microsoftonline.com/<TENANT_ID>/v2.0` |
| `AZURE_AD_JWKS_URL` | `https://login.microsoftonline.com/<TENANT_ID>/discovery/v2.0/keys` |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | (Optional) From Application Insights resource |
| `AZURE_STORAGE_CONNECTION_STRING` | (Optional) From Storage Account |
| `AZURE_STORAGE_CONTAINER_NAME` | `documents` |

> **After adding all settings, click Save and then Restart the App Service.**

---

## Step 3: Trigger the Deployment

Push any change to `main` branch — the unified `azure-deploy.yml` workflow will handle everything:

```bash
git add .
git commit -m "fix: unified Azure deployment pipeline"
git push origin main
```

Watch progress at: **GitHub → Actions tab**

---

## Step 4: Verify

1. **Backend health check:**
   ```
   curl https://<your-app-service>.azurewebsites.net/api/health
   # Expected: {"status":"healthy","version":"1.0.0"}
   ```

2. **Frontend:** Open your Static Web App URL in the browser. The dashboard should load.

3. **API connectivity:** Open browser DevTools → Network tab → Reload the page. Confirm API calls go to `https://<your-backend>.azurewebsites.net/api/...` with `200` responses (not `localhost`).
