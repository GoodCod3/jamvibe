'use client';

import React, {
    useRef,
    useState,
} from 'react';

import RootLayout from '@/components/Layout';
import AudioAPI from '@/api/audio';
import AudioRecorded from '@/components/AudioRecorded';


const Home = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audiosRecorded, setAudiosRecorded] = useState<Blob[]>([]);

    const audioAPIRef = useRef(new AudioAPI());

    const handleStartRecording = () => {
        audioAPIRef.current.startRecording();
        setIsRecording(true);
    };

    const handleStopRecording = async () => {
        try {
            await audioAPIRef.current.stopRecording();

            const recordedBlob = audioAPIRef.current.getLastRecordedBlob();

            setIsRecording(false);

            if (recordedBlob) {
                setAudiosRecorded([...audiosRecorded, ...[recordedBlob]]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onClickNewRecordButton = () => {
        if (isRecording) {
            handleStopRecording();
        } else {
            handleStartRecording();
        }
    };

    if (audioAPIRef.current.isBrowserCompatible()) {
        return (
            <RootLayout>
                <div className="content">
                    <div className="effects"></div>
                    <div className="list_audio">
                        <div className="record_button">
                            <button onClick={onClickNewRecordButton}>
                                {isRecording ? 'Stop Recording' : 'Start Recording'}
                            </button>
                        </div>

                        <div className="record_audios">
                            <ul>
                                {audiosRecorded.map((audioRecorded, index) => (
                                    <li key={`recorded_${index}`}>
                                        <AudioRecorded
                                            number={index + 1}
                                            audioRecorded={audioRecorded}
                                            audioRecordedUrl={audioAPIRef.current.getRecordedAudioUrl(audioRecorded)}
                                        />
                                    </li>
                                ))}
                            </ul>
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
