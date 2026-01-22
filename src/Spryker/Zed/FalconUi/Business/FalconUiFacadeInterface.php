<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business;

use Generated\Shared\Transfer\AccessTokenResponseTransfer;

interface FalconUiFacadeInterface
{
    /**
     * Specification:
     * - Retrieves access token for the current authenticated Backoffice user.
     * - Uses the user's credentials to authenticate against Glue Backend API.
     * - Returns AccessTokenResponseTransfer with token data or error.
     *
     * @api
     */
    public function getAccessToken(): AccessTokenResponseTransfer;
}
