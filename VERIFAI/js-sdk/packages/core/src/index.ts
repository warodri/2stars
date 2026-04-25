export { IdentityClient } from './client/IdentityClient';
export { generateDeviceKeyPair } from './identity/deviceKey';
export { signPayload } from './identity/signature';
export { initSDK, requestStepUpSignals } from './services/step-up.service';
export { getOrCreateDeviceKey } from './storage/deviceKeyStore';
export type { IdentityClientConfig } from './models/config.model';
export type { VerificationResponse } from './models/response.model';
export type {
    BehaviourSignals,
    BrowserSignals,
    CollectedSignals,
    DeviceProof,
    StepUpSignals,
    TrustMetadata,
    VerificationPayload
} from './models/signal.model';
