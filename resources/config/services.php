<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Spryker\Client\Session\SessionClient;
use Spryker\Client\Session\SessionClientInterface;
use Spryker\Zed\FalconUi\Business\AccessToken\SessionAccessTokenReader;
use Spryker\Zed\FalconUi\Business\AccessToken\SessionAccessTokenReaderInterface;
use Spryker\Zed\FalconUi\Business\Adapter\FalconUiAdapter;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\ComponentGenerator;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\FieldGenerator;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\FormActionsBuilder;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\FormGenerator;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\TableGenerator;
use Spryker\Zed\FalconUi\Business\Adapter\Normalizer\ConfigNormalizer;
use Spryker\Zed\FalconUi\Business\Adapter\Normalizer\FieldNormalizer;
use Spryker\Zed\FalconUi\Business\Adapter\Normalizer\FormNormalizer;
use Spryker\Zed\FalconUi\Business\Adapter\Normalizer\TableNormalizer;
use Spryker\Zed\FalconUi\Business\Adapter\Resolver\ComponentResolver;
use Spryker\Zed\Oauth\Business\OauthFacade;
use Spryker\Zed\Oauth\Business\OauthFacadeInterface;

return static function (ContainerConfigurator $container): void {
    $services = $container->services()
        ->defaults()
        ->autowire()
        ->autoconfigure();

    $services->set(SessionClientInterface::class, SessionClient::class)
        ->public();

    $services->set(OauthFacadeInterface::class, OauthFacade::class)
        ->public();

    $services->set(SessionAccessTokenReaderInterface::class, SessionAccessTokenReader::class)
        ->public();

    $services->set(FormActionsBuilder::class, FormActionsBuilder::class);

    // Generators
    $services->set(ComponentGenerator::class, ComponentGenerator::class);
    $services->set(FieldGenerator::class, FieldGenerator::class);
    $services->set(FormGenerator::class, FormGenerator::class);
    $services->set(TableGenerator::class, TableGenerator::class);

    // Normalizers
    $services->set(FieldNormalizer::class, FieldNormalizer::class);
    $services->set(FormNormalizer::class, FormNormalizer::class);
    $services->set(TableNormalizer::class, TableNormalizer::class);
    $services->set(ConfigNormalizer::class, ConfigNormalizer::class);

    $services->set(ComponentResolver::class, ComponentResolver::class);

    $services->set(FalconUiAdapter::class, FalconUiAdapter::class)
        ->tag('composable_backoffice_ui.adapter')
        ->public();
};
