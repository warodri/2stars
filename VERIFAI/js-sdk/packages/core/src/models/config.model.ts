export type IdentityClientConfig = {
    apiKey: string;
    endpoint: string;
    clientUserId: string;
    action: string;
    stepUp?: {
        enabled: boolean;
        signals: {
            camera: boolean;
            microphone: boolean;
            geolocation: boolean;
            motion: boolean;
        };
    };
};
