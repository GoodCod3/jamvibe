import React, { useEffect, useRef } from 'react';

import '../knob.css';


interface Props {
    min: number;
    max: number;
    onRotate: (value: number) => void;
}

const Knob: React.FC<Props> = ({ min, max, onRotate }) => {
    const volumeKnobRef = useRef<HTMLDivElement>(null);
    const tickContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let knobPositionX: number;
        let knobPositionY: number;
        let mouseX: number;
        let mouseY: number;
        let knobCenterX: number;
        let knobCenterY: number;
        let adjacentSide: number;
        let oppositeSide: number;
        let currentRadiansAngle: number;
        let getRadiansInDegrees: number;
        let finalAngleInDegrees: number;
        let volumeSetting: number;
        let tickHighlightPosition: number;
        let startingTickAngle = -135;

        const volumeKnob = volumeKnobRef.current!;
        const tickContainer = tickContainerRef.current!;
        const boundingRectangle = volumeKnob.getBoundingClientRect();

        const onMouseDown = () => {
            document.addEventListener(getMouseMove(), onMouseMove);
        }

        const onMouseUp = () => {
            document.removeEventListener(getMouseMove(), onMouseMove);
        }

        const onMouseMove = (event: MouseEvent | TouchEvent) => {
            knobPositionX = boundingRectangle.left;
            knobPositionY = boundingRectangle.top;

            if (detectMobile() === "desktop") {
                mouseX = (event as MouseEvent).pageX;
                mouseY = (event as MouseEvent).pageY;
            } else {
                mouseX = (event as TouchEvent).touches[0].pageX;
                mouseY = (event as TouchEvent).touches[0].pageY;
            }

            knobCenterX = boundingRectangle.width / 2 + knobPositionX;
            knobCenterY = boundingRectangle.height / 2 + knobPositionY;

            adjacentSide = knobCenterX - mouseX;
            oppositeSide = knobCenterY - mouseY;

            currentRadiansAngle = Math.atan2(adjacentSide, oppositeSide);

            getRadiansInDegrees = currentRadiansAngle * 180 / Math.PI;

            finalAngleInDegrees = -(getRadiansInDegrees - 135);

            if (finalAngleInDegrees >= 0 && finalAngleInDegrees <= 270) {
                volumeKnob.style.transform = `rotate(${finalAngleInDegrees}deg)`;

                volumeSetting = Math.floor(finalAngleInDegrees / (270 / 100));
                tickHighlightPosition = Math.round((volumeSetting * 2.7) / 10);

                createTicks(27, tickHighlightPosition);

                const volume = calculateVolume(volumeSetting);
                onRotate(volume);
            }
        }

        const createTicks = (numTicks: number, highlightNumTicks: number) => {
            while (tickContainer.firstChild) {
                tickContainer.removeChild(tickContainer.firstChild);
            }

            for (let i = 0; i < numTicks; i++) {
                const tick = document.createElement("div");

                if (i < highlightNumTicks) {
                    tick.className = "tick activetick";
                } else {
                    tick.className = "tick";
                }

                tickContainer.appendChild(tick);
                tick.style.transform = `rotate(${startingTickAngle}deg)`;
                startingTickAngle += 10;
            }

            startingTickAngle = -135;
        }

        const detectMobile = () => {
            const result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

            if (result !== null) {
                return "mobile";
            } else {
                return "desktop";
            }
        }

        const getMouseDown = () => {
            if (detectMobile() === "desktop") {
                return "mousedown";
            } else {
                return "touchstart";
            }
        }

        const getMouseUp = () => {
            if (detectMobile() === "desktop") {
                return "mouseup";
            } else {
                return "touchend";
            }
        }

        const getMouseMove = () => {
            if (detectMobile() === "desktop") {
                return "mousemove";
            } else {
                return "touchmove";
            }
        }

        const calculateVolume = (setting: number) => {
            const range = max - min;
            const value = (setting * range) / 100 + min;
            return value;
        }

        volumeKnob.addEventListener(getMouseDown(), onMouseDown);
        document.addEventListener(getMouseUp(), onMouseUp);

        return () => {
            volumeKnob.removeEventListener(getMouseDown(), onMouseDown);
            document.removeEventListener(getMouseUp(), onMouseUp);
        }
    }, [min, max, onRotate]);

    return (
        <div className="knob-surround">
            <div ref={volumeKnobRef} id="knob" className="knob"></div>
            <div ref={tickContainerRef} id="tickContainer" className="ticks"></div>
        </div>
    );
};

export default Knob;
