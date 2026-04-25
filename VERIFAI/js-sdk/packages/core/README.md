# Server Payload Contract

This document describes the verification payload the Web SDK sends to the server.

The goal of the payload is to give the backend enough context to:

- recognize returning users and devices
- compare current behaviour against prior behaviour
- detect low-signal or low-confidence sessions
- support scoring, challenge, allow, or post-analysis flows

## Real Payload Example

This is a real example of the object the SDK sends to the server:

```json
{
  "clientUserId": "user_12345",
  "action": "login",
  "platform": "js",
  "deviceId": "dev_69ab20af6bf87ca905ac29e622e3257e",
  "sessionId": "d7d9fa59-2868-485e-8353-728599e93671",
  "timestamp": 1776893173357,
  "isNewDevice": false,
  "trust": {
    "isKnownDevice": true,
    "keyAge": 317523,
    "signaturePresent": true
  },
  "signals": {
    "device": {
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
      "platform": "MacIntel",
      "language": "en-US"
    },
    "browser": {
      "screen": {
        "width": 2560,
        "height": 1080,
        "pixelRatio": 1
      },
      "timezone": "Europe/London"
    },
    "fingerprint": {
      "canvasHash": "5f1e0092c355042544e5775c365cf922dd1b1662b62a8ff0badc40e421f8f9f2",
      "audioHash": "cfe084fcf8964098423c06775ab171be196330d173432cabe5dd9008e7ca819a",
      "webgl": {
        "vendor": "Google Inc. (Apple)",
        "renderer": "ANGLE (Apple, ANGLE Metal Renderer: Apple M3, Unspecified Version)"
      },
      "webglDetails": {
        "maxTextureSize": 16384,
        "maxViewportDims": {
          "0": 16384,
          "1": 16384
        },
        "shadingLanguageVersion": "WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)"
      },
      "hardware": {
        "cpuCores": 8,
        "deviceMemory": 16,
        "languages": [
          "en-US",
          "en"
        ]
      }
    },
    "identity": {
      "deviceFingerprint": "fp_1f27c8f12da378c8",
      "behaviourFingerprint": "bf_5aad707dd0669992",
      "deviceBindingHash": "602b6554fef99c03fffe6b81fb668fe46aa9e9e2ea5e1a930a07bdff9d3f0ef7",
      "deviceId": "dev_69ab20af6bf87ca905ac29e622e3257e",
      "fingerprintVersion": 1,
      "fingerprintConfidence": 1
    },
    "network": {
      "effectiveType": "4g",
      "downlink": 10,
      "rtt": 50
    },
    "environment": {
      "permissions": {
        "geolocation": "granted",
        "notifications": "prompt"
      },
      "mediaDevices": {
        "audioInputs": 5,
        "videoInputs": 2
      }
    },
    "stepUp": {
      "granted": {
        "geolocation": true,
        "camera": true,
        "microphone": true,
        "motion": true
      },
      "signals": {
        "location": {
          "lat": 51.70454592652516,
          "lng": 0.12474359033496636,
          "accuracy": 35
        },
        "cameraFramesCaptured": 10,
        "microphoneSampleLevel": 0.2488030327690972,
        "motion": {
          "captured": true,
          "intensity": 0
        }
      },
      "score": 0.5622007581922743
    },
    "attention": {
      "hiddenDuringSession": false,
      "visibilityChanges": 0
    },
    "interaction": {
      "idleBeforeSubmit": 9.199999988079071,
      "scrollUsed": false,
      "speed": "instant"
    },
    "sessionQuality": {
      "eventDensity": 0.04731165550710958,
      "isShortSession": false,
      "behaviourCompleteness": 0.5,
      "level": "medium"
    },
    "behaviour": {
      "typing": {
        "keyCount": 0,
        "inputCount": 0,
        "pasteCount": 0,
        "pasteInPassword": false,
        "pasteTimingMs": null,
        "holdTimeAvg": null,
        "avgDelay": null,
        "variance": null,
        "correctionRate": 0
      },
      "pointer": {
        "movementCount": 116,
        "avgSpeed": 584.7820533520293,
        "avgAcceleration": 16306.486588908632,
        "clickCount": 1,
        "avgClickInterval": null,
        "tapCount": 0,
        "avgTapInterval": null
      },
      "hesitation": {
        "timeToFirstInput": 0.5,
        "sessionDuration": 2494.0999999940395
      },
      "focus": {
        "focusCount": 1,
        "transitionCount": 1,
        "tabTransitions": 0,
        "pointerTransitions": 1,
        "touchTransitions": 0,
        "keyboardTransitions": 0,
        "unknownTransitions": 0,
        "avgFocusDelay": null,
        "sequence": [
          {
            "from": null,
            "to": "button",
            "method": "pointer",
            "delay": null
          }
        ]
      },
      "diagnostics": {
        "isStarted": true,
        "startedAt": 10742.09999999404,
        "capturedEventCount": 118
      },
      "mode": "pointer",
      "features": {
        "typingSpeed": null,
        "typingConsistency": null,
        "hesitationRatio": 0.00020047311655554907,
        "pointerStability": 0.7287594955104822
      }
    }
  },
  "deviceProof": {
    "publicKey": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFlJLBA8OTTHTfsTTwtPTak7vlXCDPUxCRbAwl45g+BXNHjyZuiuXeve0fvczKqRnXAh5a5fIC2b+zNFMNhqK3g==",
    "signature": "ovJHFKByrpeYOyoTlPZtoCZHiFDQI+jEpAqtNCvjM1nmoLGSn2dKFVp9EHelmAnTbWKJWhuSgp0RhOwYpxZGrw==",
    "algorithm": "ECDSA_P256",
    "timestamp": 1776893173357
  }
}
```

