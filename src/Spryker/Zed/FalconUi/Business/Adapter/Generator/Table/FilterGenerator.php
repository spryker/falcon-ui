<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Generator\Table;

class FilterGenerator
{
    /**
     * @param array<string, mixed> $fields
     *
     * @return array<string, mixed>
     */
    public function generate(array $fields): array
    {
        $filterableFields = $this->getFilterableFields($fields);

        if (!$filterableFields) {
            return ['enabled' => false];
        }

        $items = [];
        foreach ($filterableFields as $fieldName => $field) {
            $items[] = $this->generateFilter($fieldName, $field);
        }

        return [
            'enabled' => true,
            'items' => $items,
        ];
    }

    /**
     * @param array<string, mixed> $field
     *
     * @return array<string, mixed>
     */
    protected function generateFilter(string $fieldName, array $field): array
    {
        $filter = [
            'id' => $fieldName,
            'title' => $field['label'] ?? ucfirst($fieldName),
        ];

        $fieldType = $field['type'] ?? 'string';

        return match ($fieldType) {
            'select' => $filter + [
                'type' => 'select',
                'typeOptions' => [
                    'multiselect' => false,
                    'datasource' => $this->normalizeDatasource($field['datasource'] ?? []),
                ],
            ],
            'date' => $filter + ['type' => 'date-range'],
            default => $filter,
        };
    }

    /**
     * @param array<string, mixed> $datasource
     *
     * @return array<string, mixed>
     */
    protected function normalizeDatasource(array $datasource): array
    {
        if (!$datasource) {
            return [];
        }

        return [
            'type' => $datasource['type'] ?? 'http',
            'url' => $datasource['url'] ?? '',
            'valueField' => $datasource['valueField'] ?? 'value',
            'titleField' => $datasource['titleField'] ?? 'title',
        ];
    }

    /**
     * @param array<string, mixed> $fields
     *
     * @return array<string, mixed>
     */
    protected function getFilterableFields(array $fields): array
    {
        return array_filter(
            $fields,
            fn ($field) => is_array($field) && ($field['filterable'] ?? false),
        );
    }
}
