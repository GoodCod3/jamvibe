'use client';

import React, {
    useRef,
    useMemo,
    useCallback,
} from 'react';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import { useWavesurfer } from '@wavesurfer/react';

import { bytesToMegabytes } from '@/utils/blobs';


type IAudioRecorded = {
    number: number,
    audioRecorded: Blob,
    audioRecordedUrl: string,
};

const topTimeline = TimelinePlugin.create({
    height: 20,
    insertPosition: 'beforebegin',
    timeInterval: 0.2,
    primaryLabelInterval: 5,
    secondaryLabelInterval: 1,
    style: {
        fontSize: '20px',
        color: '#2D5B88',
    },
});
const bottomTimline = TimelinePlugin.create({
    height: 10,
    timeInterval: 0.1,
    primaryLabelInterval: 1,
    style: {
        fontSize: '10px',
        color: '#6A3274',
    },
});

const AudioRecorded = ({ number, audioRecorded, audioRecordedUrl }: IAudioRecorded) => {
    const containerRef = useRef(null);
    const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
        container: containerRef,
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        url: audioRecordedUrl,
        height: 70,
        barWidth: 4,
        barGap: 2,
        barRadius: 2,
        plugins: useMemo(() => [topTimeline, bottomTimline], []),
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
