<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Generator;

use Spryker\Zed\ComposableBackofficeUi\Business\Adapter\GeneratorInterface;

class FormGenerator implements GeneratorInterface
{
    protected const DEFAULT_FORM_STYLE = ['padding' => '30px'];

    protected FormActionsBuilder $actionsBuilder;

    public function __construct(?FormActionsBuilder $actionsBuilder = null)
    {
        $this->actionsBuilder = $actionsBuilder ?? new FormActionsBuilder();
    }

    public function generate(array $config): array
    {
        $components = [];

        if ($config['ui']['create']['enabled'] ?? true) {
            $components += $this->generateCreateForm($config);
        }

        if ($config['ui']['edit']['enabled'] ?? true) {
            $components += $this->generateEditForm($config);
        }

        if ($config['ui']['delete']['enabled'] ?? true) {
            $components += $this->generateDeleteForm($config);
        }

        return $components;
    }

    /**
     * @param array<string, mixed> $config
     *
     * @return array<string, mixed>
     */
    protected function generateCreateForm(array $config): array
    {
        $entityName = $config['entity'];
        $entityKey = strtolower($entityName);
        $createConfig = $config['ui']['create'] ?? [];
        $fields = $createConfig['fields'] ?? $this->getRequiredFields($config['fields'] ?? []);

        return [
            "form.{$entityKey}.create" => [
                'component' => $createConfig['component'] ?? 'DynamicFormComponent',
                'style' => $createConfig['style'] ?? static::DEFAULT_FORM_STYLE,
                'inputs' => [
                    'config' => [
                        'controls' => $this->mapFieldsToControls($fields, $entityKey),
                        'submit' => $this->buildSubmitConfig(
                            'create',
                            $createConfig,
                            $entityKey,
                            'POST',
                            "/{$entityKey}s",
                        ),
                    ],
                ],
            ],
        ];
    }

    /**
     * @param array<string, mixed> $config
     *
     * @return array<string, mixed>
     */
    protected function generateEditForm(array $config): array
    {
        $entityName = $config['entity'];
        $entityKey = strtolower($entityName);
        $editConfig = $config['ui']['edit'] ?? [];
        $fields = $editConfig['fields'] ?? $this->getEditableFields($config['fields'] ?? []);
        $identifierField = $this->getIdentifierField($config);

        return [
            "form.{$entityKey}.edit" => [
                'component' => $editConfig['component'] ?? 'DynamicFormComponent',
                'style' => $editConfig['style'] ?? static::DEFAULT_FORM_STYLE,
                'inputs' => [
                    'config' => [
                        'controls' => $this->mapFieldsToControlsWithValues($fields, $entityKey),
                        'submit' => $this->buildSubmitConfig(
                            'edit',
                            $editConfig,
                            $entityKey,
                            'PATCH',
                            "/{$entityKey}s/\${row.{$identifierField}}",
                        ),
                    ],
                ],
            ],
        ];
    }

    /**
     * @param array<string, mixed> $config
     *
     * @return array<string, mixed>
     */
    protected function generateDeleteForm(array $config): array
    {
        $entityName = $config['entity'];
        $entityKey = strtolower($entityName);
        $deleteConfig = $config['ui']['delete'] ?? [];
        $identifierField = $this->getIdentifierField($config);

        return [
            "form.{$entityKey}.delete" => [
                'component' => 'DynamicFormComponent',
                'slot' => 'actions',
                'inputs' => [
                    'config' => [
                        'controls' => [
                            ['use' => "field.{$entityKey}.reference"],
                        ],
                        'submit' => [
                            'active' => true,
                            'label' => $deleteConfig['submitLabel'] ?? 'Delete',
                            'method' => 'DELETE',
                            'url' => "/{$entityKey}s/\${row.{$identifierField}}",
                            'variant' => 'critical',
                            'actions' => $this->actionsBuilder->buildSuccessActions($entityKey, "The {$entityKey} is deleted."),
                            'errorActions' => $this->actionsBuilder->buildErrorActions($entityKey, "Failed to delete {$entityKey}"),
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * @param array<string, mixed> $formConfig
     *
     * @return array<string, mixed>
     */
    protected function buildSubmitConfig(
        string $operation,
        array $formConfig,
        string $entityKey,
        string $method,
        string $defaultUrl,
    ): array {
        $actionVerb = $operation === 'create' ? 'created' : 'saved';
        $successMessage = "The {$entityKey} is {$actionVerb}.";
        $errorMessage = "Failed to {$operation} {$entityKey}";

        return [
            'label' => $formConfig['submitLabel'] ?? ucfirst($operation),
            'method' => $method,
            'url' => $formConfig['url'] ?? $defaultUrl,
            'actions' => $formConfig['submit']['actions'] ?? $this->actionsBuilder->buildSuccessActions($entityKey, $successMessage),
            'errorActions' => $formConfig['submit']['errorActions'] ?? $this->actionsBuilder->buildErrorActions($entityKey, $errorMessage),
        ];
    }

    /**
     * @param array<string> $fields
     *
     * @return array<array<string, mixed>>
     */
    protected function mapFieldsToControls(array $fields, string $entityKey): array
    {
        return array_map(
            fn ($field) => ['use' => "field.{$entityKey}.{$field}"],
            $fields,
        );
    }

    /**
     * @param array<string> $fields
     *
     * @return array<array<string, mixed>>
     */
    protected function mapFieldsToControlsWithValues(array $fields, string $entityKey): array
    {
        return array_map(
            fn ($field) => [
                'use' => "field.{$entityKey}.{$field}",
                'overrides' => ['value' => "\${row.{$field}}"],
            ],
            $fields,
        );
    }

    /**
     * @param array<string, mixed> $fields
     *
     * @return array<string>
     */
    protected function getRequiredFields(array $fields): array
    {
        return array_keys(array_filter($fields, fn ($field) => $field['required'] ?? false));
    }

    /**
     * @param array<string, mixed> $fields
     *
     * @return array<string>
     */
    protected function getEditableFields(array $fields): array
    {
        return array_keys(array_filter($fields, fn ($field) => !($field['readonly'] ?? false)));
    }

    /**
     * @param array<string, mixed> $config
     */
    protected function getIdentifierField(array $config): string
    {
        foreach ($config['fields'] ?? [] as $name => $field) {
            if (stripos($name, 'reference') !== false || stripos($name, 'id') !== false) {
                return $name;
            }
        }

        return strtolower($config['entity']) . 'Reference';
    }
}
