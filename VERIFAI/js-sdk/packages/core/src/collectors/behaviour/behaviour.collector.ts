import type {
    AttentionSignals,
    InteractionSignals,
    RawBehaviourSignals
} from '../../models/signal.model';

type PointerSample = {
    x: number;
    y: number;
    time: number;
    speed: number;
};

type FocusMethod = 'tab' | 'pointer' | 'touch' | 'keyboard' | 'unknown';

type FocusTransition = {
    from: string | null;
    to: string;
    method: FocusMethod;
    delay: number | null;
};

export class BehaviourCollector {
    private keyTimings: number[] = [];
    private keyHoldTimings: number[] = [];
    private inputTimings: number[] = [];
    private clickTimings: number[] = [];
    private tapTimings: number[] = [];
    private movementSpeeds: number[] = [];
    private movementAccelerations: number[] = [];
    private focusDelays: number[] = [];
    private focusSequence: FocusTransition[] = [];
    private correctionCount = 0;
    private keyCount = 0;
    private inputCount = 0;
    private pasteCount = 0;
    private movementCount = 0;
    private clickCount = 0;
    private tapCount = 0;
    private focusCount = 0;
    private tabTransitions = 0;
    private pointerTransitions = 0;
    private touchTransitions = 0;
    private keyboardTransitions = 0;
    private unknownTransitions = 0;
    private visibilityChanges = 0;
    private hiddenDuringSession = false;
    private scrollUsed = false;
    private lastKeyTime: number | null = null;
    private lastInputTime: number | null = null;
    private lastClickTime: number | null = null;
    private lastTapTime: number | null = null;
    private lastPointer: PointerSample | null = null;
    private lastFocusTime: number | null = null;
    private lastFocusedElementKind: string | null = null;
    private lastFocusMethod: FocusMethod = 'unknown';
    private lastScrollTime: number | null = null;
    private pasteInPassword = false;
    private pasteTimingMs: number | null = null;
    private startedAt = performance.now();
    private firstInputAt: number | null = null;
    private isStarted = false;
    private activeKeydowns = new Map<string, number>();

    start() {
        if (this.isStarted || typeof document === 'undefined') {
            return;
        }

        document.addEventListener('keydown', this.handleKeydown, true);
        document.addEventListener('keyup', this.handleKeyup, true);
        document.addEventListener('beforeinput', this.handleBeforeInput, true);
        document.addEventListener('input', this.handleInput, true);
        document.addEventListener('focusin', this.handleFocusIn, true);
        document.addEventListener('pointerdown', this.handlePointerDown, true);
        document.addEventListener('pointermove', this.handlePointerMove, true);
        document.addEventListener('click', this.handleClick, true);
        document.addEventListener('paste', this.handlePaste, true);
        document.addEventListener('scroll', this.handleScroll, true);
        document.addEventListener('touchstart', this.handleTouchStart, true);
        document.addEventListener('visibilitychange', this.handleVisibilityChange, true);
        this.isStarted = true;
    }

