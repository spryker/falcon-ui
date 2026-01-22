<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Communication\Controller;

use Spryker\Zed\Kernel\Communication\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * @method \Spryker\Zed\FalconUi\Business\FalconUiFacade getFacade()
 */
class ApiLoginController extends AbstractController
{
    public function indexAction(): JsonResponse
    {
        $accessTokenResponseTransfer = $this->getFacade()->getAccessToken();

        if (!$accessTokenResponseTransfer->getIsSuccessful()) {
            return $this->jsonResponse([
                'error' => $accessTokenResponseTransfer->getAccessTokenError()?->getError() ?? 'Authentication failed',
                'error_description' => $accessTokenResponseTransfer->getAccessTokenError()?->getErrorDescription() ?? 'Unable to generate access token',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->jsonResponse([
            'access_token' => $accessTokenResponseTransfer->getAccessToken(),
            'token_type' => 'Bearer',
            'expires_at' => $accessTokenResponseTransfer->getExpiresAt(),
        ], Response::HTTP_OK);
    }
}
