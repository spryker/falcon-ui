<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Generator\Table;

class RowActionGenerator
{
    /**
     * @param array<string, mixed> $config
     * @param array<string, mixed> $listConfig
     *
     * @return array<string, mixed>
     */
    public function generate(array $config, array $listConfig): array
    {
        if (($listConfig['rowAction'] ?? '') !== 'edit') {
            return ['enabled' => false];
        }

        $entityKey = strtolower($config['entity']);

        return [
            'enabled' => true,
            'click' => 'edit-drawer',
            'actions' => [
                [
                    'id' => 'edit-drawer',
                    'title' => 'Edit',
                    'type' => 'drawer',
                    'component' => 'component-builder',
                    'options' => [
                        'inputs' => [
                            'configuration' => [
                                ['use' => "headline.{$entityKey}.edit"],
                                ['use' => "form.{$entityKey}.edit"],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}
