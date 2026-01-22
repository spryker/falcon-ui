<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Normalizer;

use Spryker\Zed\FalconUi\Business\Adapter\Generator\FieldGenerator;

/**
 * Normalizes simplified field syntax to FalconUI format.
 * Delegates to FieldGenerator to avoid code duplication.
 */
class FieldNormalizer implements ComponentNormalizerInterface
{
    protected FieldGenerator $fieldGenerator;

    public function __construct(?FieldGenerator $fieldGenerator = null)
    {
        $this->fieldGenerator = $fieldGenerator ?? new FieldGenerator();
    }

    /**
     * @param array<string, mixed> $component
     */
    public function supports(string $key, array $component): bool
    {
        return str_starts_with($key, 'field.');
    }

    /**
     * @param array<string, mixed> $component
     *
     * @return array<string, mixed>
     */
    public function normalize(string $key, array $component, string $entityName): array
    {
        $fieldName = $this->extractFieldName($key);

        // Use name from component if provided, otherwise extract from key
        $config = $component;
        if (!isset($config['name'])) {
            $config['name'] = $fieldName;
        }

        $normalized = $this->fieldGenerator->generateField($config['name'], $config);

        return $this->mergePassthroughProperties($normalized, $component);
    }

    /**
     * @param array<string, mixed> $normalized
     * @param array<string, mixed> $component
     *
     * @return array<string, mixed>
     */
    protected function mergePassthroughProperties(array $normalized, array $component): array
    {
        $skipKeys = ['type', 'required', 'readonly', 'name', 'label', 'validators', 'datasource'];

        foreach ($component as $key => $value) {
            if (!isset($normalized[$key]) && !in_array($key, $skipKeys, true)) {
                $normalized[$key] = $value;
            }
        }

        return $normalized;
    }

    protected function extractFieldName(string $key): string
    {
        $parts = explode('.', $key);

        return end($parts) ?: '';
    }
}
