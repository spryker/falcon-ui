<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Generator\Table;

class ColumnGenerator
{
    /**
     * @param array<string> $columnNames
     * @param array<string, mixed> $fields
     *
     * @return array<array<string, mixed>>
     */
    public function generate(array $columnNames, array $fields): array
    {
        return array_map(
            fn ($name) => $this->generateColumn($name, $fields[$name] ?? []),
            $columnNames,
        );
    }

    /**
     * @param array<string, mixed> $field
     *
     * @return array<string, mixed>
     */
    protected function generateColumn(string $name, array $field): array
    {
        $column = [
            'id' => $name,
            'title' => $field['label'] ?? ucfirst($name),
        ];

        $fieldType = $field['type'] ?? 'string';

        if ($fieldType === 'date') {
            $column['type'] = 'date';
            $column['typeOptions'] = [
                'format' => $field['format'] ?? 'dd.MM.y',
            ];
        }

        if ($field['readonly'] ?? false) {
            $column['editable'] = false;
        }

        return $column;
    }
}
