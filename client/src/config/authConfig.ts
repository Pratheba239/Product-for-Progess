import { Configuration, LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation. 
 */
export const msalConfig: Configuration = {
    auth: {
        clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || "PLACEHOLDER", // Client ID of the App Registration
        authority: process.env.NEXT_PUBLIC_AZURE_AD_AUTHORITY || "https://login.microsoftonline.com/common", // Authority URL
        redirectUri: "/", // Points to window.location.origin. You must register this URI on Azure Portal/App Registration.
        postLogoutRedirectUri: "/",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            }
        }
    }
};

/**
 * Scopes you add here will be prompted for user consent during login.
 */
export const loginRequest = {
    scopes: ["User.Read"]
};

/**
 * Add here the endpoints and scopes when obtaining an access token for a protected resource.
 */
export const tokenRequest = {
    scopes: ["User.Read"]
};
