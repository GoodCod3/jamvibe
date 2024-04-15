'use client';

import React, { useRef, useState, useEffect } from 'react';


import AudioAPI from '../api/audio';
import IndexDBManager from '../api/indexdb';
import AudioRecorded from '../components/AudioRecorded';
import PedalEffect from './effects/Pedal';
import { effects } from '../constants/effects';
import { IEffect } from '../interfaces/effects';


const Home = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isFreeJam, setisFreeJam] = useState(false);
    const [audiosRecorded, setAudiosRecorded] = useState<Blob[]>([]);
    const [activeEffects, setActiveEffects] = useState<IEffect[]>(effects);

    // Effects states
    const audioAPIRef = useRef(new AudioAPI());
    const indexDBManager = useRef(new IndexDBManager());

    useEffect(() => {
        audioAPIRef.current.stopAudioCapture();
        audioAPIRef.current.startAudioCapture(activeEffects);
    }, [activeEffects]);

    const handleStartRecording = () => {
        if (audiosRecorded.length >= 1) {
            alert('You can recorded just one song for now.');
        } else {
            audioAPIRef.current.startRecording();
            setIsRecording(true);

        }
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
            audioAPIRef.current.startAudioCapture(activeEffects);
            setisFreeJam(true);
        }
    };

    const onClickDistortion = (isEnabled: boolean) => {
        activateEffect('Distortion', isEnabled);
    };

    const activateEffect = (effectName: String, isEnabled: boolean) => {
        const updateEffects = activeEffects.map((activeEffect) => {
            if (activeEffect.name === effectName) {
                return { ...activeEffect, enabled: isEnabled };
            }
            return activeEffect;
        });

        setActiveEffects(updateEffects);
    };

    const onRotateKnob = (value: number, settingKey: string, effectName: string) => {
        const updateEffects = activeEffects.map((activeEffect) => {
            if (activeEffect.name === effectName) {
                const updatedSettings = { ...activeEffect.settings };
                updatedSettings[settingKey].value = value;

                return { ...activeEffect, settings: updatedSettings };
            }
            return activeEffect;
        });

        setActiveEffects(updateEffects);
    };

    if (audioAPIRef.current.isBrowserCompatible()) {
        return (
            <>
                <button onClick={onClickFreeJam}>
                    {isFreeJam ? 'Stop Jam' : 'Start Jam'}
                </button>
                <div className="content">
                    <div className="effects">
                        {effects.map((effect, index) => (
                            <PedalEffect
                                key={`pedal_effect_${index}`}
                                onClick={onClickDistortion}
                                onRotateKnob={(value: number, settingKey: string) => onRotateKnob(value, settingKey, effect.name)}
                                {...effect}
                            />
                        ))}
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
            </>
        );
    } else {
        return (
            <>
                <div className="compability_error">
                    <h1>Your browser is not compatible, please update it.</h1>
                </div>
            </>

        )
    }
};

export default Home;
