<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Normalizer;

/**
 * Normalizes simplified table syntax to FalconUI format.
 *
 * Simplified:
 *   dataSource:
 *     url: '/customers'
 *   columns: [...]
 *   pagination: [5, 10, 20]
 *   search: 'Search customers...'
 *
 * FalconUI:
 *   inputs:
 *     config:
 *       dataSource: { type: 'http', url: '/customers' }
 *       columns: [...]
 *       pagination: { sizes: [5, 10, 20] }
 *       search: { enabled: true, placeholder: '...' }
 */
class TableNormalizer implements ComponentNormalizerInterface
{
    /**
     * @param array<string, mixed> $component
     */
    public function supports(string $key, array $component): bool
    {
        return str_starts_with($key, 'table.') || ($component['component'] ?? '') === 'TableComponent';
    }

    /**
     * @param array<string, mixed> $component
     *
     * @return array<string, mixed>
     */
    public function normalize(string $key, array $component, string $entityName): array
    {
        $normalized = ['component' => 'TableComponent'];

        if (isset($component['id'])) {
            $normalized['id'] = $component['id'];
        }

        $normalized['inputs'] = ['config' => $this->buildConfig($component)];

        return $normalized;
    }

    /**
     * @param array<string, mixed> $component
     *
     * @return array<string, mixed>
     */
    protected function buildConfig(array $component): array
    {
        $existingConfig = $component['inputs']['config'] ?? [];

        // Build config from user-defined values, falling back to existing config
        // User-defined values will override generated ones during merge
        $config = [];

        // Only add dataSource if user explicitly defines it (to preserve generated URL)
        if (isset($component['dataSource'])) {
            $config['dataSource'] = $this->normalizeDataSource($component['dataSource']);
        }

        // Only add columns if user explicitly defines them (to preserve generated columns)
        if (isset($component['columns'])) {
            $config['columns'] = $this->normalizeColumns($component['columns']);
        }

        // Add other keys if defined - these ARE meant to override
        if (isset($component['filters'])) {
            $config['filters'] = $this->normalizeFilters($component['filters']);
        }

        if (isset($component['pagination'])) {
            $config['pagination'] = $this->normalizePagination($component['pagination']);
        }

        if (isset($component['search'])) {
            $config['search'] = $this->normalizeSearch($component['search']);
        }

        if (isset($component['rowClick'])) {
            $config['rowActions'] = $this->normalizeRowActions($component['rowClick']);
        }

        return $config;
    }

    /**
     * @param array<string, mixed> $dataSource
     *
     * @return array<string, mixed>
     */
    protected function normalizeDataSource(array $dataSource): array
    {
        $normalized = [
            'type' => $dataSource['type'] ?? 'http',
        ];

        // Only include URL if explicitly provided, otherwise let merge preserve generated URL
        if (isset($dataSource['url'])) {
            $normalized['url'] = $dataSource['url'];
        }

        return $normalized;
    }

    /**
     * @param array<mixed> $columns
     *
     * @return array<array<string, mixed>>
     */
    protected function normalizeColumns(array $columns): array
    {
        return array_map(function ($column) {
            if (!is_array($column)) {
                return ['id' => $column, 'title' => ucfirst($column)];
            }

            $normalized = [
                'id' => $column['id'],
                'title' => $column['title'] ?? ucfirst($column['id']),
            ];

            if (isset($column['type'])) {
                $normalized['type'] = $column['type'];
                if (isset($column['format'])) {
                    $normalized['typeOptions'] = ['format' => $column['format']];
                }
            }

            return $normalized;
        }, $columns);
    }

    /**
     * @param array<array<string, mixed>> $filters
     *
     * @return array<string, mixed>
     */
    protected function normalizeFilters(array $filters): array
    {
        if (!$filters) {
            return ['enabled' => false];
        }

        $items = array_map(function ($filter) {
            $normalized = [
                'id' => $filter['id'],
                'title' => $filter['title'] ?? ucfirst($filter['id']),
            ];

            if (isset($filter['type'])) {
                $normalized['type'] = $filter['type'];

                if ($filter['type'] === 'select' && isset($filter['datasource'])) {
                    $normalized['typeOptions'] = [
                        'multiselect' => false,
                        'datasource' => [
                            'type' => $filter['datasource']['type'] ?? 'http',
                            'url' => $filter['datasource']['url'] ?? '',
                            'valueField' => $filter['datasource']['valueField'] ?? 'value',
                            'titleField' => $filter['datasource']['titleField'] ?? 'title',
                        ],
                    ];
                }
            }

            return $normalized;
        }, $filters);

        return [
            'enabled' => true,
            'items' => $items,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function normalizePagination(mixed $pagination): array
    {
        $defaultSizes = [5, 10, 20];

        if ($pagination === null) {
            return ['sizes' => $defaultSizes];
        }

        if (is_array($pagination)) {
            return isset($pagination['sizes']) ? $pagination : ['sizes' => $pagination];
        }

        return ['sizes' => $defaultSizes];
    }

    /**
     * @return array<string, mixed>
     */
    protected function normalizeSearch(mixed $search): array
    {
        if ($search === null) {
            return ['enabled' => false];
        }

        if (is_string($search)) {
            return ['enabled' => true, 'placeholder' => $search];
        }

        if (is_array($search)) {
            return [
                'enabled' => $search['enabled'] ?? true,
                'placeholder' => $search['placeholder'] ?? 'Search...',
            ];
        }

        return ['enabled' => false];
    }

    /**
     * @return array<string, mixed>
     */
    protected function normalizeRowActions(mixed $rowActions): array
    {
        if ($rowActions === null) {
            return ['enabled' => false];
        }

        if (!isset($rowActions['drawer'])) {
            return $rowActions;
        }

        return [
            'enabled' => true,
            'click' => 'edit-drawer',
            'actions' => [$this->buildDrawerAction($rowActions['drawer'])],
        ];
    }

    /**
     * @param array<array<string, mixed>> $configuration
     *
     * @return array<string, mixed>
     */
    protected function buildDrawerAction(array $configuration): array
    {
        return [
            'id' => 'edit-drawer',
            'title' => 'Edit',
            'type' => 'drawer',
            'component' => 'component-builder',
            'options' => [
                'inputs' => ['configuration' => $configuration],
            ],
        ];
    }
}
