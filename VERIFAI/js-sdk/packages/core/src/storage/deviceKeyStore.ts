import { generateDeviceKeyPair } from '../identity/deviceKey';

const DATABASE_NAME = 'omwal-sdk';
const STORE_NAME = 'deviceKeys';
const RECORD_ID = 'default';

type StoredDeviceKeyRecord = {
    id: string;
    privateKey: CryptoKey;
    publicKey: string;
    createdAt: number;
};

export type StoredDeviceKey = {
    privateKey: CryptoKey;
    publicKey: string;
    createdAt: number;
    isNewDevice: boolean;
};

function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, 1);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
    });
}

async function readStoredDeviceKey(): Promise<StoredDeviceKeyRecord | null> {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(RECORD_ID);

        request.onsuccess = () => resolve((request.result as StoredDeviceKeyRecord | undefined) ?? null);
        request.onerror = () => reject(request.error ?? new Error('Failed to read device key'));
        tx.oncomplete = () => db.close();
        tx.onerror = () => reject(tx.error ?? new Error('Failed to read device key'));
    });
}

async function saveStoredDeviceKey(record: StoredDeviceKeyRecord): Promise<void> {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        store.put(record);

        tx.oncomplete = () => {
            db.close();
            resolve();
        };
        tx.onerror = () => reject(tx.error ?? new Error('Failed to save device key'));
        tx.onabort = () => reject(tx.error ?? new Error('Device key save was aborted'));
    });
}

export async function getOrCreateDeviceKey(): Promise<StoredDeviceKey> {
    const existing = await readStoredDeviceKey();

    if (existing) {
        return {
            privateKey: existing.privateKey,
            publicKey: existing.publicKey,
            createdAt: existing.createdAt,
            isNewDevice: false
        };
    }

    const keyPair = await generateDeviceKeyPair();
    const createdAt = Date.now();

    await saveStoredDeviceKey({
        id: RECORD_ID,
        privateKey: keyPair.privateKey,
        publicKey: keyPair.publicKey,
        createdAt
    });

    return {
        privateKey: keyPair.privateKey,
        publicKey: keyPair.publicKey,
        createdAt,
        isNewDevice: true
    };
}
