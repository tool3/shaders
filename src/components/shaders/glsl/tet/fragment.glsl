uniform vec3 uColorA;
uniform vec2 uResolution;
uniform float uShadowRepititions;
uniform vec3 uShadowColor;
uniform float uLightRepititions;
uniform vec3 uLightColor;

varying vec3 vPosition;

#pragma glslify: ambientLight = require(../lights/ambient.glsl);
#pragma glslify: directionalLight = require(../lights/directional.glsl);

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

void main() {
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    // vec3 normal = normalize(vNormal);
    // normal = normal;
    vec3 color = uColorA;

    // Lights
    vec3 light = vec3(0.0);
    light += ambientLight(vec3(1.0), 1.0);
    light += directionalLight(vec3(1.0), 1.0, vNormal, vec3(1.0, 1.0, 0.0), viewDirection, 1.0);

    color *= light;

    // Halftone
    color = halftone(color, uShadowRepititions, vec3(0.0, -1.0, 0.0), -0.8, 1.5, uShadowColor, vNormal);
    color = halftone(color, uLightRepititions, vec3(1.0, 1.0, 0.0), 0.5, 1.5, uLightColor, vNormal);

    // Final color
    csm_DiffuseColor.rgb = color;
    // csm_DiffuseColor.rgb = mix(uColorA, uColorB, sin(n));
    // gl_FragColor = vec4(uColorA, 1.0);

    // csm_Metalness = step(0.25, uv.y);
    // csm_Roughness = 0.2 - uv.y;
}