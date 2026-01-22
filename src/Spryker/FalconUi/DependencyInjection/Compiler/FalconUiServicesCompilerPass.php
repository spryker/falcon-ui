<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\FalconUi\DependencyInjection\Compiler;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\PhpFileLoader;

/**
 * Registers FalconUI services from services.php configuration.
 */
class FalconUiServicesCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        $loader = new PhpFileLoader($container, new FileLocator(__DIR__ . '/../../../../../resources/config'));
        $loader->load('services.php');
    }
}
