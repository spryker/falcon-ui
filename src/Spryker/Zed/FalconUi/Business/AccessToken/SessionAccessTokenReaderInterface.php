<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\AccessToken;

use Generated\Shared\Transfer\AccessTokenResponseTransfer;

interface SessionAccessTokenReaderInterface
{
    public function getAccessToken(): AccessTokenResponseTransfer;
}
