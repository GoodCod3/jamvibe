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
    onRotateKnob: (value: number, settingKey: string) => void,
    settings: Record<string, IEffectSettings>,
};

const DistortionEffect = ({ onClick, name, settings, onRotateKnob }: IDistortionEffect) => {
    const [isEnabled, setIsEnabled] = useState(false);

    const onClickPedal = () => {
        setIsEnabled(!isEnabled);
        onClick(!isEnabled);
    };

    const onRotatePedalKnob = (value: number, settingKey: string) => {
        onRotateKnob(value, settingKey);
    };

    return (
        <div className={`pedal ${isEnabled ? 'on' : 'off'} effect_distortion`}>
            <div className="led"/>
            <div className="knobs">
                {Object.keys(settings).map((settingKey, index) => (
                    <div className="knob-wrap">
                        <div className="knob">
                            <Knob
                                key={`pedal_${index}`}
                                onRotate={(value: number) => onRotatePedalKnob(value, settingKey)}
                                min={settings[settingKey].min}
                                max={settings[settingKey].max}
                            />
                        </div>
                        <span>{settingKey}</span>
                    </div>

                ))}
            </div>
            <div className="pedal-base">
                <span>{name}</span>
                <div className="base-click" onClick={onClickPedal} />
            </div>
        </div>
    );
};

export default DistortionEffect;
