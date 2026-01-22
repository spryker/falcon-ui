<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Generator;

use Spryker\Zed\ComposableBackofficeUi\Business\Adapter\GeneratorInterface;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\Table\ColumnGenerator;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\Table\FilterGenerator;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\Table\PaginationGenerator;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\Table\RowActionGenerator;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\Table\SearchGenerator;

class TableGenerator implements GeneratorInterface
{
    protected ColumnGenerator $columnGenerator;

    protected FilterGenerator $filterGenerator;

    protected SearchGenerator $searchGenerator;

    protected PaginationGenerator $paginationGenerator;

    protected RowActionGenerator $rowActionGenerator;

    public function __construct()
    {
        $this->columnGenerator = new ColumnGenerator();
        $this->filterGenerator = new FilterGenerator();
        $this->searchGenerator = new SearchGenerator();
        $this->paginationGenerator = new PaginationGenerator();
        $this->rowActionGenerator = new RowActionGenerator();
    }

    public function generate(array $config): array
    {
        $entityName = $config['entity'];
        $entityKey = strtolower($entityName);
        $listConfig = $config['ui']['list'] ?? [];
        $fields = $config['fields'] ?? [];

        $columns = $listConfig['columns'] ?? array_keys($fields);

        return [
            "table.{$entityKey}.list" => [
                'component' => 'TableComponent',
                'id' => $listConfig['id'] ?? "{$entityKey}-table",
                'inputs' => [
                    'config' => [
                        'dataSource' => [
                            'type' => 'http',
                            'url' => "/{$entityKey}s",
                        ],
                        'columns' => $this->columnGenerator->generate($columns, $fields),
                        'filters' => $this->filterGenerator->generate($fields),
                        'pagination' => $this->paginationGenerator->generate($listConfig),
                        'search' => $this->searchGenerator->generate($fields, $config['entity'], $listConfig),
                        'rowActions' => $this->rowActionGenerator->generate($config, $listConfig),
                    ],
                ],
            ],
        ];
    }
}
