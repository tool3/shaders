uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uAccent;
uniform float uTime;
uniform vec2 uResolution;
uniform float uShadowRepititions;
uniform vec3 uShadowColor;
uniform float uLightRepititions;

uniform vec3 uLightColor;
varying vec3 vPosition;

#pragma glslify: ambientLight = require(../lights/ambient.glsl);
#pragma glslify: directionalLight = require(../lights/directional.glsl);
#pragma glslify: simplex4D = require(../noise/simplex4D.glsl);


vec3 halftone(
    vec3 color,
    float repititions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
) {
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= repititions;
    uv = mod(uv, 1.0);

    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);

    return mix(color, pointColor, point);
}

float noise(vec2 p) {
    return fract(sin(p.x * 100.0 + p.y * 6574.0) * 5647.0);
}

float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * h * k * (1.0 / 6.0);
}

float random(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) *
        43758.5453123);
}


float lines(vec2 uv, float offset) {
    return smoothstep(0., 0.5 + offset * 0.5, abs(0.5 * abs(sin(uv.x * 30.0) + offset * 2.0)));
}

mat2 rot2D(float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return mat2(c, -s, s, c);
}


void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;

    // init
    // vec3 baseFirst = vec3(120.0 / 255.0, 158.0 / 255.0, 113.0 / 255.0);
    // vec3 baseSecond = vec3(224.0 / 255.0, 148.0 / 255.0, 66.0 / 255.0);
    vec3 baseFirst = uColorA;
    vec3 baseSecond = uColorB;
    vec3 accent = uAccent;
    vec3 positionUv = vPosition * 0.05;
    // vec3 positionUv = vec3(uv, 1.0);;

    float n = simplex4D(vec4(positionUv + uTime * 0.1, 1.0));
    // float n2 = mix(n, baseN, 0.1);

    vec2 baseUv = rot2D(-n * 2.0) * positionUv.xy * 0.1;
    float basePattern = lines(baseUv, 0.5);
    float secondPattern = lines(baseUv, 0.3);

    vec3 baseColor = mix(baseSecond, baseFirst, basePattern);
    vec3 secondBaseColor = mix(baseColor, accent, secondPattern);

    // color
    vec3 col = vec3(1.0);

    vec2 uvRandom = uv;
    uvRandom.y *= random(vec2(uvRandom.y, 0.4));
    col.rgb += random(uvRandom);

    col = mix(col, secondBaseColor, 0.9);

    // gl_FragColor = vec4(col, 1.0);

    // Final color
    csm_DiffuseColor.rgb = col;
    // csm_DiffuseColor.rgb = mix(uColorA, uColorB, sin(n));
    // gl_FragColor = vec4(uColorA, 1.0);

    // csm_Metalness = step(0.25, uv.y);
    // csm_Roughness = 0.2 - uv.y;
}