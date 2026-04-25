import { useEffect, useRef, useState } from 'react';
import { IdentityClient, type BehaviourSignals } from '@your-sdk/core';

type VerifyResult = {
  success: boolean;
  score: number;
  decision: string;
  isFirstTimeUser?: boolean;
  isKnownDevice: boolean;
  behaviourRisk?: string;
  behaviourMatch?: number;
  scoreBreakdown?: unknown;
  sessionId: string;
  deviceId?: string;
};

export default function App() {
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isClientReady, setIsClientReady] = useState(false);
  const [behaviourDebug, setBehaviourDebug] = useState<BehaviourSignals | null>(null);
  const [stepUpSummary, setStepUpSummary] = useState<string | null>(null);
  const [stepUpSignals, setStepUpSignals] = useState({
    camera: false,
    microphone: false,
    geolocation: true,
    motion: false
  });
  const clientRef = useRef<IdentityClient | null>(null);

  useEffect(() => {
    const client = new IdentityClient({
      apiKey: 'test_key',
      clientUserId: 'user_12345',
      action: 'login',
      endpoint: 'http://localhost:8000',
      stepUp: {
        enabled: true,
        signals: stepUpSignals
      }
    });

    clientRef.current = client;
    setIsClientReady(true);

    const intervalId = window.setInterval(() => {
      setBehaviourDebug(client.getBehaviourDebug());
    }, 500);

    return () => {
      window.clearInterval(intervalId);
      client.destroy();
      clientRef.current = null;
      setIsClientReady(false);
    };
  }, [stepUpSignals]);

  async function handleSubmit(mode: 'standard' | 'step-up') {
    if (username !== 'warodri@gmail.com' || password !== 'Testing123#') {
      setError('Use warodri@gmail.com with password Testing123# for this demo.');
      setResult(null);
      return;
    }

    setError(null);
    setResult(null);
    setStepUpSummary(null);
    setIsLoading(true);

    if (!clientRef.current) {
      setError('SDK client is not ready yet.');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'step-up') {
        const stepUpResult = await clientRef.current.requestStepUpSignals();

        if (stepUpResult) {
          const granted = Object.entries(stepUpResult.granted)
            .map(([key, value]) => `${key}:${value ? 'granted' : 'rejected'}`)
            .join(', ');
          setStepUpSummary(granted || 'Step-up requested with no granted signals.');
        } else {
          setStepUpSummary('Step-up is disabled or not configured.');
        }
      }

      const verifyResult = await clientRef.current.verify();
      setResult(verifyResult);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setPassword('');
      setIsLoading(false);
    }
  }

  const isBadScore = result?.decision === 'challenge';

  return (
    <main className="app">
      <section className="panel">
        <p className="eyebrow">OMWAL Identity SDK</p>
        <h1>Browser signal verification</h1>
        <p className="intro">
          Use the demo credentials, submit the login action, and the SDK will
          send device, browser, and behavioural signals for scoring.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit('standard');
          }}
        >
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="email"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Type anything to create rhythm"
            autoComplete="current-password"
          />
          <fieldset className="stepUpOptions">
            <legend>Step-up permission signals</legend>
            <label className="checkboxRow">
              <input
                type="checkbox"
                checked={stepUpSignals.geolocation}
                onChange={(event) =>
                  setStepUpSignals((current) => ({ ...current, geolocation: event.target.checked }))
                }
              />
              <span>Geolocation</span>
            </label>
            <label className="checkboxRow">
              <input
                type="checkbox"
                checked={stepUpSignals.camera}
                onChange={(event) =>
                  setStepUpSignals((current) => ({ ...current, camera: event.target.checked }))
                }
              />
              <span>Camera</span>
            </label>
            <label className="checkboxRow">
              <input
                type="checkbox"
                checked={stepUpSignals.microphone}
                onChange={(event) =>
                  setStepUpSignals((current) => ({ ...current, microphone: event.target.checked }))
                }
              />
              <span>Microphone</span>
            </label>
            <label className="checkboxRow">
              <input
                type="checkbox"
                checked={stepUpSignals.motion}
                onChange={(event) =>
                  setStepUpSignals((current) => ({ ...current, motion: event.target.checked }))
                }
              />
              <span>Motion</span>
            </label>
          </fieldset>
          <div className="buttonRow">
            <button type="submit" disabled={!isClientReady || isLoading || username.length === 0 || password.length === 0}>
              {isLoading ? 'Verifying...' : 'Verify without permissions'}
            </button>
            <button
              type="button"
              className="secondaryButton"
              disabled={!isClientReady || isLoading || username.length === 0 || password.length === 0}
              onClick={() => void handleSubmit('step-up')}
            >
              {isLoading ? 'Verifying...' : 'Verify with permissions'}
            </button>
          </div>
        </form>

        {stepUpSummary && <p className="status stepUpStatus">{stepUpSummary}</p>}

        <div className="debug">
          <h2>Live behaviour debug</h2>
          <dl>
            <div>
              <dt>Collector active</dt>
              <dd>{behaviourDebug?.diagnostics.isStarted ? 'yes' : 'no'}</dd>
            </div>
            <div>
              <dt>Captured events</dt>
              <dd>{behaviourDebug?.diagnostics.capturedEventCount ?? 0}</dd>
            </div>
            <div>
              <dt>Typing</dt>
              <dd>
                keys {behaviourDebug?.typing.keyCount ?? 0}, inputs {behaviourDebug?.typing.inputCount ?? 0}
              </dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>
                total {behaviourDebug?.focus.focusCount ?? 0}, tab {behaviourDebug?.focus.tabTransitions ?? 0}, pointer{' '}
                {behaviourDebug?.focus.pointerTransitions ?? 0}
              </dd>
            </div>
          </dl>
        </div>

        {isLoading && <p className="status">Collecting signals...</p>}
        {error && <p className="error">{error}</p>}
        {result && (
          <>
            <section className={`verdict ${isBadScore ? 'verdictBad' : 'verdictGood'}`}>
              <p className="verdictLabel">{isBadScore ? 'Challenge' : 'Allowed'}</p>
              <strong>{Math.round(result.score * 100)}%</strong>
              <dl>
                <div>
                  <dt>Decision</dt>
                  <dd>{result.decision}</dd>
                </div>
                <div>
                  <dt>Known device</dt>
                  <dd>{result.isKnownDevice ? 'yes' : 'no'}</dd>
                </div>
                <div>
                  <dt>Behaviour</dt>
                  <dd>{result.behaviourRisk ?? 'unknown'}</dd>
                </div>
              </dl>
            </section>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </>
        )}
      </section>
    </main>
  );
}