## Top-Level Payload

```json
{
  "clientUserId": "user_12345",
  "action": "login",
  "platform": "js",
  "deviceId": "dev_xxx",
  "sessionId": "uuid",
  "timestamp": 1776709196924,
  "isNewDevice": false,
  "trust": {},
  "signals": {
    "device": {},
    "browser": {},
    "fingerprint": {},
    "identity": {},
    "network": {},
    "environment": {},
    "stepUp": {},
    "attention": {},
    "interaction": {},
    "sessionQuality": {},
    "behaviour": {}
  },
  "deviceProof": {}
}
```

## Top-Level Fields

### `clientUserId`

Application-level user identifier supplied by the developer using the SDK.

Why it is sent:

- links sessions to the same application user
- allows per-user device history
- allows per-user behaviour baselines

### `action`

Application-level action supplied by the developer, for example `login`, `checkout`, `password_reset`, or `transfer`.

Why it is sent:

- allows different scoring policies per action
- supports post-analysis by event type
- helps identify high-risk flows

### `platform`

Current SDK platform. For the Web SDK this is always `js`.

Why it is sent:

- distinguishes signals produced by different SDK platforms
- helps backend routing and analytics

### `deviceId`

SDK-managed local device identifier stored in the browser.

Why it is sent:

- recognizes the same browser/device across sessions
- supports known-device decisions
- gives the backend a stable local identifier even before deeper fingerprint comparison

This is a local SDK identifier, not the same as `signals.identity.deviceFingerprint`.

### `sessionId`

Per-request session identifier.

Why it is sent:

- correlates one verification call with logs and downstream events
- separates repeated attempts from the same device
- helps trace one session without affecting device identity

### `timestamp`

Client-side request timestamp in milliseconds.

Why it is sent:

- supports event ordering
- supports timing analysis and debugging
- helps compare session timing with server receive time

### `isNewDevice`

Whether the SDK had to create a brand-new device key for this browser profile.

Current meaning:

- `true` when no persisted device key existed in IndexedDB
- `false` when the device key was already known locally and reused

Why it is sent:

- helps the backend treat first-seen device proofs differently from returning ones
- supports registration vs returning-device logic
- gives context for trust and replay controls

