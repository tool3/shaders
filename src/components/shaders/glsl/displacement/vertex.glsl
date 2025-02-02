uniform float uTime;
uniform float uBigWavesElevation;
uniform float uBigWavesSpeed;
uniform vec2 uBigWavesFrequency;

uniform float uSmallWavesSpeed;
uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesIterations;

varying float vElevation;

#pragma glslify: cnoise = require(../noise/perlin3D.glsl);

void main() {
    // position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // elevation
    float elevationX = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed);
    float elevationZ = sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed);
    float elevation = elevationX * elevationZ * uBigWavesElevation;

    for(float i = 1.0; i <= uSmallWavesIterations; i++) {
        elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // final position
    gl_Position = projectedPosition;

    vElevation = elevation;
}