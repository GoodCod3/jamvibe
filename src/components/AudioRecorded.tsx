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


type IAudioRecorded = {
    number: number,
    size: number,
    audioRecorded: Blob,
    audioRecordedUrl: string,
};

const AudioRecorded = ({ number, size, audioRecorded, audioRecordedUrl }: IAudioRecorded) => {
    const containerRef = useRef(null);
    const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
        container: containerRef,
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        url: audioRecordedUrl,
        height: 100,
        barWidth: 6,
        barGap: 2,
        barRadius: 2,
        plugins: useMemo(() => [Timeline.create()], []),
    });
    
    const onPlayPause = useCallback(() => {
        wavesurfer && wavesurfer.playPause();
    }, [wavesurfer]);

    // useEffect(() => {
    //     wavesurfer?.loadBlob(audioRecorded);
    // }, []);

    return (
        <>
            Record # {number} - Size: {size}
            <button onClick={onPlayPause}>Play record</button>
            <div ref={containerRef} />

        </>
    );

};


export default AudioRecorded;
