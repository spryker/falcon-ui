<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\FalconUi;

use Spryker\FalconUi\DependencyInjection\Compiler\FalconUiServicesCompilerPass;
use Symfony\Component\DependencyInjection\Compiler\PassConfig;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

/**
 * FalconUI Bundle
 *
 * Provides Angular-based composable backoffice UI components with YAML-driven configuration.
 */
class SprykerFalconUiBundle extends Bundle
{
    public function build(ContainerBuilder $container): void
    {
        parent::build($container);

        $container->addCompilerPass(
            new FalconUiServicesCompilerPass(),
            PassConfig::TYPE_BEFORE_OPTIMIZATION,
            50,
        );
    }
}
