uniform vec3 uColorWaterDeep;
uniform vec3 uColorWaterSurface;
uniform vec3 uColorSand;
uniform vec3 uColorGrass;
uniform vec3 uColorSnow;
uniform vec3 uColorRock;

varying vec3 vPosition;
varying float vUpDot;

#pragma glslify: simplex2D = require(../noise/simplex2D.glsl);

void main() {
    vec3 color = vec3(1.0);

    // water
    float surfaceWaterMix = smoothstep(-1.0, -0.1, vPosition.y);
    color = mix(uColorWaterDeep, uColorWaterSurface, surfaceWaterMix);

    // sand
    float sandMix = step(-0.1, vPosition.y);
    color = mix(color, uColorSand, sandMix);

    // grass
    float grassMix = step(-0.06, vPosition.y);
    color = mix(color, uColorGrass, grassMix);

    // rock
    float rockMix = vUpDot;
    rockMix = 1.0 - step(0.8, rockMix);
    rockMix *= step(-0.06, vPosition.y);
    color = mix(color, uColorRock, rockMix);

    // snow
    float snowThreshold = 0.45;
    snowThreshold += simplex2D(vPosition.xz * 15.0) * 0.1;
    float snowMix = step(snowThreshold, vPosition.y);
    color = mix(color, uColorSnow, snowMix);

    csm_DiffuseColor = vec4(color, 1.0);
}