
type EffectSettings = Record<string, any>;

type Effect = {
    enabled: boolean;
    node: any;
    settings: EffectSettings;
};

type Effects = {
    [key: string]: Effect;
};

class AudioAPI {
    private mediaRecorder: MediaRecorder | null = null;
    private recordedChunks: Blob[] = [];
    private isRecording: boolean = false;

    // Audio capture
    private audioContext: AudioContext | null = null;
    private guitarStream: MediaStream | null = null;
    private guitarInput: MediaStreamAudioSourceNode | null = null;
    private delayNode: DelayNode | null = null;
    private effects: Effects = {
        distortion: {
            enabled: false,
            node: null,
            settings: {
                amount: 400,
            }
        },
        delay: {
            enabled: false,
            node: null,
            settings: {
                delayTime: 0.5,
            }
        }
    };

    constructor() {
        if (this.isBrowserCompatible()) {
            this.startRecording = this.startRecording.bind(this);
            this.stopRecording = this.stopRecording.bind(this);
            this.handleDataAvailable = this.handleDataAvailable.bind(this);
            this.startAudioCapture = this.startAudioCapture.bind(this);
            this.initAudioContext = this.initAudioContext.bind(this);
            this.stopAudioCapture = this.stopAudioCapture.bind(this);
            this.updateEffectSettings = this.updateEffectSettings.bind(this);
        } else {
            throw new Error('Your browser is not compatible, you have to update it.');
        }
    }

    isBrowserCompatible() {
        return !!((window && (window as any).AudioContext) && navigator.mediaDevices.getUserMedia);
    }

    createEffectNode(effectName: string, settings: any): any {
        console.log(`Creatring effect: ${effectName}`);

        switch (effectName) {
            case 'distortion':
                const distortionNode = this.audioContext!.createWaveShaper();
                distortionNode.curve = this.makeDistortionCurve(settings.amount);
                return distortionNode;
            case 'delay':
                const delayNode = this.audioContext!.createDelay();
                delayNode.delayTime.value = settings.delayTime;
                return delayNode;
            default:
                return null;
        }
    }

    makeDistortionCurve(amount: number): Float32Array {
        const sampleCount = 44100;
        const curve = new Float32Array(sampleCount);
        const deg = Math.PI / 180;

        for (let i = 0; i < sampleCount; ++i) {
            const x = (i * 2) / sampleCount - 1;
            curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
        }

        return curve;
    }

    restartAudioCapture(): void {
        this.stopAudioCapture();
        this.startAudioCapture();
    }

    initAudioContext(): void {
        const bufferSize = 4096

        this.audioContext = new AudioContext();
        // this.audioContext = new AudioContext({ sampleRate: bufferSize });
    }

    startAudioCapture(): void {
        if (this.audioContext) {
            navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false,
                }
            })
                .then(stream => {
                    this.guitarStream = stream;
                    console.log('Tamaño del búfer actual:', this.audioContext!.baseLatency);
                    console.log('Tamaño del búfer actual:', this.audioContext!.outputLatency);
                    let guitarInput = this.audioContext!.createMediaStreamSource(this.guitarStream);
                    // for (const effectName in this.effects) {
                    //     const effect = this.effects[effectName];
                    //     if (effect.enabled) {
                    //         console.log(`Aplicando el efecto: ${effectName}`);
                    //         console.log(effect.settings);
                    //         console.log("-------------");
                    //         effect.node = this.createEffectNode(effectName, effect.settings);
                    //         guitarInput.connect(effect.node);
                    //         guitarInput = effect.node;
                    //     }
                    // }

                    const outputNode = this.audioContext!.destination;

                    guitarInput.connect(outputNode);
                })
                .catch(error => {
                    console.error('Error accessing microphone:', error);
                });
        } else {
            console.error('AudioContext not initialized.');
            return;

        }
    }

    stopAudioCapture(): void {
        if (this.guitarStream) {
            this.guitarStream.getTracks().forEach(track => {
                track.stop();
            });

            this.guitarStream = null;
        }
    }

    updateEffectSettings(effectName: string, settings: any): void {
        if (this.effects[effectName]) {
            this.effects[effectName].settings = settings;
            if (this.effects[effectName].enabled && this.effects[effectName].node) {
                const updatedNode = this.createEffectNode(effectName, settings);
                this.effects[effectName].node = updatedNode;
                this.restartAudioCapture();
            }
        } else {
            console.log(this.effects)
            console.log(effectName)
        }
    }

    toggleEffectEnabled(effectName: string, isEnabled: boolean): void {
        const effectEntry: [string, Effect] | undefined = Object.entries(this.effects).find(([key]) => key === effectName);
        if (effectEntry) {
            const effect = effectEntry[1];
            effect.enabled = isEnabled;
        }
    }

    async startRecording() {
        if (!this.isRecording && this.isBrowserCompatible()) {
            try {
                this.recordedChunks = [];
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.ondataavailable = this.handleDataAvailable;
                this.mediaRecorder.start();
                this.isRecording = true;
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        }
    }

    handleDataAvailable(event: BlobEvent) {
        if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
        }
    }

    async stopRecording(onRecordingStop: (blob: Blob) => void) {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.addEventListener('stop', () => {
                const recordedBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });

                onRecordingStop(recordedBlob);
            });
            this.mediaRecorder.stop();
            this.isRecording = false;
        }
    }

    getRecordedAudioUrl(bloblAudio: Blob) {
        const blob = new Blob([bloblAudio], { type: 'audio/wav' });

        return URL.createObjectURL(blob);
    }
}

export default AudioAPI;
