import { makeDistortionCurve } from './effects/';

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
                amount: 800,
            }
        },
        delay: {
            enabled: false,
            node: null,
            settings: {
                delayTime: 0,
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
                distortionNode.curve = makeDistortionCurve(settings.amount);
                distortionNode.oversample = '4x';
                return distortionNode;
            case 'delay':
                const delayNode = this.audioContext!.createDelay();
                delayNode.delayTime.value = settings.delayTime;
                return delayNode;
            default:
                return null;
        }
    }

    restartAudioCapture(): void {
        this.stopAudioCapture();
        this.startAudioCapture();
    }

    initAudioContext(): void {
        // const bufferSize = 4096

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

                    console.log('Buffer size:', this.audioContext!.baseLatency);
                    console.log('Output latency:', this.audioContext!.outputLatency);
                    console.log('Latency:', this.audioContext!.outputLatency);

                    let guitarInput = this.audioContext!.createMediaStreamSource(this.guitarStream);
                    for (const effectName in this.effects) {
                        const effect = this.effects[effectName];
                        if (effect.enabled || true) {
                            console.log(`Applying effect: ${effectName}`);
                            console.log(effect.settings);
                            console.log("-------------");
                            effect.node = this.createEffectNode(effectName, effect.settings);
                            guitarInput.connect(effect.node);
                            guitarInput = effect.node;
                        }
                    }

                    // Crear y conectar el nodo de ganancia
                    const gainNode = this.audioContext!.createGain();
                    gainNode.gain.value = 1;
                    guitarInput.connect(gainNode);


                    // Conectar el nodo de ganancia al destino de audio
                    gainNode.connect(this.audioContext!.destination);

                })
                .catch(error => {
                    console.error('Error accessing microphone:', error);
                });
        } else {
            console.error('AudioContext not initialized.');
            return;
        }
    }


    startAudioCapture2(): void {
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
                    console.log('Latency:', this.audioContext!.outputLatency);
                    let guitarInput = this.audioContext!.createMediaStreamSource(this.guitarStream);
                    for (const effectName in this.effects) {
                        const effect = this.effects[effectName];
                        if (effect.enabled || true) {
                            console.log(`Aplicando el efecto: ${effectName}`);
                            console.log(effect.settings);
                            console.log("-------------");
                            effect.node = this.createEffectNode(effectName, effect.settings);

                            guitarInput.connect(effect.node);
                            guitarInput = effect.node;
                        }
                    }

                    const outputNode: AudioNode = this.audioContext!.destination;
                    const gainNode = this.audioContext!.createGain();
                    gainNode.gain.value = 1;
                    outputNode.connect(gainNode); // Conecta la ganancia al destino de audio
                    gainNode.connect(this.audioContext!.destination); // Conecta la ganancia al destino de audio




                    // const outputNode = this.audioContext!.createMediaStreamDestination();

                    // guitarInput.connect(outputNode);
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
        if (event.data && event.data.size > 0) {
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
