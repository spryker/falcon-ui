<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Business\Adapter\Generator;

/**
 * Builds form success and error actions.
 * Single source of truth for action structure - used by both FormGenerator and FormNormalizer.
 */
class FormActionsBuilder
{
    /**
     * @return array<array<string, mixed>>
     */
    public function buildSuccessActions(string $entityKey, ?string $message = null): array
    {
        $title = $message ?? "The {$entityKey} is saved.";

        return [
            [
                'type' => 'notification',
                'notifications' => [['title' => $title, 'type' => 'success']],
            ],
            ['type' => 'close-drawer'],
            ['type' => 'refresh-table'],
        ];
    }

    /**
     * @return array<array<string, mixed>>
     */
    public function buildErrorActions(string $entityKey, ?string $message = null): array
    {
        $notification = [
            'title' => $message ?? "Failed to save {$entityKey}",
            'type' => 'error',
        ];

        if ($message === null) {
            $notification['description'] = 'Please refresh the page and try again.';
        }

        return [
            [
                'type' => 'notification',
                'notifications' => [$notification],
            ],
        ];
    }
}
