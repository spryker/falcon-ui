<?php

/**
 * Copyright © 2016-present Spryker Systems GmbH. All rights reserved.
 * Use of this software requires acceptance of the Evaluation License Agreement. See LICENSE file.
 */

declare(strict_types=1);

namespace Spryker\Zed\FalconUi\Communication\Controller;

use Spryker\Zed\Kernel\Communication\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class FeatureController extends AbstractController
{
    /**
     * @return array<string, mixed>
     */
    public function indexAction(Request $request): array
    {
        $feature = $request->attributes->get('feature');
        $entity = $request->attributes->get('entity');

        return $this->viewResponse([
            'feature' => $feature,
            'entity' => $entity,
        ]);
    }
}
