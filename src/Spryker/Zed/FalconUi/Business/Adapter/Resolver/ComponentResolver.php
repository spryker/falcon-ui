<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Resolver;

/**
 * Resolves component references and builds the view.root structure.
 * Transforms layout + components into a fully resolved component tree.
 */
class ComponentResolver
{
    /**
     * Builds view.root from layout and components.
     * Resolves all { use: "component.name" } references recursively.
     *
     * @param array<string, mixed> $layout
     * @param array<string, mixed> $components
     *
     * @return array<string, mixed>
     */
    public function buildViewRoot(array $layout, array $components): array
    {
        $layoutUse = $layout['use'] ?? [];
        if (!$layoutUse) {
            return [];
        }

        $rootComponentKey = is_array($layoutUse) ? $layoutUse[0] : $layoutUse;
        $rootComponent = $components[$rootComponentKey] ?? null;

        return $rootComponent !== null
            ? $this->resolveComponentReferences($rootComponent, $components)
            : [];
    }

    /**
     * Recursively resolves component references in slots and nested configurations.
     * Transforms { use: "component.name" } into the actual component config.
     *
     * @param array<string, mixed> $component
     * @param array<string, mixed> $components
     *
     * @return array<string, mixed>
     */
    protected function resolveComponentReferences(array $component, array $components): array
    {
        // Resolve slots
        if (isset($component['slots']) && is_array($component['slots'])) {
            $component['slots'] = $this->resolveSlots($component['slots'], $components);
        }

        // Resolve drawer action configuration (ButtonActionComponent)
        if (isset($component['inputs']['action']['options']['inputs']['configuration'])) {
            $component['inputs']['action']['options']['inputs']['configuration'] = $this->resolveConfigurationArray(
                $component['inputs']['action']['options']['inputs']['configuration'],
                $components,
            );
        }

        // Resolve table rowActions configuration
        if (isset($component['inputs']['config']['rowActions']['actions'])) {
            $component['inputs']['config']['rowActions']['actions'] = array_map(
                fn ($action) => $this->resolveActionConfiguration($action, $components),
                $component['inputs']['config']['rowActions']['actions'],
            );
        }

        // Resolve form controls (fields with use references)
        if (isset($component['inputs']['config']['controls'])) {
            $component['inputs']['config']['controls'] = $this->resolveConfigurationArray(
                $component['inputs']['config']['controls'],
                $components,
            );
        }

        return $component;
    }

    /**
     * @param array<string, mixed> $action
     * @param array<string, mixed> $components
     *
     * @return array<string, mixed>
     */
    protected function resolveActionConfiguration(array $action, array $components): array
    {
        if (isset($action['options']['inputs']['configuration'])) {
            $action['options']['inputs']['configuration'] = $this->resolveConfigurationArray(
                $action['options']['inputs']['configuration'],
                $components,
            );
        }

        return $action;
    }

    /**
     * @param array<mixed> $configuration
     * @param array<string, mixed> $components
     *
     * @return array<array<string, mixed>>
     */
    protected function resolveConfigurationArray(array $configuration, array $components): array
    {
        return array_filter(array_map(
            fn ($item) => $this->resolveConfigurationItem($item, $components),
            $configuration,
        ));
    }

    /**
     * @param array<string, mixed> $components
     *
     * @return array<string, mixed>|null
     */
    protected function resolveConfigurationItem(mixed $item, array $components): ?array
    {
        if (!is_array($item)) {
            return null;
        }

        if (!isset($item['use'])) {
            return $this->resolveComponentReferences($item, $components);
        }

        $refComponent = $components[$item['use']] ?? null;
        if ($refComponent === null) {
            return null;
        }

        $resolved = $this->resolveComponentReferences($refComponent, $components);

        // Apply overrides from the use reference
        if (isset($item['overrides']) && is_array($item['overrides'])) {
            $resolved = array_merge($resolved, $item['overrides']);
        }

        return $resolved;
    }

    /**
     * @param array<mixed> $slots
     * @param array<string, mixed> $components
     *
     * @return array<array<string, mixed>>
     */
    protected function resolveSlots(array $slots, array $components): array
    {
        $flatSlots = [];

        foreach ($slots as $slotName => $slotItems) {
            // Flat array format: slots is array of items with 'slot' property
            if (is_int($slotName)) {
                $resolved = $this->resolveSlotItem($slotItems, $components);
                if ($resolved !== null) {
                    $flatSlots[] = $resolved;
                }

                continue;
            }

            // Grouped format: slots is associative array [slotName => items[]]
            if (!is_array($slotItems)) {
                continue;
            }

            foreach ($slotItems as $item) {
                $resolved = $this->resolveSlotItem($item, $components, $slotName);
                if ($resolved !== null) {
                    $flatSlots[] = $resolved;
                }
            }
        }

        return $flatSlots;
    }

    /**
     * Resolves a single slot item.
     * If item has { use: "..." }, replaces it with the referenced component.
     *
     * @param array<string, mixed> $components
     *
     * @return array<string, mixed>|null
     */
    protected function resolveSlotItem(mixed $item, array $components, ?string $slotName = null): ?array
    {
        if (!is_array($item)) {
            return null;
        }

        // Preserve slot from item (flat format) or use provided slotName (grouped format)
        $effectiveSlotName = $item['slot'] ?? $slotName;

        if (!isset($item['use'])) {
            if ($effectiveSlotName !== null && !isset($item['slot'])) {
                $item['slot'] = $effectiveSlotName;
            }

            return $item;
        }

        $refComponent = $components[$item['use']] ?? null;
        if ($refComponent === null) {
            return null;
        }

        $resolved = $this->resolveComponentReferences($refComponent, $components);

        if ($effectiveSlotName !== null) {
            $resolved['slot'] = $effectiveSlotName;
        }

        return $resolved;
    }
}