### `trust`

Client-side trust metadata derived from the persisted device key state.

```json
{
  "isKnownDevice": true,
  "keyAge": 317523,
  "signaturePresent": true
}
```

#### `isKnownDevice`

Whether the SDK reused an existing device key rather than creating a new one.

Why it is sent:

- gives the backend a quick returning-device hint
- supports first-time allow vs returning-user evaluation
- should be treated as a hint, not a final server verdict

#### `keyAge`

Milliseconds since the persisted device key was first created on this browser profile.

Why it is sent:

- helps distinguish fresh device registrations from established devices
- supports trust decay or trust accumulation logic
- can be combined with behavioural and fingerprint stability

#### `signaturePresent`

Whether the SDK attached a cryptographic device signature for this request.

Why it is sent:

- makes it easy for the backend to reject unsigned flows when required
- supports analytics on signature coverage
- helps separate verification failures from absent proof material

## `signals`

`signals` contains the device, environment, attention, interaction, and behaviour data used for scoring and analysis.

---

## `signals.device`

```json
{
  "userAgent": "Mozilla/5.0 ...",
  "platform": "MacIntel",
  "language": "en-US"
}
```

### `userAgent`

Raw browser user agent string.

Why it is sent:

- useful for debugging
- supports browser-family checks
- provides raw context separate from the stable fingerprint

### `platform`

Browser-reported platform string.

Why it is sent:

- helps distinguish desktop/mobile/platform families
- contributes to device fingerprinting

### `language`

Primary browser language.

Why it is sent:

- contributes to environment consistency checks
- supports fingerprinting and anomaly detection

---

## `signals.browser`

```json
{
  "screen": {
    "width": 2560,
    "height": 1080,
    "pixelRatio": 1
  },
  "timezone": "Europe/London"
}
```

### `screen.width`, `screen.height`

Screen dimensions reported by the browser.

Why they are sent:

- contribute to fingerprinting
- help identify device changes
- help classify desktop vs smaller form factors

### `screen.pixelRatio`

Browser pixel ratio.

Why it is sent:

- contributes to fingerprinting
- can help distinguish similar screen sizes on different displays

### `timezone`

Browser-reported timezone.

Why it is sent:

- contributes to fingerprinting
- helps detect environment drift
- supports risk analysis when timezone changes unexpectedly

---

## `signals.fingerprint`

Raw device/environment fingerprint material.

```json
{
  "canvasHash": "sha256...",
  "audioHash": "sha256...",
  "webgl": {
    "vendor": "Apple Inc.",
    "renderer": "Apple GPU"
  },
  "webglDetails": {
    "maxTextureSize": 16384,
    "maxViewportDims": [16384, 16384],
    "shadingLanguageVersion": "WebGL GLSL ES 1.0"
  },
  "hardware": {
    "cpuCores": 8,
    "deviceMemory": 8,
    "languages": ["en-US", "en"]
  }
}
```

### `canvasHash`

Hash of a canvas rendering output. The raw canvas image is not sent.

Why it is sent:

- helps distinguish rendering environments
- provides a compact device fingerprint signal
- reduces payload size compared with raw canvas data

### `audioHash`

Hash of a short audio-processing sample generated with the Web Audio API.

Why it is sent:

- adds another hardware-sensitive fingerprint component
- helps distinguish similar devices with matching browser-level signals
- strengthens fingerprint confidence when available

### `webgl.vendor`, `webgl.renderer`

WebGL renderer information when available.

Why they are sent:

- helps identify GPU/rendering environment
- improves fingerprint robustness
- supports device change detection

### `webglDetails.maxTextureSize`, `webglDetails.maxViewportDims`, `webglDetails.shadingLanguageVersion`

Additional WebGL capability values reported by the browser.

Why they are sent:

- add hardware-level rendering detail beyond vendor and renderer alone
- improve differentiation between similar GPU environments
- strengthen fingerprint stability across sessions

### `hardware.cpuCores`

Browser-reported logical CPU core count.

