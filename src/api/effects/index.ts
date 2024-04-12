export const makeDistortionCurve = (amount: number): Float32Array => {
    const sampleCount = 44100;
    const curve = new Float32Array(sampleCount);
    const deg = Math.PI / 180;

    for (let i = 0; i < sampleCount; ++i) {
        const x = (i * 2) / sampleCount - 1;
        curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
    }

    return curve;
};
