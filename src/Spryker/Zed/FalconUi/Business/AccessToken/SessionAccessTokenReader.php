<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\AccessToken;

use Generated\Shared\Transfer\AccessTokenErrorTransfer;
use Generated\Shared\Transfer\AccessTokenResponseTransfer;
use Generated\Shared\Transfer\OauthRequestTransfer;
use Spryker\Client\Session\SessionClientInterface;
use Spryker\Zed\Oauth\Business\OauthFacadeInterface;

class SessionAccessTokenReader implements SessionAccessTokenReaderInterface
{
    protected const SESSION_KEY_ACCESS_TOKEN = 'ACCESS_TOKEN';

    protected const GRANT_TYPE_REFRESH_TOKEN = 'refresh_token';

    protected const TOKEN_REFRESH_THRESHOLD_SECONDS = 300; // 5 minutes

    public function __construct(
        protected SessionClientInterface $sessionClient,
        protected OauthFacadeInterface $oauthFacade,
    ) {
    }

    public function getAccessToken(): AccessTokenResponseTransfer
    {
        $tokenData = $this->sessionClient->get(static::SESSION_KEY_ACCESS_TOKEN);

        if ($tokenData === null) {
            return $this->createErrorResponse('No access token in session. Please re-login.');
        }

        // Check if token is expired
        if ($tokenData['expires_at'] < time()) {
            return $this->tryRefreshToken($tokenData);
        }

        // Check if token will expire soon - proactively refresh
        if ($tokenData['expires_at'] < time() + static::TOKEN_REFRESH_THRESHOLD_SECONDS) {
            $refreshResult = $this->tryRefreshToken($tokenData);
            if ($refreshResult->getIsSuccessful()) {
                return $refreshResult;
            }
            // If refresh failed but token is still valid, return current token
        }

        return (new AccessTokenResponseTransfer())
            ->setIsSuccessful(true)
            ->setAccessToken($tokenData['access_token'])
            ->setExpiresAt((string)$tokenData['expires_at']);
    }

    /**
     * @param array<string, mixed> $tokenData
     */
    protected function tryRefreshToken(array $tokenData): AccessTokenResponseTransfer
    {
        $refreshToken = $tokenData['refresh_token'] ?? null;

        if ($refreshToken === null) {
            return $this->createErrorResponse('No refresh token available. Please re-login.');
        }

        $oauthRequestTransfer = (new OauthRequestTransfer())
            ->setGrantType(static::GRANT_TYPE_REFRESH_TOKEN)
            ->setRefreshToken($refreshToken);

        $oauthResponseTransfer = $this->oauthFacade->processAccessTokenRequest($oauthRequestTransfer);

        if (!$oauthResponseTransfer->getIsValid()) {
            return $this->createErrorResponse('Failed to refresh token. Please re-login.');
        }

        // Update session with new tokens
        $newTokenData = [
            'access_token' => $oauthResponseTransfer->getAccessToken(),
            'refresh_token' => $oauthResponseTransfer->getRefreshToken(),
            'expires_at' => time() + (int)$oauthResponseTransfer->getExpiresIn(),
        ];
        $this->sessionClient->set(static::SESSION_KEY_ACCESS_TOKEN, $newTokenData);

        return (new AccessTokenResponseTransfer())
            ->setIsSuccessful(true)
            ->setAccessToken($newTokenData['access_token'])
            ->setExpiresAt((string)$newTokenData['expires_at']);
    }

    protected function createErrorResponse(string $errorMessage): AccessTokenResponseTransfer
    {
        return (new AccessTokenResponseTransfer())
            ->setIsSuccessful(false)
            ->setAccessTokenError(
                (new AccessTokenErrorTransfer())
                    ->setError('authentication_error')
                    ->setErrorDescription($errorMessage),
            );
    }
}
