// server/index.js

import express from 'express';

const app = express();
const devicesByUser = new Map();
const behaviourBaselines = new Map();
const verificationEvents = [];

app.use((req, res, next) => {
    const origin = req.get('origin');

    if (origin && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }

    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
    }

    next();
});
app.use(express.json());

app.post('/v1/verify', (req, res) => {
    const { action, clientUserId, deviceId, platform, signals, sessionId } = req.body;

    if (!clientUserId || !action || !deviceId || !sessionId || !signals) {
        res.status(400).json({
            success: false,
            error: 'Missing required fields: clientUserId, action, deviceId, sessionId, signals'
        });
        return;
    }

    if (platform !== 'js') {
        res.status(400).json({
            success: false,
            error: 'Unsupported or missing platform'
        });
        return;
    }

    const existingUserDevices = devicesByUser.get(clientUserId);
    const isFirstTimeUser = !existingUserDevices;
    const userDevices = existingUserDevices ?? new Set();
    const isKnownDevice = userDevices.has(deviceId);
    const behaviourResult = scoreBehaviour(`${clientUserId}:${deviceId}`, signals.behaviour);
    const scoreResult = scoreVerification({ behaviourResult, isKnownDevice, signals });

    if (!isKnownDevice) {
        userDevices.add(deviceId);
        devicesByUser.set(clientUserId, userDevices);
    }

    const decision = decide({
        behaviourRisk: behaviourResult.risk,
        isFirstTimeUser,
        score: scoreResult.score
    });
    const response = {
        success: true,
        score: scoreResult.score,
        decision,
        isFirstTimeUser,
        isKnownDevice,
        behaviourRisk: behaviourResult.risk,
        behaviourMatch: behaviourResult.match,
        behaviourBaselineUpdated: behaviourResult.baselineUpdated,
        scoreBreakdown: scoreResult.breakdown,
        action,
        deviceId,
        sessionId
    };
    const event = {
        receivedAt: new Date().toISOString(),
        request: req.body,
        response,
        scoreFactors: scoreResult.factors
    };

    verificationEvents.push(event);
    printVerificationEvent(event);

    res.json(response);
});

app.get('/debug/verifications', (req, res) => {
    res.json({
        count: verificationEvents.length,
        events: verificationEvents
    });
});

app.listen(8000, () => {
    console.log('Server running on port 8000');
});

function scoreBehaviour(key, behaviour) {
    if (!hasUsableBehaviour(behaviour)) {
        return {
            risk: 'insufficient-data',
            match: 0.5,
            baselineUpdated: false
        };
    }

    const current = toBehaviourProfile(behaviour);
    const baseline = behaviourBaselines.get(key);

    if (!baseline) {
        behaviourBaselines.set(key, current);
        return {
            risk: 'insufficient-data',
            match: 0.6,
            baselineUpdated: true
        };
    }

    const typingDiff = Math.abs(current.avgDelay - baseline.avgDelay);
    const speedDiff = Math.abs(current.interactionSpeed - baseline.interactionSpeed);
    const correctionDiff = Math.abs(current.correctionRate - baseline.correctionRate);
    const drift = typingDiff / 180 + speedDiff / 1400 + correctionDiff * 2;
    const match = Math.max(0, Math.min(1, 1 - drift));
    let risk = 'normal';

    if (match < 0.35) {
        risk = 'high-risk';
    } else if (match < 0.55) {
        risk = 'medium-risk';
    }

    if (risk === 'normal') {
        behaviourBaselines.set(key, mergeBehaviourProfile(baseline, current));
    }

    return {
        risk,
        match,
        baselineUpdated: risk === 'normal'
    };
}

