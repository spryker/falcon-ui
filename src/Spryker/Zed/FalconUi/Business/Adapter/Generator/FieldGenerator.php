<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Generator;

use Spryker\Zed\ComposableBackofficeUi\Business\Adapter\GeneratorInterface;

class FieldGenerator implements GeneratorInterface
{
    protected const TYPE_MAPPING = [
        'string' => ['controlType' => 'input', 'type' => 'text'],
        'text' => ['controlType' => 'input', 'type' => 'text'],
        'email' => ['controlType' => 'input', 'type' => 'email'],
        'date' => ['controlType' => 'datepicker'],
        'select' => ['controlType' => 'select'],
        'number' => ['controlType' => 'input', 'type' => 'number'],
        'textarea' => ['controlType' => 'textarea'],
        'hidden' => ['controlType' => 'input', 'type' => 'hidden'],
        'checkbox' => ['controlType' => 'checkbox'],
        'toggle' => ['controlType' => 'toggle'],
        'radio' => ['controlType' => 'radio'],
    ];

    protected const DEFAULT_TYPE = 'string';

    public function generate(array $config): array
    {
        $components = [];
        $entityKey = strtolower($config['entity']);

        foreach ($config['fields'] ?? [] as $fieldName => $fieldConfig) {
            $componentKey = "field.{$entityKey}.{$fieldName}";
            $components[$componentKey] = $this->generateField($fieldName, $fieldConfig);
        }

        return $components;
    }

    /**
     * @param array<string, mixed> $config
     *
     * @return array<string, mixed>
     */
    public function generateField(string $name, array $config): array
    {
        $type = $config['type'] ?? static::DEFAULT_TYPE;
        $baseMapping = static::TYPE_MAPPING[$type] ?? static::TYPE_MAPPING[static::DEFAULT_TYPE];

        $field = [
            'name' => $name,
            'label' => $config['label'] ?? $this->generateLabel($name),
            ...$baseMapping,
        ];

        $validators = $this->buildValidators($config);
        if ($validators) {
            $field['validators'] = $validators;
        }

        if ($type === 'select' && isset($config['datasource'])) {
            $field['datasource'] = $this->normalizeDatasource($config['datasource']);
        }

        if ($config['readonly'] ?? false) {
            $field['disabled'] = true;
        }

        return $field;
    }

    /**
     * @param array<string, mixed> $config
     *
     * @return array<string, mixed>
     */
    protected function buildValidators(array $config): array
    {
        if (!empty($config['validators'])) {
            return $config['validators'];
        }

        $validators = [];

        if ($config['required'] ?? false) {
            $validators['required'] = true;
        }

        $type = $config['type'] ?? static::DEFAULT_TYPE;
        if ($type === 'email') {
            $validators['email'] = true;
        }

        return $validators;
    }

    /**
     * @param array<string, mixed> $datasource
     *
     * @return array<string, mixed>
     */
    protected function normalizeDatasource(array $datasource): array
    {
        return [
            'type' => $datasource['type'] ?? 'http',
            'url' => $datasource['url'],
            'valueField' => $datasource['valueField'] ?? 'value',
            'titleField' => $datasource['titleField'] ?? 'title',
        ];
    }

    protected function generateLabel(string $fieldName): string
    {
        return ucwords(str_replace('_', ' ', (string)preg_replace('/(?<!^)[A-Z]/', ' $0', $fieldName)));
    }
}
