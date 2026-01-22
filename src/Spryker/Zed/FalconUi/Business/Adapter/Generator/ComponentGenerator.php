<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Generator;

use Spryker\Zed\ComposableBackofficeUi\Business\Adapter\GeneratorInterface;

class ComponentGenerator implements GeneratorInterface
{
    public function generate(array $config): array
    {
        $components = [];

        $components += $this->generateLayoutComponent($config);
        $components += $this->generateHeadlines($config);
        $components += $this->generateActions($config);

        return $components;
    }

    /**
     * @param array<string, mixed> $config
     *
     * @return array<string, mixed>
     */
    protected function generateLayoutComponent(array $config): array
    {
        $entityName = $config['entity'];
        $entityKey = strtolower($entityName);

        return [
            "layout.{$entityKey}.page" => [
                'id' => 'page-layout',
                'virtualRoute' => 'root',
                'qa' => "test-{$entityKey}-page",
                'component' => 'LayoutComponent',
                'attrs' => [
                    'data-layout-type' => 'main',
                    'aria-label' => 'Dynamic layout root',
                ],
                'className' => 'page-layout dark',
                'slots' => [
                    'actions' => [
                        ['use' => "action.{$entityKey}.create"],
                    ],
                    'content' => [
                        ['use' => "table.{$entityKey}.list"],
                    ],
                ],
            ],
        ];
    }

    /**
     * @param array<string, mixed> $config
     *
     * @return array<string, mixed>
     */
    protected function generateHeadlines(array $config): array
    {
        $entityName = $config['entity'];
        $entityKey = strtolower($entityName);
        $identifierField = $this->getIdentifierField($config);

        return [
            "headline.{$entityKey}.create" => [
                'component' => 'HeadlineComponent',
                'style' => [
                    'background-color' => 'var(--spy-white)',
                    'padding' => '15px 30px',
                ],
                'slots' => [
                    ['content' => "Create New {$entityName}"],
                ],
                'inputs' => [
                    'level' => 'h3',
                ],
            ],
            "headline.{$entityKey}.edit" => [
                'component' => 'HeadlineComponent',
                'style' => [
                    'background-color' => 'var(--spy-white)',
                    'padding' => '15px 30px',
                ],
                'slots' => [
                    ['content' => "Update \${row.{$identifierField}} {$entityName}"],
                    [
                        'slot' => 'actions',
                        'use' => "form.{$entityKey}.delete",
                    ],
                ],
                'inputs' => [
                    'level' => 'h3',
                ],
            ],
        ];
    }

    /**
     * @param array<string, mixed> $config
     *
     * @return array<string, mixed>
     */
    protected function generateActions(array $config): array
    {
        $entityName = $config['entity'];
        $entityKey = strtolower($entityName);

        return [
            "action.{$entityKey}.create" => [
                'component' => 'ButtonActionComponent',
                'slots' => [
                    ['content' => "Create {$entityName}"],
                ],
                'inputs' => [
                    'action' => [
                        'type' => 'drawer',
                        'component' => 'component-builder',
                        'options' => [
                            'inputs' => [
                                'configuration' => [
                                    ['use' => "headline.{$entityKey}.create"],
                                    ['use' => "form.{$entityKey}.create"],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * @param array<string, mixed> $config
     */
    protected function getIdentifierField(array $config): string
    {
        foreach ($config['fields'] ?? [] as $name => $field) {
            if (stripos($name, 'reference') !== false || stripos($name, 'id') !== false) {
                return $name;
            }
        }

        return strtolower($config['entity']) . 'Reference';
    }
}
