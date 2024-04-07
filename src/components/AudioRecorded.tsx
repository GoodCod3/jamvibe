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

import { bytesToMegabytes } from '@/utils/blobs';


type IAudioRecorded = {
    number: number,
    audioRecorded: Blob,
    audioRecordedUrl: string,
};

const AudioRecorded = ({ number, audioRecorded, audioRecordedUrl }: IAudioRecorded) => {
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

    return (
        <div className='audio_recorded_item'>
            <div className="record_title">
                # {number} - Size: {bytesToMegabytes(audioRecorded.size)} Mb.
            </div>
            <div className="record_play_button">
                <button onClick={onPlayPause}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            </div>
            <div className="record_waveform" ref={containerRef}>
            </div>

        </div>
    );

};


export default AudioRecorded;
