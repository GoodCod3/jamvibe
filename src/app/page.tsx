'use client';

import React, {
    useRef,
    useState,
    useMemo,
    useCallback,
    useEffect,
} from 'react';
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import { useWavesurfer } from '@wavesurfer/react';

import RootLayout from '@/components/Layout';
import AudioAPI from '@/api/audio';
import AudioRecorded from '@/components/AudioRecorded';


const formatTime = (seconds: number) => [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':')

const Home = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audiosRecorded, setAudiosRecorded] = useState<Blob[]>([]);
    const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

    const containerRef = useRef(null);
    const audioAPIRef = useRef(new AudioAPI());
    const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
        container: containerRef,
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        url: 'https://cdn.freesound.org/previews/731/731200_1531809-lq.mp3',
        height: 100,
        barWidth: 6,
        barGap: 2,
        barRadius: 2,
        plugins: useMemo(() => [Timeline.create()], []),
    });

    const onPlayPause = useCallback(() => {
        wavesurfer && wavesurfer.playPause();
    }, [wavesurfer]);

    const onClickPlayRecordedAudio = () => {
        const recordedAudioUrl = audioAPIRef.current.getRecordedAudioUrl();
        console.log(recordedAudioUrl);
        setRecordedAudioUrl(recordedAudioUrl);

    };

    const onClickNewRecord = () => {
        if (isRecording) {
            const audioBlobs = audioAPIRef.current.stopRecording();
            if (audioBlobs) {
                setAudiosRecorded([...audioBlobs]);
            }
            setIsRecording(false);
        } else {
            audioAPIRef.current.startRecording();
            setIsRecording(true);
        }
    };

    if (audioAPIRef.current.isBrowserCompatible()) {

        return (
            <RootLayout>
                <div className="save_audio">
                    <div className="audio_data">
                        <div className="file_name">
                            <input type='text' />
                        </div>
                        <div className="current_time">
                            <p>Current time: {formatTime(currentTime)}</p>
                        </div>
                        <div className="export_audio">
                            <button style={{ minWidth: '5em' }}>
                                Save file
                            </button>
                        </div>
                    </div>
                    <div className="play_audio">
                        <button onClick={onPlayPause} style={{ minWidth: '5em' }}>
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>
                    </div>
                </div>
                <div ref={containerRef} />


                <div className="content">
                    <div className="effects"></div>
                    <div className="list_audio">
                        <div className="record_button">
                            <button onClick={onClickNewRecord}>
                                {isRecording ? 'Stop Recording' : 'Start Recording'}
                            </button>
                        </div>

                        <div className="record_audios">
                            <ul>
                                {audiosRecorded.map((audioRecorded, index) => (
                                    <li key={`recorded_${index}`}>
                                        <AudioRecorded 
                                            number={index + 1} 
                                            size={audioRecorded.size}
                                            audioRecorded={audioRecorded}
                                            audioRecordedUrl={audioAPIRef.current.getRecordedAudioUrl(index)}
                                         />
                                    </li>
                                ))}
                            </ul>
                            {/* {recordedAudioUrl && (
                                <div>
                                    <audio src={recordedAudioUrl} controls />
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </RootLayout>
        );
    } else {
        return (
            <RootLayout>
                <div className="compability_error">
                    <h1>Your browser is not compatible, please update it.</h1>
                </div>
            </RootLayout>

        )
    }
};

export default Home;
