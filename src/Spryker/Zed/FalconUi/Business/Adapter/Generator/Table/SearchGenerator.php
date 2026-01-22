<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Generator\Table;

class SearchGenerator
{
    /**
     * @param array<string, mixed> $fields
     * @param array<string, mixed> $listConfig
     *
     * @return array<string, mixed>
     */
    public function generate(array $fields, string $entityName, array $listConfig): array
    {
        $searchableFields = $this->getSearchableFields($fields);

        if (!$searchableFields) {
            return ['enabled' => false];
        }

        return [
            'enabled' => true,
            'placeholder' => $listConfig['search']['placeholder'] ?? "Search {$entityName}...",
        ];
    }

    /**
     * @param array<string, mixed> $fields
     *
     * @return array<string>
     */
    protected function getSearchableFields(array $fields): array
    {
        return array_keys(array_filter($fields, fn ($field) => $field['searchable'] ?? false));
    }
}
