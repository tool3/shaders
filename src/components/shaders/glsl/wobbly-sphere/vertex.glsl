uniform float uTime;
uniform float uTimeFrequency;
uniform float uPositionFrequency;
uniform float uStrength;
uniform float uWarpTimeFrequency;
uniform float uWarpPositionFrequency;
uniform float uWarpStrength;

attribute vec4 tangent;
varying float vWobble;

#pragma glslify: simplex4D = require(../noise/simplex4D.glsl);

float getWobble(vec3 position) {
    vec3 warped = position;
    warped += simplex4D(vec4(position * uWarpPositionFrequency, uTime * uWarpTimeFrequency)) * uWarpStrength;
    return simplex4D(vec4(warped * uPositionFrequency, uTime * uTimeFrequency)) * uStrength;
}

void main() {

    vec3 biTangent = cross(normal, tangent.xyz);

    float shift = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + biTangent * shift;

    float wobble = getWobble(csm_Position);
    csm_Position += wobble * normal;
    positionA += getWobble(positionA) * normal;
    positionB += getWobble(positionB) * normal;

    // compute normals
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);
    
    vWobble = wobble / uStrength;
}