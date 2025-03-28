uniform float uTime;
uniform float uBigWavesElevation;
uniform float uBigWavesSpeed;
uniform vec2 uBigWavesFrequency;

uniform float uSmallWavesSpeed;
uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesIterations;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#pragma glslify: cnoise = require(../noise/perlin3D.glsl);

float waveElevation(vec3 position) {
    float elevationX = sin(position.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed);
    float elevationZ = sin(position.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed);
    float elevation = elevationX * elevationZ * uBigWavesElevation;

    for(float i = 1.0; i <= uSmallWavesIterations; i++) {
        elevation -= abs(cnoise(vec3(position.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    return elevation;
}

void main() {
    // position
    float shift = 0.01;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
    vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, -shift);

    float elevation = waveElevation(modelPosition.xyz);
    modelPosition.y += elevation;
    modelPositionA.y += waveElevation(modelPositionA);
    modelPositionB.y += waveElevation(modelPositionB);


    vec3 toA = normalize(modelPositionA - modelPosition.xyz);
    vec3 toB = normalize(modelPositionB - modelPosition.xyz);
    vec3 computeNormals = cross(toA, toB);

    // final position
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vElevation = elevation;
    vNormal = computeNormals;
    vPosition = modelPosition.xyz;
}