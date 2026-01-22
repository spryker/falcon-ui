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

        $controls = $component['fields'] ?? $component['inputs']['config']['controls'] ?? [];
        $submit = $component['submit'] ?? $component['inputs']['config']['submit'] ?? [];

        // For edit forms, add value overrides from row data
        if ($this->isEditForm($key)) {
            $controls = $this->addValueOverrides($controls);
        }

        $normalized['inputs'] = [
            'config' => [
                'controls' => $controls,
                'submit' => $this->normalizeSubmit($key, $submit, $entityName),
            ],
        ];

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

        $normalized = [
            'label' => $submit['label'] ?? 'Submit',
            'method' => $submit['method'] ?? $this->detectMethod($formKey),
            'url' => $submit['url'] ?? '',
        ];

        if (isset($submit['variant'])) {
            $normalized['variant'] = $submit['variant'];
        }

        // Delete forms should have active button by default (no validation needed)
        if (isset($submit['active'])) {
            $normalized['active'] = $submit['active'];
        } elseif ($this->isDeleteForm($formKey)) {
            $normalized['active'] = true;
        }

        $normalized['actions'] = $submit['actions'] ?? $this->actionsBuilder->buildSuccessActions($entityKey, $submit['success'] ?? null);
        $normalized['errorActions'] = $submit['errorActions'] ?? $this->actionsBuilder->buildErrorActions($entityKey, $submit['error'] ?? null);

        return $normalized;
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
