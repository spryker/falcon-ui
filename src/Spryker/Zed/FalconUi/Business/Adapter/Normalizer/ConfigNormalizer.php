<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Normalizer;

/**
 * Normalizes simplified YAML syntax to FalconUI DynamicComponentConfig format.
 *
 * FE expects:
 * - component: string
 * - content: string (text node)
 * - inputs: Record<string, unknown> (@Input() properties)
 * - slots: array of child components with optional 'slot' key
 * - className, style, attrs, id, qa: structural properties
 *
 * YAML uses 'contains' instead of 'slots' for better readability.
 * This normalizer transforms 'contains' to 'slots' for FE compatibility.
 */
class ConfigNormalizer
{
    /**
     * Structural keys that FE DynamicComponentConfig expects at top level.
     * These are NOT moved to inputs.
     *
     * @var array<string>
     */
    protected const STRUCTURAL_KEYS = [
        'component',
        'content',
        'slots',
        'contains',
        'inputs',
        'className',
        'style',
        'attrs',
        'id',
        'qa',
        'slot',
        'use',
        'overrides',
        'virtualRoute',
    ];

    /**
     * @var array<\Spryker\Zed\FalconUi\Business\Adapter\Normalizer\ComponentNormalizerInterface>
     */
    protected array $componentNormalizers = [];

    public function __construct()
    {
        $this->componentNormalizers = [
            new FieldNormalizer(),
            new FormNormalizer(),
            new TableNormalizer(),
        ];
    }

    /**
     * Normalizes all components from simplified YAML to FalconUI format.
     *
     * @param array<string, mixed> $components
     *
     * @return array<string, mixed>
     */
    public function normalizeComponents(array $components, string $entityName): array
    {
        $normalized = [];

        foreach ($components as $key => $component) {
            if (!is_array($component)) {
                $normalized[$key] = $component;

                continue;
            }

            $normalized[$key] = $this->normalizeComponent($key, $component, $entityName);
        }

        return $normalized;
    }

    /**
     * @param array<string, mixed> $component
     *
     * @return array<string, mixed>
     */
    protected function normalizeComponent(string $key, array $component, string $entityName): array
    {
        foreach ($this->componentNormalizers as $normalizer) {
            if ($normalizer->supports($key, $component)) {
                return $normalizer->normalize($key, $component, $entityName);
            }
        }

        return $this->normalizeGenericComponent($component);
    }

    /**
     * Generic normalization that works for any component.
     *
     * 1. Keeps structural keys at top level
     * 2. Converts slot shortcuts (label, actions, etc.) to slots array
     * 3. Moves everything else to inputs
     *
     * @param array<string, mixed> $component
     *
     * @return array<string, mixed>
     */
    protected function normalizeGenericComponent(array $component): array
    {
        $result = [];
        $inputs = $component['inputs'] ?? [];
        $slots = $component['slots'] ?? [];

        // Convert 'contains' structure to slots array
        if (isset($component['contains'])) {
            $slots = array_merge($slots, $this->normalizeContains($component['contains']));
        }

        foreach ($component as $key => $value) {
            if (in_array($key, static::STRUCTURAL_KEYS, true)) {
                if ($key !== 'inputs' && $key !== 'slots' && $key !== 'contains') {
                    $result[$key] = $value;
                }

                continue;
            }

            // Normalize action with drawer shortcut
            if ($key === 'action' && is_array($value) && isset($value['drawer'])) {
                $inputs[$key] = $this->normalizeDrawerAction($value);

                continue;
            }

            $inputs[$key] = $value;
        }

        if ($slots) {
            $result['slots'] = $slots;
        }

        if ($inputs) {
            $result['inputs'] = $inputs;
        }

        return $result;
    }

    /**
     * Normalizes simplified drawer action to full FalconUI format.
     *
     * Simplified:
     *   action:
     *     type: 'drawer'
     *     drawer:
     *       - use: headline.customer.create
     *       - use: form.customer.create
     *
     * FalconUI:
     *   action:
     *     type: 'drawer'
     *     component: 'component-builder'
     *     options:
     *       inputs:
     *         configuration:
     *           - use: headline.customer.create
     *           - use: form.customer.create
     *
     * @param array<string, mixed> $action
     *
     * @return array<string, mixed>
     */
    protected function normalizeDrawerAction(array $action): array
    {
        $configuration = $action['drawer'];
        unset($action['drawer']);

        return array_merge($action, [
            'component' => 'component-builder',
            'options' => [
                'inputs' => [
                    'configuration' => $configuration,
                ],
            ],
        ]);
    }

    /**
     * Converts 'contains' structure to slots array.
     *
     * YAML:
     *   contains:
     *     actions:
     *       - use: action.customer.create
     *     content:
     *       - use: table.customer.list
     *
     * FalconUI:
     *   slots:
     *     - slot: 'actions'
     *       use: action.customer.create
     *     - slot: 'content'
     *       use: table.customer.list
     *
     * @param array<string, mixed> $contains
     *
     * @return array<array<string, mixed>>
     */
    protected function normalizeContains(array $contains): array
    {
        $slots = [];

        foreach ($contains as $slotName => $slotContent) {
            $slots = array_merge($slots, $this->convertToSlots($slotContent, $slotName));
        }

        return $slots;
    }

    /**
     * @return array<array<string, mixed>>
     */
    protected function convertToSlots(mixed $value, ?string $slotName): array
    {
        if (is_string($value)) {
            return [$this->buildSlot(['content' => $value], $slotName)];
        }

        if (!is_array($value)) {
            return [];
        }

        if (isset($value['use']) || isset($value['component'])) {
            return [$this->buildSlot($value, $slotName)];
        }

        return array_filter(array_map(
            fn ($item) => is_array($item) ? $this->buildSlot($item, $slotName) : null,
            $value,
        ));
    }

    /**
     * @param array<string, mixed> $slot
     *
     * @return array<string, mixed>
     */
    protected function buildSlot(array $slot, ?string $slotName): array
    {
        // 'content' is a special case - it's the default slot, not a named slot
        if ($slotName !== null && $slotName !== 'content' && !isset($slot['slot'])) {
            $slot['slot'] = $slotName;
        }

        return $slot;
    }
}