    stop() {
        if (!this.isStarted || typeof document === 'undefined') {
            return;
        }

        document.removeEventListener('keydown', this.handleKeydown, true);
        document.removeEventListener('keyup', this.handleKeyup, true);
        document.removeEventListener('beforeinput', this.handleBeforeInput, true);
        document.removeEventListener('input', this.handleInput, true);
        document.removeEventListener('focusin', this.handleFocusIn, true);
        document.removeEventListener('pointerdown', this.handlePointerDown, true);
        document.removeEventListener('pointermove', this.handlePointerMove, true);
        document.removeEventListener('click', this.handleClick, true);
        document.removeEventListener('paste', this.handlePaste, true);
        document.removeEventListener('scroll', this.handleScroll, true);
        document.removeEventListener('touchstart', this.handleTouchStart, true);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange, true);
        this.isStarted = false;
    }

    getProfile(): RawBehaviourSignals {
        const now = performance.now();

        return {
            typing: {
                keyCount: Math.max(this.keyCount, this.inputCount),
                inputCount: this.inputCount,
                pasteCount: this.pasteCount,
                pasteInPassword: this.pasteInPassword,
                pasteTimingMs: this.pasteTimingMs,
                holdTimeAvg: average(this.keyHoldTimings),
                avgDelay: average(this.keyTimings) ?? average(this.inputTimings),
                variance: variance(this.keyTimings) ?? variance(this.inputTimings),
                correctionRate: Math.max(this.keyCount, this.inputCount) > 0
                    ? this.correctionCount / Math.max(this.keyCount, this.inputCount)
                    : 0
            },
            pointer: {
                movementCount: this.movementCount,
                avgSpeed: average(this.movementSpeeds),
                avgAcceleration: average(this.movementAccelerations),
                clickCount: this.clickCount,
                avgClickInterval: average(this.clickTimings),
                tapCount: this.tapCount,
                avgTapInterval: average(this.tapTimings)
            },
            hesitation: {
                timeToFirstInput: this.firstInputAt ? this.firstInputAt - this.startedAt : null,
                sessionDuration: now - this.startedAt
            },
            focus: {
                focusCount: this.focusCount,
                transitionCount: this.focusSequence.length,
                tabTransitions: this.tabTransitions,
                pointerTransitions: this.pointerTransitions,
                touchTransitions: this.touchTransitions,
                keyboardTransitions: this.keyboardTransitions,
                unknownTransitions: this.unknownTransitions,
                avgFocusDelay: average(this.focusDelays),
                sequence: this.focusSequence.slice(-10)
            },
            diagnostics: {
                isStarted: this.isStarted,
                startedAt: this.startedAt,
                capturedEventCount: this.keyCount + this.inputCount + this.movementCount + this.clickCount + this.tapCount + this.focusCount
            }
        };
    }

    getAttentionProfile(): AttentionSignals {
        return {
            hiddenDuringSession: this.hiddenDuringSession,
            visibilityChanges: this.visibilityChanges
        };
    }

    getInteractionProfile(): InteractionSignals {
        const now = performance.now();
        const lastActivityTime = [
            this.lastKeyTime,
            this.lastInputTime,
            this.lastScrollTime,
            this.lastFocusTime,
            this.lastTapTime,
            this.lastPointer?.time ?? null
        ].reduce<number | null>((latest, value) => {
            if (value === null) {
                return latest;
            }

            return latest === null ? value : Math.max(latest, value);
        }, null);

        return {
            idleBeforeSubmit: lastActivityTime === null ? now - this.startedAt : now - lastActivityTime,
            scrollUsed: this.scrollUsed
        };
    }

    reset() {
        this.keyTimings = [];
        this.keyHoldTimings = [];
        this.inputTimings = [];
        this.clickTimings = [];
        this.tapTimings = [];
        this.movementSpeeds = [];
        this.movementAccelerations = [];
        this.focusDelays = [];
        this.focusSequence = [];
        this.correctionCount = 0;
        this.keyCount = 0;
        this.inputCount = 0;
        this.pasteCount = 0;
        this.movementCount = 0;
        this.clickCount = 0;
        this.tapCount = 0;
        this.focusCount = 0;
        this.tabTransitions = 0;
        this.pointerTransitions = 0;
        this.touchTransitions = 0;
        this.keyboardTransitions = 0;
        this.unknownTransitions = 0;
        this.visibilityChanges = 0;
        this.hiddenDuringSession = false;
        this.scrollUsed = false;
        this.lastKeyTime = null;
        this.lastInputTime = null;
        this.lastClickTime = null;
        this.lastTapTime = null;
        this.lastPointer = null;
        this.lastFocusTime = null;
        this.lastFocusedElementKind = null;
        this.lastFocusMethod = 'unknown';
        this.lastScrollTime = null;
        this.pasteInPassword = false;
        this.pasteTimingMs = null;
        this.startedAt = performance.now();
        this.firstInputAt = null;
        this.activeKeydowns.clear();
    }

    private handleKeydown = (event: KeyboardEvent) => {
        const now = performance.now();
        this.markFirstInput(now);

        if (this.lastKeyTime !== null) {
            this.keyTimings.push(now - this.lastKeyTime);
        }

        if (event.key === 'Backspace' || event.key === 'Delete') {
            this.correctionCount += 1;
        }

        if (event.key === 'Tab') {
            this.lastFocusMethod = 'tab';
        } else if (event.key === 'Enter' || event.key === ' ') {
            this.lastFocusMethod = 'keyboard';
        }

        this.keyCount += 1;
        this.lastKeyTime = now;
        this.activeKeydowns.set(event.code || event.key, now);
    };

    private handleKeyup = (event: KeyboardEvent) => {
        const now = performance.now();
        const keyId = event.code || event.key;
        const keydownTime = this.activeKeydowns.get(keyId);

        if (keydownTime !== undefined) {
            this.keyHoldTimings.push(now - keydownTime);
            this.activeKeydowns.delete(keyId);
        }
    };

    private handleBeforeInput = (event: InputEvent) => {
        if (event.inputType === 'deleteContentBackward' || event.inputType === 'deleteContentForward') {
            this.correctionCount += 1;
        }

        if (event.inputType === 'insertFromPaste') {
            this.pasteCount += 1;
        }
    };

    private handlePaste = (event: ClipboardEvent) => {
        const now = performance.now();
        this.markFirstInput(now);
        this.pasteCount += 1;
        this.pasteTimingMs = now - this.startedAt;
        this.pasteInPassword = isPasswordInput(event.target);
    };

    private handleInput = (event: Event) => {
        const target = event.target;

        if (!isTextInput(target)) {
            return;
        }

        const now = performance.now();
        this.markFirstInput(now);

        if (this.lastInputTime !== null) {
            this.inputTimings.push(now - this.lastInputTime);
        }

        this.inputCount += 1;
        this.lastInputTime = now;
    };

    private handleFocusIn = (event: FocusEvent) => {
        const targetKind = anonymizeElement(event.target);

        if (!targetKind) {
            return;
        }

        const now = performance.now();
        const delay = this.lastFocusTime === null ? null : now - this.lastFocusTime;
        this.markFirstInput(now);
        this.focusCount += 1;

        if (delay !== null) {
            this.focusDelays.push(delay);
        }

        this.incrementFocusMethod(this.lastFocusMethod);
        this.focusSequence.push({
            from: this.lastFocusedElementKind,
            to: targetKind,
            method: this.lastFocusMethod,
            delay
        });

        if (this.focusSequence.length > 20) {
            this.focusSequence.shift();
        }

        this.lastFocusedElementKind = targetKind;
        this.lastFocusTime = now;
        this.lastFocusMethod = 'unknown';
    };

    private handlePointerDown = (event: PointerEvent) => {
        this.lastFocusMethod = event.pointerType === 'touch' ? 'touch' : 'pointer';
    };

    private handlePointerMove = (event: PointerEvent) => {
        const now = performance.now();
        this.markFirstInput(now);

        if (this.lastPointer) {
            const distance = Math.hypot(event.clientX - this.lastPointer.x, event.clientY - this.lastPointer.y);
            const deltaSeconds = Math.max((now - this.lastPointer.time) / 1000, 0.001);
            const speed = distance / deltaSeconds;

            this.movementSpeeds.push(speed);
            this.movementAccelerations.push(Math.abs(speed - this.lastPointer.speed) / deltaSeconds);
            this.movementCount += 1;
            this.lastPointer = {
                x: event.clientX,
                y: event.clientY,
                time: now,
                speed
            };
            return;
        }

        this.lastPointer = {
            x: event.clientX,
            y: event.clientY,
            time: now,
            speed: 0
        };
    };

    private handleClick = () => {
        const now = performance.now();
        this.markFirstInput(now);

        if (this.lastClickTime !== null) {
            this.clickTimings.push(now - this.lastClickTime);
        }

        this.clickCount += 1;
        this.lastClickTime = now;
    };

    private handleTouchStart = () => {
        const now = performance.now();
        this.markFirstInput(now);
        this.lastFocusMethod = 'touch';

        if (this.lastTapTime !== null) {
            this.tapTimings.push(now - this.lastTapTime);
        }

        this.tapCount += 1;
        this.lastTapTime = now;
    };

    private handleScroll = () => {
        const now = performance.now();
        this.markFirstInput(now);
        this.scrollUsed = true;
        this.lastScrollTime = now;
    };

    private handleVisibilityChange = () => {
        this.visibilityChanges += 1;

        if (document.visibilityState === 'hidden') {
            this.hiddenDuringSession = true;
        }
    };

    private incrementFocusMethod(method: FocusMethod) {
        if (method === 'tab') {
            this.tabTransitions += 1;
            return;
        }

        if (method === 'pointer') {
            this.pointerTransitions += 1;
            return;
        }

        if (method === 'touch') {
            this.touchTransitions += 1;
            return;
        }

        if (method === 'keyboard') {
            this.keyboardTransitions += 1;
            return;
        }

        this.unknownTransitions += 1;
    }

    private markFirstInput(time: number) {
        if (this.firstInputAt === null) {
            this.firstInputAt = time;
        }
    }
}

