<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Normalizer;

interface ComponentNormalizerInterface
{
    /**
     * Checks if this normalizer supports the given component.
     *
     * @param array<string, mixed> $component
     */
    public function supports(string $key, array $component): bool;

    /**
     * Normalizes the component from simplified YAML to FalconUI format.
     *
     * @param array<string, mixed> $component
     *
     * @return array<string, mixed>
     */
    public function normalize(string $key, array $component, string $entityName): array;
}
