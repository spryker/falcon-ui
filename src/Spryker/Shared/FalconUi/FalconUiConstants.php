<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Shared\FalconUi;

/**
 * Declares global environment configuration keys. Do not use it for other class constants.
 */
interface FalconUiConstants
{
    /**
     * Specification:
     * - Contains the Glue Backend API URL for Falcon UI.
     *
     * @api
     *
     * @var string
     */
    public const GLUE_BACKEND_API_DOMAIN = 'FALCON_UI:GLUE_BACKEND_API_DOMAIN';
}
