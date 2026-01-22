<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi;

use Spryker\Shared\FalconUi\FalconUiConstants;
use Spryker\Zed\Kernel\AbstractBundleConfig;

class FalconUiConfig extends AbstractBundleConfig
{
    /**
     * Specification:
     * - Returns the Glue Backend API URL for Falcon UI.
     *
     * @api
     */
    public function getGlueBackendApiUrl(): string
    {
        return $this->get(FalconUiConstants::GLUE_BACKEND_API_DOMAIN);
    }

    /**
     * Specification:
     * - Returns the Spryker Features API URL.
     *
     * @api
     */
    public function getSprykerFeaturesApiUrl(): string
    {
        return $this->getGlueBackendApiUrl() . '/spryker-features';
    }
}