function scoreVerification({ behaviourResult, isKnownDevice, signals }) {
    const deviceScore = isKnownDevice ? 0.8 : 0.4;
    const behaviourScore = behaviourResult.match ?? 0.5;
    let environmentScore = 0.5;
    const factors = [
        { name: 'device_score', impact: deviceScore },
        { name: `behaviour_${behaviourResult.risk}`, impact: behaviourScore }
    ];

    if (signals.device.userAgent.includes('Chrome')) {
        environmentScore += 0.05;
        factors.push({ name: 'chrome_browser', impact: 0.05 });
    }

    if (signals.browser.screen.width > 1000) {
        environmentScore += 0.03;
        factors.push({ name: 'desktop_width', impact: 0.03 });
    }

    environmentScore = Math.min(1, environmentScore);
    factors.push({ name: 'environment_score', impact: environmentScore });

    const weightedScore =
        deviceScore * 0.4 +
        behaviourScore * 0.5 +
        environmentScore * 0.1;

    let score = Math.max(0, Math.min(1, weightedScore));

    if (behaviourResult.risk === 'medium-risk') {
        score = Math.min(score, 0.74);
        factors.push({ name: 'medium_behaviour_cap', impact: 'cap:0.74' });
    }

    if (behaviourResult.risk === 'high-risk') {
        score = 0.4;
        factors.push({ name: 'high_behaviour_hard_rule', impact: 'score:0.40' });
    }

    return {
        score,
        breakdown: {
            deviceScore,
            behaviourScore,
            environmentScore,
            weights: {
                device: 0.4,
                behaviour: 0.5,
                environment: 0.1
            }
        },
        factors
    };
}

function hasUsableBehaviour(behaviour) {
    return Boolean(
        behaviour &&
        behaviour.typing &&
        behaviour.typing.keyCount >= 3 &&
        typeof behaviour.typing.avgDelay === 'number'
    );
}

function toBehaviourProfile(behaviour) {
    return {
        avgDelay: behaviour.typing.avgDelay,
        variance: behaviour.typing.variance ?? 0,
        correctionRate: behaviour.typing.correctionRate ?? 0,
        interactionSpeed: behaviour.pointer?.avgSpeed ?? 0
    };
}

function mergeBehaviourProfile(baseline, current) {
    return {
        avgDelay: movingAverage(baseline.avgDelay, current.avgDelay),
        variance: movingAverage(baseline.variance, current.variance),
        correctionRate: movingAverage(baseline.correctionRate, current.correctionRate),
        interactionSpeed: movingAverage(baseline.interactionSpeed, current.interactionSpeed)
    };
}

function movingAverage(previous, next) {
    return previous * 0.8 + next * 0.2;
}

function decide({ behaviourRisk, isFirstTimeUser, score }) {
    if (isFirstTimeUser) {
        return 'allow_first_time';
    }

    if (behaviourRisk === 'insufficient-data' || behaviourRisk === 'medium-risk' || behaviourRisk === 'high-risk') {
        return 'challenge';
    }

    return score > 0.75 ? 'allow' : 'challenge';
}

function printVerificationEvent(event) {
    const { request, response, scoreFactors } = event;
    const isAllowed = response.decision !== 'challenge';
    const color = isAllowed ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';
    const label = response.decision === 'allow_first_time'
        ? 'FIRST TIME ALLOW'
        : isAllowed
            ? 'GOOD SCORE'
            : 'LOW SCORE';
    const lines = [
        '============================================================',
        ` ${label} | ${response.decision.toUpperCase()} | score=${response.score.toFixed(3)}`,
        '============================================================',
        ` clientUserId: ${request.clientUserId}`,
        ` action:       ${request.action}`,
        ` deviceId:     ${request.deviceId}`,
        ` sessionId:    ${request.sessionId}`,
        ` firstTime:    ${response.isFirstTimeUser}`,
        ` knownDevice:  ${response.isKnownDevice}`,
        ` behaviour:    ${response.behaviourRisk} match=${response.behaviourMatch}`,
        ` storedEvents: ${verificationEvents.length}`,
        ` factors:      ${scoreFactors.map((factor) => `${factor.name}:${formatImpact(factor.impact)}`).join(', ')}`
    ];

    console.log(`${color}\n${lines.join('\n')}\n${reset}`);
}

function formatImpact(impact) {
    if (typeof impact === 'string') {
        return impact;
    }

    return `${impact >= 0 ? '+' : ''}${impact.toFixed(2)}`;
}
