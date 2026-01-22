<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business;

use Generated\Shared\Transfer\AccessTokenResponseTransfer;
use Spryker\Zed\FalconUi\Business\AccessToken\SessionAccessTokenReaderInterface;
use Spryker\Zed\Kernel\Business\AbstractFacade;

class FalconUiFacade extends AbstractFacade implements FalconUiFacadeInterface
{
    /**
     * {@inheritDoc}
     *
     * @api
     *
     * @return \Generated\Shared\Transfer\AccessTokenResponseTransfer
     */
    public function getAccessToken(): AccessTokenResponseTransfer
    {
        /** @var \Spryker\Zed\FalconUi\Business\AccessToken\SessionAccessTokenReaderInterface $sessionAccessTokenReader */
        $sessionAccessTokenReader = $this->getService(SessionAccessTokenReaderInterface::class);

        return $sessionAccessTokenReader->getAccessToken();
    }
}