Why it is sent:

- contributes to fingerprinting
- helps detect major device differences

### `hardware.deviceMemory`

Browser-reported approximate memory in GB when available.

Why it is sent:

- contributes to fingerprinting
- helps distinguish device classes

### `hardware.languages`

Browser language list.

Why it is sent:

- contributes to fingerprint stability
- helps detect environment drift across sessions

---

## `signals.identity`

Derived identity signals built from the raw fingerprint data.

```json
{
  "deviceFingerprint": "fp_ab12cd34ef56gh78",
  "behaviourFingerprint": "bf_1234abcd5678ef90",
  "deviceBindingHash": "sha256...",
  "deviceId": "dev_xxx",
  "fingerprintVersion": 1,
  "fingerprintConfidence": 1
}
```

### `deviceFingerprint`

Stable hashed fingerprint derived from selected device and environment signals.

Why it is sent:

- supports recognition of the same device across sessions
- supports comparison when the local `deviceId` is missing or changes
- gives the backend a compact identifier for device grouping

This fingerprint excludes behaviour, timestamps, and session identifiers.

### `behaviourFingerprint`

Compact hashed identifier derived from stable behavioural summary values:

- `features.typingSpeed`
- `features.typingConsistency`
- `features.hesitationRatio`
- `features.pointerStability`
- `typing.holdTimeAvg`

Why it is sent:

- gives the backend a compact behaviour signature for comparison
- supports same-user vs different-user checks without sending raw timing arrays
- stays relatively stable across sessions because it uses normalized summary values only

It intentionally does not include raw arrays or per-event data. The current input values are already normalized or bounded before hashing.

### `deviceId`

Same SDK-managed identifier also sent at top level.

Why it is repeated here:

- keeps identity-related values grouped together
- makes backend fingerprint logic easier to consume from one object

### `deviceBindingHash`

SHA-256 hash of `deviceFingerprint + publicKey`.

Why it is sent:

- binds the device fingerprint layer to the persisted device key layer
- helps detect when the same browser fingerprint starts presenting a different key
- gives the backend a compact value for cross-checking device continuity

### `fingerprintVersion`

Version number for fingerprint generation logic.

Why it is sent:

- allows backend migrations as fingerprint logic evolves
- prevents mixing incompatible fingerprint generations

### `fingerprintConfidence`

Simple confidence estimate for the quality of the device fingerprint.

Current meaning:

- `1` when strong fingerprint components are present
- `0.7` when fingerprinting had reduced signal quality

Why it is sent:

- helps the backend weight device identity trust
- helps separate weak fingerprint sessions from strong ones

---

## `signals.network`

```json
{
  "effectiveType": "4g",
  "downlink": 10,
  "rtt": 50
}
```

### `effectiveType`

Browser-reported network type estimate.

Why it is sent:

- adds environment context
- supports anomaly detection and post-analysis

### `downlink`

Browser-reported estimated bandwidth.

Why it is sent:

- provides lightweight network context
- can help identify unusual session environments

### `rtt`

Browser-reported estimated round-trip time.

Why it is sent:

- provides lightweight network quality context
- may help explain interaction timing anomalies

---

## `deviceProof`

Cryptographic proof generated by the persisted device key for this request.

The SDK signs the core payload without `deviceProof` itself. The signed content includes the root `timestamp`, so the backend can apply anti-replay windows.

```json
{
  "publicKey": "base64-spki",
  "signature": "base64-signature",
  "algorithm": "ECDSA_P256",
  "timestamp": 1776893173357
}
```

### `publicKey`

Base64-encoded SPKI public key for the persisted browser device key.

Why it is sent:

- lets the backend verify the signature without prior key exchange
- supports device registration on first use
- allows the backend to bind future requests to the same key

### `signature`

ECDSA signature over the stable serialization of the core payload without `deviceProof`.

Why it is sent:

- proves the request came from a browser holding the persisted private key
- helps distinguish copied identifiers from a real returning device
- supports replay-resistant verification when checked with the proof timestamp

