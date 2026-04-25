function toBase64(bytes: Uint8Array) {
    let binary = '';

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
}

export function stableStringify(value: unknown): string {
    return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(sortValue);
    }

    if (value && typeof value === 'object') {
        return Object.keys(value as Record<string, unknown>)
            .sort()
            .reduce<Record<string, unknown>>((acc, key) => {
                const record = value as Record<string, unknown>;
                acc[key] = sortValue(record[key]);
                return acc;
            }, {});
    }

    return value;
}

export async function signPayload(privateKey: CryptoKey, payload: unknown) {
    const encoder = new TextEncoder();
    const data = encoder.encode(stableStringify(payload));

    const signature = await crypto.subtle.sign(
        {
            name: 'ECDSA',
            hash: { name: 'SHA-256' }
        },
        privateKey,
        data
    );

    return toBase64(new Uint8Array(signature));
}
