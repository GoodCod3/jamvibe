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
    const [isFreeJam, setisFreeJam] = useState(false);
    const [audiosRecorded, setAudiosRecorded] = useState<Blob[]>([]);
    // Effects states
    const [isdistortionApplied, setIsdistortionApplied] = useState(false);

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
        if (isFreeJam) {
            audioAPIRef.current.stopAudioCapture();
            setisFreeJam(false);
        } else {
            audioAPIRef.current.initAudioContext();
            audioAPIRef.current.startAudioCapture();
            setisFreeJam(true);
        }
    };

    const onClickDistortion = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newState = !isdistortionApplied;
        audioAPIRef.current.updateEffectSettings('distortion', { amount: 400 });
        setIsdistortionApplied(newState);
    };

    if (audioAPIRef.current.isBrowserCompatible()) {
        return (
            <RootLayout>
                <button onClick={onClickFreeJam}>
                    {isFreeJam ? 'Stop Jam' : 'Start Jam'}
                </button>
                <div className="content">
                    <div className="effects">
                        <label>
                            <input type='checkbox' value={'distortion'} name="distortion_effect" onChange={onClickDistortion} />
                            Distortion
                        </label>
                    </div>
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
