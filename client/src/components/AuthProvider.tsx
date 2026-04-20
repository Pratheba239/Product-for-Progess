"use client";

import React, { ReactNode } from "react";
import { PublicClientApplication, EventType, AuthenticationResult } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "../config/authConfig";

/**
 * Initialize MSAL client
 */
export const msalInstance = new PublicClientApplication(msalConfig);

// Set default account if already signed in
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
}

// Optional: Listen for login success events
msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult;
        const account = payload.account;
        msalInstance.setActiveAccount(account);
    }
});

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    return (
        <MsalProvider instance={msalInstance}>
            {children}
        </MsalProvider>
    );
}
