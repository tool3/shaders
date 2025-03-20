uniform float uTime;
uniform float uPositionFrequency;
uniform float uStrength;
uniform float uWarpFrequency;
uniform float uWarpStrength;

varying vec3 vPosition;
varying float vUpDot;

#pragma glslify: simplex2D = require(../noise/simplex2D.glsl);

float getElevation(vec2 position) {
    vec2 warpPosition = position;
    warpPosition += uTime * 0.2;
    warpPosition += simplex2D(warpPosition * uPositionFrequency * uWarpFrequency) * uWarpStrength;

    float elevation = 0.0;
    elevation += simplex2D(warpPosition * uPositionFrequency) / 2.0;
    elevation += simplex2D(warpPosition * uPositionFrequency * 2.0) / 4.0;
    elevation += simplex2D(warpPosition * uPositionFrequency * 4.0) / 8.0;

    float elevationSign = sign(elevation);
    elevation = pow(abs(elevation), 2.0) * elevationSign;
    elevation *= uStrength;

    return elevation;
}

void main() {
    float shift = 0.01;
    vec3 positionA = position + vec3(shift, 0.0, 0.0);
    vec3 positionB = position + vec3(0.0, 0.0, -shift);

    float elevation = getElevation(csm_Position.xz);
    csm_Position.y += elevation;

    positionA.y = getElevation(positionA.xz);
    positionB.y = getElevation(positionB.xz);

    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);

    csm_Normal = cross(toA, toB);

    vPosition = csm_Position;
    vPosition.xz += uTime * 0.2;
    vUpDot = dot(csm_Normal, vec3(0.0, 1.0, 0.0));
}