### `algorithm`

Current proof algorithm identifier. The current value is always `ECDSA_P256`.

Why it is sent:

- lets the backend choose the right verification logic
- supports future proof-algorithm upgrades

### `timestamp`

Proof timestamp included in the signed payload.

Why it is sent:

- allows the backend to reject stale signed payloads
- supports anti-replay windows
- helps tie signature freshness to the request timestamp

---

## `signals.environment`

Additional browser environment state that does not fit under device or network.

```json
{
  "permissions": {
    "geolocation": "prompt",
    "notifications": "denied"
  },
  "mediaDevices": {
    "audioInputs": 1,
    "videoInputs": 1
  }
}
```

### `permissions.geolocation`, `permissions.notifications`

Browser permission states when available.

Why they are sent:

- add lightweight environment context
- help distinguish devices or browser profiles with different permission histories
- support post-analysis for suspicious environment changes

### `mediaDevices.audioInputs`, `mediaDevices.videoInputs`

Counts of available microphone and camera devices when enumeration is allowed.

Why they are sent:

- add environment fingerprinting value without exposing device names
- help distinguish desktop setups, laptops, and virtualized environments

---

## `signals.attention`

```json
{
  "hiddenDuringSession": false,
  "visibilityChanges": 0
}
```

### `hiddenDuringSession`

Whether the tab became hidden during the observed session.

Why it is sent:

- helps detect tab switching during sensitive flows
- supports behavioural context and post-analysis

### `visibilityChanges`

Number of visibility state changes during the session.

Why it is sent:

- helps detect distraction or context switching
- may help explain incomplete behaviour samples

---

## `signals.stepUp`

Optional permission-based signals requested only when the developer explicitly triggers step-up mode.

Developers enable step-up support in SDK config and then manually request it before calling `verify()`.

```ts
const client = new IdentityClient({
  apiKey: 'pk_test_xxx',
  baseUrl: 'http://localhost:8000',
  clientUserId: 'user_12345',
  action: 'login',
  stepUp: {
    enabled: true,
    signals: {
      geolocation: true,
      camera: true,
      microphone: true,
      motion: true
    }
  }
});

await client.requestStepUpSignals();
await client.verify();
```

Important rules:

- the SDK never requests permissions automatically
- the developer must explicitly call `requestStepUpSignals()`
- this object is omitted when step-up was not requested
- granted signals are intentionally lightweight summaries, not raw media streams

```json
{
  "granted": {
    "geolocation": true,
    "camera": true,
    "microphone": true,
    "motion": true
  },
  "signals": {
    "location": {
      "lat": 51.7047,
      "lng": 0.1250,
      "accuracy": 35
    },
    "cameraFramesCaptured": 10,
    "microphoneSampleLevel": 0.24,
    "motion": {
      "captured": true,
      "intensity": 0
    }
  },
  "score": 0.56
}
```

### `granted.*`

Permission result per requested signal.

Why it is sent:

- tells the backend which step-up signals were actually available
- distinguishes user denial from feature absence
- avoids interpreting missing signals as collection failure

### `signals.location`

Coarse location sample from a granted geolocation request.

Why it is sent:

- adds high-value step-up context when location is explicitly requested
- helps compare normal vs unusual verification locations
- supports fraud investigation for higher-risk actions

### `signals.cameraFramesCaptured`

Count of video frames successfully observed during a short camera availability check.

Why it is sent:

- proves the browser could access a working camera without sending image content
- provides stronger signal than a simple boolean camera flag
- supports step-up confidence scoring

### `signals.microphoneSampleLevel`

Normalized short audio amplitude sample from a granted microphone request.

Why it is sent:

- proves microphone access succeeded with a lightweight numeric sample
- provides a compact signal without sending audio content
- supports step-up confidence scoring

### `signals.motion`

Motion summary from a short `devicemotion` observation window.

Why it is sent:

- distinguishes supported mobile/device motion sessions from desktop-like sessions
- captures whether motion events were observed at all
- gives the backend a compact movement intensity value for step-up analysis

