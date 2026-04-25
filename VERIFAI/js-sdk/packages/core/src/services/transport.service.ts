// packages/core/src/services/transport.service.ts

import type { IdentityClientConfig } from '../models/config.model';
import type { VerificationResponse } from '../models/response.model';
import type { VerificationPayload } from '../models/signal.model';

export async function sendToServer(
    payload: VerificationPayload,
    config: IdentityClientConfig
): Promise<VerificationResponse> {
    const res = await fetch(`${config.endpoint}/v1/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        throw new Error(`Verification request failed with status ${res.status}`);
    }

    return res.json();
}
