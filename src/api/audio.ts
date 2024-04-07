// class AudioRecorder {
//     private mediaRecorder: MediaRecorder | null = null;
//     private recordedChunks: Blob[] = [];
//     private isRecording: boolean = false;

//     constructor() {
//         if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//             this.startRecording = this.startRecording.bind(this);
//             this.stopRecording = this.stopRecording.bind(this);
//             this.handleDataAvailable = this.handleDataAvailable.bind(this);
//         } else {
//             throw new Error('Your browser does not support audio recording.');
//         }
//     }

//     isBrowserCompatible() {
//         return !!((window && (window as any).AudioContext) && navigator.mediaDevices.getUserMedia);
//     }

//     handleDataAvailable(event: BlobEvent) {
//         if (event.data.size > 0) {
//             console.log("setting audio...");
//             this.recordedChunks.push(event.data);
//         }
//     }

//     async startRecording() {
//         try {
//             this.recordedChunks = [];
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             this.mediaRecorder = new MediaRecorder(stream);
//             this.mediaRecorder.ondataavailable = this.handleDataAvailable;
//             this.mediaRecorder.start();
//             this.isRecording = true;
//         } catch (error) {
//             console.error('Error accessing microphone:', error);
//         }
//     }

//     stopRecording() {
//         if (this.isRecording && this.mediaRecorder && this.mediaRecorder.state === 'recording') {
//             this.mediaRecorder.stop();
//             this.isRecording = false;
//             console.log(this.recordedChunks);
//             return this.recordedChunks;
//             // return new Blob(this.recordedChunks, { type: 'audio/wav' });
//         }
//         return null;
//     }

//     getBlobURL(blobAudios: Blob[]) {
//         const blob = new Blob(blobAudios, { type: 'audio/wav' });
//         return URL.createObjectURL(blob);
//     }
// }

// export default AudioRecorder;


class AudioAPI {
    private mediaRecorder: MediaRecorder | null = null;
    private recordedChunks: Blob[] = [];
    private isRecording: boolean = false;

    constructor() {
        if ((window && (window as any).AudioContext) && navigator.mediaDevices.getUserMedia) {
            this.startRecording = this.startRecording.bind(this);
            this.stopRecording = this.stopRecording.bind(this);
            this.handleDataAvailable = this.handleDataAvailable.bind(this);
        } else {
            throw new Error('Your browser is not compatible, you have to update it.');
        }
    }

    isBrowserCompatible() {
        return !!((window && (window as any).AudioContext) && navigator.mediaDevices.getUserMedia);
    }

    async startRecording() {
        if (!this.isRecording && this.isBrowserCompatible()) {
            try {
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

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.isRecording = false;
            const blobs = [...this.recordedChunks];
            this.recordedChunks = [];

            return blobs;
        }
        return [];
    }

    getRecordedAudioUrl(bloblAudio: Blob) {
        const blob = new Blob([bloblAudio], { type: 'audio/wav' });

        return URL.createObjectURL(blob);
    }
}

export default AudioAPI;