function average(values: number[]) {
    if (values.length === 0) {
        return null;
    }

    return values.reduce((total, value) => total + value, 0) / values.length;
}

function variance(values: number[]) {
    const mean = average(values);

    if (mean === null) {
        return null;
    }

    return values.reduce((total, value) => total + Math.pow(value - mean, 2), 0) / values.length;
}

function isTextInput(target: EventTarget | null) {
    if (target instanceof HTMLTextAreaElement) {
        return true;
    }

    if (!(target instanceof HTMLInputElement)) {
        return false;
    }

    return ['email', 'password', 'search', 'tel', 'text', 'url'].includes(target.type);
}

function isPasswordInput(target: EventTarget | null) {
    return target instanceof HTMLInputElement && target.type === 'password';
}

function anonymizeElement(target: EventTarget | null) {
    if (!(target instanceof Element)) {
        return null;
    }

    const tagName = target.tagName.toLowerCase();

    if (target instanceof HTMLInputElement) {
        const safeTypes = ['email', 'number', 'password', 'search', 'tel', 'text', 'url'];
        const type = safeTypes.includes(target.type) ? target.type : 'other';

        return `input:${type}`;
    }

    if (target instanceof HTMLTextAreaElement) {
        return 'textarea';
    }

    if (target instanceof HTMLSelectElement) {
        return 'select';
    }

    if (target instanceof HTMLButtonElement) {
        return 'button';
    }

    if (target instanceof HTMLAnchorElement) {
        return 'link';
    }

    if (target.getAttribute('contenteditable') === 'true') {
        return 'contenteditable';
    }

    return tagName === 'body' ? null : 'other';
}
