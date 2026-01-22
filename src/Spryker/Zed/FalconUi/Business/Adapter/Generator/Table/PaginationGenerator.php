<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Generator\Table;

class PaginationGenerator
{
    protected const DEFAULT_SIZES = [5, 10, 20];

    /**
     * @param array<string, mixed> $listConfig
     *
     * @return array<string, mixed>
     */
    public function generate(array $listConfig): array
    {
        $sizes = $listConfig['pagination']['sizes'] ?? static::DEFAULT_SIZES;

        return ['sizes' => $sizes];
    }
}
