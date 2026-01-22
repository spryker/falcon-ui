<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Communication\Plugin\Twig;

use Spryker\Service\Container\ContainerInterface;
use Spryker\Shared\TwigExtension\Dependency\Plugin\TwigPluginInterface;
use Spryker\Zed\Kernel\Communication\AbstractPlugin;
use Twig\Environment;
use Twig\TwigFunction;

/**
 * @method \Spryker\Zed\FalconUi\FalconUiConfig getConfig()
 */
class FalconUiConfigTwigPlugin extends AbstractPlugin implements TwigPluginInterface
{
    protected const FUNCTION_FALCON_UI_CONFIG = 'falconUiConfig';

    /**
     * {@inheritDoc}
     * - Registers the `falconUiConfig` Twig function.
     *
     * @api
     */
    public function extend(Environment $twig, ContainerInterface $container): Environment
    {
        $twig->addFunction($this->createFalconUiConfigFunction());

        return $twig;
    }

    protected function createFalconUiConfigFunction(): TwigFunction
    {
        return new TwigFunction(
            static::FUNCTION_FALCON_UI_CONFIG,
            function (): array {
                return [
                    'apiUrl' => $this->getConfig()->getSprykerFeaturesApiUrl(),
                    'apiPlatformUrl' => $this->getConfig()->getGlueBackendApiUrl(),
                    'authTokenUrl' => '/falcon-ui/api-login',
                ];
            },
        );
    }
}
