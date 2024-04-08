class AudioAPI {
    private mediaRecorder: MediaRecorder | null = null;
    private recordedChunks: Blob[] = [];
    private isRecording: boolean = false;

    // Audio capture
    private audioContext: AudioContext | null = null;
    private guitarStream: MediaStream | null = null;
    private guitarInput: MediaStreamAudioSourceNode | null = null;
    private delayNode: DelayNode | null = null;

    constructor() {

        if (this.isBrowserCompatible()) {
            this.startRecording = this.startRecording.bind(this);
            this.stopRecording = this.stopRecording.bind(this);
            this.handleDataAvailable = this.handleDataAvailable.bind(this);
            this.startAudioCapture = this.startAudioCapture.bind(this);
            this.initAudioContext = this.initAudioContext.bind(this);
            this.stopAudioCapture = this.stopAudioCapture.bind(this);
        } else {
            throw new Error('Your browser is not compatible, you have to update it.');
        }
    }

    isBrowserCompatible() {
        return !!((window && (window as any).AudioContext) && navigator.mediaDevices.getUserMedia);
    }

    initAudioContext(): void {
        this.audioContext = new AudioContext();
    }

    startAudioCapture(): void {
        if (this.audioContext) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    this.guitarStream = stream;
                    const guitarInput = this.audioContext.createMediaStreamSource(this.guitarStream);
                    const outputNode = this.audioContext.destination;

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