### `score`

Continuous step-up quality score between `0` and `1`.

Current meaning:

- increases when permission requests succeed and useful signal is captured
- gives partial credit for camera frames, microphone level, and motion intensity
- remains low when step-up was granted but little usable signal was produced

Why it is sent:

- gives the backend an immediate quality summary of the step-up session
- helps avoid binary thinking around partial permission results
- can be combined with core device and behaviour scores

---

## `signals.interaction`

```json
{
  "idleBeforeSubmit": 420,
  "scrollUsed": false,
  "speed": "fast"
}
```

### `idleBeforeSubmit`

Time between the last observed interaction and the submit/verification action.

Why it is sent:

- helps identify stale or automated submissions
- adds context to behaviour scoring

### `scrollUsed`

Whether the user scrolled during the session.

Why it is sent:

- adds low-cost interaction context
- helps distinguish richer sessions from minimal scripted ones

### `speed`

Simple interaction-speed classification derived from `idleBeforeSubmit`.

Current meaning:

- `instant` for near-immediate submissions
- `fast` for quick submissions
- `normal` for more natural pacing

Why it is sent:

- gives the backend a compact pace label without recomputing it
- helps flag sessions that complete too quickly for the observed flow
- supports lightweight rules and analytics

---

## `signals.sessionQuality`

Summary values describing whether the session produced enough usable data.

```json
{
  "eventDensity": 0.01,
  "isShortSession": false,
  "behaviourCompleteness": 1,
  "level": "medium"
}
```

### `eventDensity`

Observed event count divided by session duration.

Why it is sent:

- helps detect thin or low-signal sessions
- helps backend decide how much trust to place in behaviour analysis

### `isShortSession`

Whether the observed session duration was very short.

Why it is sent:

- helps identify rushed or low-observation sessions
- helps backend avoid over-trusting weak behaviour samples

### `behaviourCompleteness`

Simple completeness indicator for behaviour data.

Current meaning:

- `1` when the session includes enough keyboard and pointer activity
- `0.5` when the behaviour sample is partial

Why it is sent:

- helps backend distinguish rich behaviour samples from thin ones
- supports confidence-aware scoring

### `level`

Coarse quality classification derived from session density and completeness.

Current meaning:

- `strong` for dense, behaviour-complete sessions
- `medium` for usable but less complete sessions
- `weak` for thin sessions

Why it is sent:

- gives the backend an easy confidence label for downstream rules
- helps separate strong behavioural evidence from weak evidence
- supports explainable scoring decisions

---

## `signals.behaviour`

Raw and derived behavioural signals.

```json
{
  "typing": {},
  "pointer": {},
  "hesitation": {},
  "focus": {},
  "diagnostics": {},
  "mode": "mixed",
  "features": {}
}
```

### `typing`

Typing rhythm and paste-related signals.

When no typing data exists (`keyCount === 0`), derived typing features such as `features.typingSpeed` and `features.typingConsistency` are sent as `null` rather than guessed defaults.

```json
{
  "keyCount": 12,
  "inputCount": 12,
  "pasteCount": 0,
  "pasteInPassword": false,
  "pasteTimingMs": null,
  "holdTimeAvg": 82,
  "avgDelay": 110,
  "variance": 20,
  "correctionRate": 0.08
}
```

#### `keyCount`

Number of keyboard events captured.

Why it is sent:

- measures whether enough typing exists for comparison
- supports behaviour completeness logic

#### `inputCount`

Number of input-related edits captured.

Why it is sent:

- complements keyboard events
- helps distinguish typing from autofill or limited interaction

#### `pasteCount`

Number of paste events detected.

Why it is sent:

- helps detect non-typed credential entry
- adds context for login and fraud analysis

#### `pasteInPassword`

Whether a paste event occurred inside a password field.

Why it is sent:

- highlights credential-entry behaviour
- useful for post-analysis and heuristics

#### `pasteTimingMs`

