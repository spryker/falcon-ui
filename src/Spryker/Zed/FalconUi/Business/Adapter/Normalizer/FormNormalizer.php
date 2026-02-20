<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Normalizer;

use Spryker\Zed\FalconUi\Business\Adapter\Generator\FormActionsBuilder;

/**
 * Normalizes simplified form syntax to FalconUI format.
 * Delegates action building to FormActionsBuilder to avoid code duplication.
 */
class FormNormalizer implements ComponentNormalizerInterface
{
    protected FormActionsBuilder $actionsBuilder;

    public function __construct(?FormActionsBuilder $actionsBuilder = null)
    {
        $this->actionsBuilder = $actionsBuilder ?? new FormActionsBuilder();
    }

    /**
     * @param array<string, mixed> $component
     */
    public function supports(string $key, array $component): bool
    {
        return str_starts_with($key, 'form.') || ($component['component'] ?? '') === 'DynamicFormComponent';
    }

    /**
     * @param array<string, mixed> $component
     *
     * @return array<string, mixed>
     */
    public function normalize(string $key, array $component, string $entityName): array
    {
        $normalized = ['component' => 'DynamicFormComponent'];

        if (isset($component['style'])) {
            $normalized['style'] = $component['style'];
        }

        if (isset($component['slot'])) {
            $normalized['slot'] = $component['slot'];
        }

        $hasControls = isset($component['fields']) || isset($component['inputs']['config']['controls']);
        $hasSubmit = isset($component['submit']) || isset($component['inputs']['config']['submit']);

        // Build config only with provided values (partial override support)
        $config = [];

        if ($hasControls) {
            $controls = $component['fields'] ?? $component['inputs']['config']['controls'] ?? [];

            // For edit forms, add value overrides from row data
            if ($this->isEditForm($key)) {
                $controls = $this->addValueOverrides($controls);
            }

            $config['controls'] = $controls;
        }

        if ($hasSubmit) {
            $submit = $component['submit'] ?? $component['inputs']['config']['submit'] ?? [];
            $config['submit'] = $this->normalizeSubmit($key, $submit, $entityName);
        }

        if ($config !== []) {
            $normalized['inputs'] = ['config' => $config];
        }

        return $normalized;
    }

    protected function isEditForm(string $key): bool
    {
        return str_ends_with($key, '.edit');
    }

    protected function isDeleteForm(string $key): bool
    {
        return str_ends_with($key, '.delete');
    }

    /**
     * Adds value overrides for edit forms.
     * Extracts field name from use reference and maps to row data.
     *
     * @param array<array<string, mixed>> $controls
     *
     * @return array<array<string, mixed>>
     */
    protected function addValueOverrides(array $controls): array
    {
        return array_map(function ($control) {
            if (!isset($control['use']) || isset($control['overrides']['value'])) {
                return $control;
            }

            // Extract field name: field.customer.email -> email
            $fieldName = $this->extractFieldName($control['use']);
            $control['overrides']['value'] = '${row.' . $fieldName . '}';

            return $control;
        }, $controls);
    }

    protected function extractFieldName(string $useKey): string
    {
        $parts = explode('.', $useKey);

        return end($parts) ?: '';
    }

    /**
     * @param array<string, mixed> $submit
     *
     * @return array<string, mixed>
     */
    protected function normalizeSubmit(string $formKey, array $submit, string $entityName): array
    {
        $entityKey = strtolower($entityName);
        $normalized = [];

        // Only include values that are explicitly provided (partial override support)
        if (isset($submit['label'])) {
            $normalized['label'] = $submit['label'];
        }

        if (isset($submit['method'])) {
            $normalized['method'] = $submit['method'];
        }

        if (isset($submit['url'])) {
            $normalized['url'] = $submit['url'];
        }

        if (isset($submit['variant'])) {
            $normalized['variant'] = $submit['variant'];
        }

        if (isset($submit['active'])) {
            $normalized['active'] = $submit['active'];
        }

        $actions = $this->resolveActions($submit, $entityKey);
        $errorActions = $this->resolveErrorActions($submit, $entityKey);

        if ($actions !== null) {
            $normalized['actions'] = $actions;
        }

        if ($errorActions !== null) {
            $normalized['errorActions'] = $errorActions;
        }

        return $normalized;
    }

    /**
     * @param array<string, mixed> $submit
     *
     * @return array<mixed>|null
     */
    protected function resolveActions(array $submit, string $entityKey): ?array
    {
        if (isset($submit['success'])) {
            return $this->actionsBuilder->buildSuccessActions($entityKey, $submit['success']);
        }

        return $submit['actions'] ?? null;
    }

    /**
     * @param array<string, mixed> $submit
     *
     * @return array<mixed>|null
     */
    protected function resolveErrorActions(array $submit, string $entityKey): ?array
    {
        if (isset($submit['error'])) {
            return $this->actionsBuilder->buildErrorActions($entityKey, $submit['error']);
        }

        return $submit['errorActions'] ?? null;
    }

    /**
     * Detects HTTP method based on form key convention.
     *
     * form.customer.create → POST
     * form.customer.edit → PATCH
     * form.customer.delete → DELETE
     */
    protected function detectMethod(string $formKey): string
    {
        if (str_ends_with($formKey, '.delete')) {
            return 'DELETE';
        }

        if (str_ends_with($formKey, '.edit')) {
            return 'PATCH';
        }

        return 'POST';
    }
}
