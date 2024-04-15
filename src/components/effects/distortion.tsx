import React, { useState } from 'react';

import Knob from '../knob';

type IEffectSettings = {
    value: number,
    min: number,
    max: number,
};

type IDistortionEffect = {
    color: string,
    enabled: boolean,
    name: string,
    onClick: (isEnabled: boolean) => void,
    settings: Record<string, IEffectSettings>,
};

const DistortionEffect = ({ onClick, name }: IDistortionEffect) => {
    const [isEnabled, setIsEnabled] = useState(false);

    const onClickPedal = () => {
        setIsEnabled(!isEnabled);
        onClick(!isEnabled);
    };

    const onRotateVolume = (value: number) => {
        console.log(value);
    };

    return (
        <div className={`pedal ${isEnabled ? 'on' : 'off'} effect_distortion`}>
            <div className="led"></div>
            <div className="knobs">
                <div className="knob-wrap">
                    <div className="knob">
                        <Knob onRotate={onRotateVolume} min={0} max={800} />
                    </div>
                    <span>Volume</span>
                </div>
                <div className="knob-wrap">
                    <div className="knob">
                        <Knob onRotate={onRotateVolume} min={0} max={5} />
                    </div>
                    <span>Drive</span>
                </div>
                <div className="knob-wrap">
                    <div className="knob">
                        <Knob onRotate={onRotateVolume} min={0} max={5} />
                    </div>
                    <span>Tone</span>
                </div>
            </div>
            <div className="pedal-base">
                <span>{name}</span>
                <div className="base-click" onClick={onClickPedal} />
            </div>
        </div>
    );
};

export default DistortionEffect;