Time from session start to paste event.

Why it is sent:

- gives context around how quickly pasted input happened
- can help identify scripted or rushed flows

#### `holdTimeAvg`

Average time each key was held down between `keydown` and `keyup`.

Why it is sent:

- adds a deeper behavioural biometric than delay alone
- helps distinguish typing style across users and sessions

#### `avgDelay`

Average delay between typing events.

Why it is sent:

- primary typing speed signal
- useful for user-to-user and session-to-session comparison

#### `variance`

Variance of typing delays.

Why it is sent:

- measures rhythm consistency
- useful for behavioural comparison

#### `correctionRate`

Frequency of correction actions such as backspace relative to typing.

Why it is sent:

- captures editing style
- can help distinguish users and session patterns

### `pointer`

Mouse, trackpad, or touch-pointer movement signals.

```json
{
  "movementCount": 42,
  "avgSpeed": 1.2,
  "avgAcceleration": 0.3,
  "clickCount": 2,
  "avgClickInterval": 860,
  "tapCount": 0,
  "avgTapInterval": null
}
```

#### `movementCount`

Number of pointer move samples captured.

Why it is sent:

- measures whether pointer behaviour is rich enough for analysis
- supports behaviour completeness logic

#### `avgSpeed`

Average pointer speed.

Why it is sent:

- provides basic motion style information
- supports behavioural comparison

#### `avgAcceleration`

Average pointer acceleration.

Why it is sent:

- helps distinguish smoother vs more abrupt movement patterns
- supports behavioural comparison

#### `clickCount`

Number of click events detected.

Why it is sent:

- adds interaction richness context
- helps distinguish navigation style

#### `avgClickInterval`

Average time between clicks.

Why it is sent:

- provides click rhythm information
- supports behaviour comparison

#### `tapCount`

Number of touch taps detected.

Why it is sent:

- distinguishes touch interaction from pointer-only interaction
- helps classify session input style

#### `avgTapInterval`

Average time between taps.

Why it is sent:

- provides touch rhythm information
- supports behavioural comparison

### `hesitation`

Start-of-session timing signals.

```json
{
  "timeToFirstInput": 640,
  "sessionDuration": 12000
}
```

#### `timeToFirstInput`

Time from session start to first meaningful input.

Why it is sent:

- measures hesitation before interaction
- useful for comparison and low-signal analysis

#### `sessionDuration`

Observed session duration used for behaviour collection.

Why it is sent:

- gives context for all behaviour measurements
- supports session quality and completeness analysis

### `focus`

Anonymous focus/navigation behaviour between HTML elements.

```json
{
  "focusCount": 3,
  "transitionCount": 2,
  "tabTransitions": 1,
  "pointerTransitions": 1,
  "touchTransitions": 0,
  "keyboardTransitions": 0,
  "unknownTransitions": 0,
  "avgFocusDelay": 740,
  "sequence": [
    {
      "from": "input:email",
      "to": "input:password",
      "method": "tab",
      "delay": 500
    }
  ]
}
```

The SDK keeps anonymity here. It does not send element ids, names, labels, values, or visible text. It only sends coarse element categories such as `input:email`, `input:password`, `button`, `textarea`, `select`, `link`, or `other`.

#### `focusCount`

Total focus events captured.

Why it is sent:

- measures amount of navigational behaviour
- supports low-signal analysis

#### `transitionCount`

Number of recorded focus transitions.

Why it is sent:

- captures how the user moved through the flow
- supports behavioural comparison

#### `tabTransitions`, `pointerTransitions`, `touchTransitions`, `keyboardTransitions`, `unknownTransitions`

Counts of focus changes by input method.

Why they are sent:

- helps distinguish keyboard, mouse, and touch navigation style
- useful for comparing normal user flows against unusual flows

#### `avgFocusDelay`

Average delay between focus changes.

Why it is sent:

- measures hesitation between fields
- supports behavioural comparison

#### `sequence`

Short anonymous sequence of focus transitions.

Why it is sent:

