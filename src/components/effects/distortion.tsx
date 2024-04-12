import React, { useState } from 'react';

import Knob from '../knob';

type IDistortionEffect = {
    onClick: (isEnabled: boolean) => void
};

const DistortionEffect = ({ onClick }: IDistortionEffect) => {
    const [isEnabled, setIsEnabled] = useState(false);

    const onClickPedal = () => {
        setIsEnabled(!isEnabled);
        onClick(!isEnabled);
    };

    const onRotateVolume = (value: number) => {
        console.log(value);
    }

    return (
        <div className={`pedal ${isEnabled ? 'on' : 'off'} wave-squeezer`}>
            <div className="led"></div>
            <div className="knobs">
                <div className="knob-wrap">
                    <div className="knob">
                        <Knob onRotate={onRotateVolume} min={0} max={5} />
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
                <span>Distortion</span>
                <div className="base-click" onClick={onClickPedal} />
            </div>
        </div>
    );
};

export default DistortionEffect;
