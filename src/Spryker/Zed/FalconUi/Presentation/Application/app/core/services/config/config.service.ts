import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_at: string;
}

interface FalconUIConfig {
    apiUrl: string;
    apiPlatformUrl?: string;
    authTokenUrl?: string;
}

declare global {
    interface Window {
        FALCON_UI_CONFIG?: FalconUIConfig;
    }
}

interface TokenCache {
    token: string;
    expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
    private document = inject(DOCUMENT);
    private window = this.document.defaultView!;
    private tokenCache?: TokenCache;

    getConfig(): Required<FalconUIConfig> {
        const windowConfig = this.window.FALCON_UI_CONFIG;

        if (!windowConfig) {
            throw new Error('FALCON_UI_CONFIG is not defined on window object');
        }

        return {
            apiUrl: windowConfig.apiUrl,
            apiPlatformUrl: windowConfig.apiPlatformUrl || this.extractBackendUrl(windowConfig.apiUrl),
            authTokenUrl: windowConfig.authTokenUrl || '/falcon-ui/api-login',
        };
    }

    async getAccessToken(): Promise<string | null> {
        if (this.tokenCache && Date.now() < this.tokenCache.expiresAt - 60000) {
            return this.tokenCache.token;
        }

        try {
            const config = await this.getConfig();
            const response = await fetch(config.authTokenUrl, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('[ConfigService] Failed to fetch access token:', response.status);
                return null;
            }

            const data: TokenResponse = await response.json();

            this.tokenCache = {
                token: data.access_token,
                expiresAt: parseInt(data.expires_at, 10) * 1000,
            };

            return data.access_token;
        } catch (error) {
            console.error('[ConfigService] Error fetching access token:', error);
            return null;
        }
    }

    private extractBackendUrl(apiUrl: string): string {
        try {
            const url = new URL(apiUrl);
            return `${url.protocol}//${url.host}`;
        } catch {
            return '';
        }
    }
}
