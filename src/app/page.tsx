'use client';

import React, {
    useRef,
    useState,
} from 'react';

import RootLayout from '@/components/Layout';
import AudioAPI from '@/api/audio';
import AudioRecorded from '@/components/AudioRecorded';
import IndexDBManager from '@/api/indexdb';


const Home = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isRecordingDisabled, setIsRecordingDisabled] = useState(false);
    const [isFreJam, setIsFreJam] = useState(false);
    const [isFreJamDisabled, setIsFreJamDisabled] = useState(false);
    const [audiosRecorded, setAudiosRecorded] = useState<Blob[]>([]);

    const audioAPIRef = useRef(new AudioAPI());
    const indexDBManager = useRef(new IndexDBManager());

    const handleStartRecording = () => {
        audioAPIRef.current.startRecording();
        setIsRecording(true);
    };

    const onStopRecording = async (recordedBlob: Blob) => {
        await indexDBManager.current.addRecording(recordedBlob);

        setAudiosRecorded([...audiosRecorded, recordedBlob]);
    };

    const handleStopRecording = async () => {
        try {
            await audioAPIRef.current.stopRecording(onStopRecording);

            setIsRecording(false);
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

    const onClickFreeJam = () => {
        if (!(isFreJamDisabled)) {
            if (isFreJam) {
                console.log('Ending free jam');
                setIsFreJam(false);
            } else {
                console.log('Starting free jam');
                setIsFreJam(true);
            }
        }
    };

    if (audioAPIRef.current.isBrowserCompatible()) {
        return (
            <RootLayout>
                <button onClick={onClickFreeJam}>
                    {isFreJam ? 'Stop Jam' : 'Start Jam'}
                </button>
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
