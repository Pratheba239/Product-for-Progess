import type { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

// Extending express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

/**
 * Authentication Middleware for Microsoft Entra External ID
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    // In local development, we allow requests to pass with a default user if configured
    if (process.env.NODE_ENV !== 'production' && process.env.SKIP_AUTH === 'true') {
        req.user = { sub: 'mock-user-id', name: 'Mock User' };
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'AUTHENTICATION_REQUIRED' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        if (!process.env.AZURE_AD_JWKS_URL) {
            throw new Error('AZURE_AD_JWKS_URL not configured');
        }

        const JWKS = createRemoteJWKSet(new URL(process.env.AZURE_AD_JWKS_URL));
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: process.env.AZURE_AD_ISSUER,
            audience: process.env.AZURE_AD_CLIENT_ID,
        });

        req.user = payload;
        next();
    } catch (error: any) {
        console.error('Authentication Error:', error.message);
        return res.status(401).json({ error: 'INVALID_TOKEN', message: error.message });
    }
};