- preserves navigation pattern without exposing field identities
- supports sequence-based comparison and debugging

### `diagnostics`

Collector health and capture diagnostics.

```json
{
  "isStarted": true,
  "startedAt": 356.4,
  "capturedEventCount": 88
}
```

#### `isStarted`

Whether the behaviour collector was active.

Why it is sent:

- helps backend and debugging tools detect invalid behaviour samples

#### `startedAt`

Collector start timestamp relative to page performance timing.

Why it is sent:

- useful for debugging collection issues

#### `capturedEventCount`

Total number of captured interaction events.

Why it is sent:

- summarizes behaviour richness
- feeds session quality calculations

### `mode`

Coarse classification of the behavioural sample.

Current meaning:

- `mixed` when both typing and pointer activity were captured
- `typing` when typing exists without pointer movement
- `pointer` when pointer movement exists without typing
- `minimal` when very little behavioural activity was observed

Why it is sent:

- gives the backend a quick description of the session style
- helps interpret missing typing or pointer data correctly
- supports lightweight rules before deeper feature analysis

### `features`

Derived normalized behaviour values intended for scoring.

```json
{
  "typingSpeed": 0.72,
  "typingConsistency": 0.44,
  "hesitationRatio": 0.05,
  "pointerStability": 0.31
}
```

#### `typingSpeed`

Normalized typing speed feature derived from average key delay.

This field can be `null` when the session contains no typing activity.

Why it is sent:

- gives the backend a compact speed signal
- easier to compare than raw delay alone

#### `typingConsistency`

Normalized typing consistency feature derived from typing variance relative to average delay.

This field can be `null` when the session contains no typing activity.

Why it is sent:

- gives the backend a compact consistency signal
- easier to compare than raw variance alone

#### `hesitationRatio`

Normalized hesitation feature derived from time to first input relative to session duration.

Why it is sent:

- provides a compact start-of-session hesitation signal
- supports lightweight scoring

#### `pointerStability`

Normalized pointer stability feature derived from acceleration relative to speed.

Why it is sent:

- gives the backend a compact movement-style signal
- easier to compare than raw pointer metrics alone

## Backend Notes

The payload intentionally includes both:

- raw signals for debugging, rule-building, and post-analysis
- compact derived signals for scoring and comparison

Recommended backend usage:

- use `clientUserId` as the main user key
- verify `deviceProof.signature` using `deviceProof.publicKey`, the stated `algorithm`, and the stable serialization of the payload without `deviceProof`
- reject or down-score requests when `deviceProof.timestamp` is outside the allowed replay window
- use `signals.identity.deviceFingerprint`, `signals.identity.deviceBindingHash`, `deviceId`, and `trust.isKnownDevice` together for device recognition
- use `signals.sessionQuality` and `signals.identity.fingerprintConfidence` to avoid over-trusting thin sessions
- use `signals.behaviour.features`, `signals.behaviour.mode`, and `signals.interaction.speed` for lightweight comparison
- use `signals.stepUp.score` as an additive confidence signal for high-risk actions rather than as a standalone allow signal
- keep raw `signals.behaviour`, `signals.fingerprint`, and `signals.device` for deeper investigation and model improvements

Suggested scoring approach:

- first-time user or first-time trusted device: allow or `allow_first_time`, but register `publicKey`, `deviceBindingHash`, `deviceFingerprint`, and behaviour baseline
- returning device with valid signature, stable `deviceBindingHash`, strong `sessionQuality.level`, and normal behaviour: high confidence allow
- returning device with valid signature but weak session quality or missing typing data: challenge or lower confidence, not automatic deny
- mismatched `deviceBindingHash`, invalid signature, stale proof timestamp, or unexpected key rotation: high risk
- weak `fingerprintConfidence`, weak `sessionQuality.level`, or pointer-only minimal sessions should cap confidence even if the device is known
- strong `stepUp.score` should increase confidence, especially for sensitive actions like `login`, `password_reset`, `checkout`, or `transfer`
