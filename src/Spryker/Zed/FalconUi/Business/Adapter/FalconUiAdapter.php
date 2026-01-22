<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter;

use Spryker\Zed\ComposableBackofficeUi\Business\Adapter\AdapterInterface;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\ComponentGenerator;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\FieldGenerator;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\FormGenerator;
use Spryker\Zed\FalconUi\Business\Adapter\Generator\TableGenerator;
use Spryker\Zed\FalconUi\Business\Adapter\Normalizer\ConfigNormalizer;
use Spryker\Zed\FalconUi\Business\Adapter\Resolver\ComponentResolver;

class FalconUiAdapter implements AdapterInterface
{
    public function __construct(
        protected ConfigNormalizer $normalizer,
        protected FieldGenerator $fieldGenerator,
        protected FormGenerator $formGenerator,
        protected TableGenerator $tableGenerator,
        protected ComponentGenerator $componentGenerator,
        protected ComponentResolver $componentResolver,
    ) {
    }

    public function getName(): string
    {
        return 'falcon-ui';
    }

    public function adapt(array $config): array
    {
        return ($config['ui']['mode'] ?? 'crud') === 'custom'
            ? $this->adaptCustomConfig($config)
            : $this->adaptCrudConfig($config);
    }

    /**
     * Adapts custom mode config - user defines all components manually.
     * Only normalizes the simplified syntax to FalconUI format.
     *
     * @param array<string, mixed> $config
     *
     * @return array<string, mixed>
     */
    protected function adaptCustomConfig(array $config): array
    {
        $entityName = $config['entity'];
        $components = $config['view']['components'] ?? [];

        $normalizedComponents = $this->normalizer->normalizeComponents($components, $entityName);
        $layout = $this->resolveLayout($config);
        $viewRoot = $this->componentResolver->buildViewRoot($layout, $normalizedComponents);

        return [
            'entity' => $entityName,
            'navigation' => $config['navigation'] ?? ['title' => $entityName],
            'view' => [
                'layout' => $layout,
                'components' => $normalizedComponents,
                'root' => $viewRoot,
            ],
        ];
    }

    /**
     * Adapts CRUD mode config - generates standard CRUD components from fields.
     *
     * @param array<string, mixed> $config
     *
     * @return array<string, mixed>
     */
    protected function adaptCrudConfig(array $config): array
    {
        $entityName = $config['entity'];

        $generatedComponents = $this->generateCrudComponents($config);
        $normalizedUserComponents = $this->normalizer->normalizeComponents(
            $config['view']['components'] ?? [],
            $entityName,
        );

        $mergedComponents = $this->mergeComponents($generatedComponents, $normalizedUserComponents);
        $layout = $this->resolveLayout($config);
        $viewRoot = $this->componentResolver->buildViewRoot($layout, $mergedComponents);

        return [
            'entity' => $entityName,
            'navigation' => $config['navigation'] ?? ['title' => $entityName],
            'fields' => $config['fields'],
            'api' => $config['api'] ?? [],
            'view' => [
                'layout' => $layout,
                'components' => $mergedComponents,
                'root' => $viewRoot,
            ],
        ];
    }

    /**
     * Generates all CRUD components: layouts, headlines, actions, fields, forms, tables.
     *
     * @param array<string, mixed> $config
     *
     * @return array<string, mixed>
     */
    protected function generateCrudComponents(array $config): array
    {
        $components = [];

        $components += $this->componentGenerator->generate($config);
        $components += $this->fieldGenerator->generate($config);
        $components += $this->formGenerator->generate($config);
        $components += $this->tableGenerator->generate($config);

        return $components;
    }

    /**
     * Resolves layout configuration. Uses custom layout if provided, otherwise generates default.
     *
     * @param array<string, mixed> $config
     *
     * @return array<string, mixed>
     */
    protected function resolveLayout(array $config): array
    {
        $use = $config['view']['layout']['use'] ?? null;

        if ($use !== null) {
            return ['use' => is_array($use) ? $use : [$use]];
        }

        $entityKey = strtolower($config['entity']);

        return ['use' => ["layout.{$entityKey}.page"]];
    }

    /**
     * Merges generated components with user-defined overrides.
     * User components take precedence and are merged recursively.
     *
     * @param array<string, mixed> $generated
     * @param array<string, mixed> $user
     *
     * @return array<string, mixed>
     */
    protected function mergeComponents(array $generated, array $user): array
    {
        foreach ($user as $key => $value) {
            $generated[$key] = $this->mergeValue($generated[$key] ?? null, $value);
        }

        return $generated;
    }

    /**
     * Merges existing value with new override.
     * Scalars, nulls, and indexed arrays are replaced. Associative arrays are merged recursively.
     */
    protected function mergeValue(mixed $existing, mixed $new): mixed
    {
        // Non-arrays or indexed arrays replacing
        if (!is_array($new) || !is_array($existing) || $this->isIndexedArray($existing)) {
            return $new;
        }

        // Associative arrays - merge recursively
        return $this->mergeComponents($existing, $new);
    }

    /**
     * Checks if array is indexed (sequential numeric keys starting from 0).
     *
     * @param array<mixed> $array
     *
     * @return bool
     */
    protected function isIndexedArray(array $array): bool
    {
        return !$array || array_keys($array) === range(0, count($array) - 1);
    }
}
