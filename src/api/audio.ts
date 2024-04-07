class AudioAPI {
    private mediaRecorder: MediaRecorder | null = null;
    private recordedChunks: Blob[] = [];

    constructor() {
        if ((window && (window as any).AudioContext) && navigator.mediaDevices.getUserMedia) {
            this.startRecording = this.startRecording.bind(this);
        } else {
            throw new Error('Your browser is not compatible, you have to update it.');
        }
    }

    isBrowserCompatible() {
        return !!((window && (window as any).AudioContext) && navigator.mediaDevices.getUserMedia);

    }

    async startRecording() {
        if (this.isBrowserCompatible()) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
                this.mediaRecorder.start();
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

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();

            return this.recordedChunks;
        }
    }

    getAudiosRecorded() {
        return this.recordedChunks;
    }

    getRecordedAudioUrl(index:number) {
        const blob = new Blob([this.recordedChunks[index]], { type: 'audio/wav' });
        return URL.createObjectURL(blob);
    }
}

export default AudioAPI;
