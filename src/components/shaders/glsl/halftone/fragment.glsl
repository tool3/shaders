uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uShadowRepititions;
uniform vec3 uShadowColor;
uniform float uLightRepititions;
uniform vec3 uLightColor;

varying vec3 vNormal;
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

void main() {
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    // Lights
    vec3 light = vec3(0.0);
    light += ambientLight(vec3(1.0), 1.0);
    light += directionalLight(vec3(1.0), 1.0, normal, vec3(1.0, 1.0, 0.0), viewDirection, 1.0);

    color *= light;

    // Halftone
    color = halftone(color, uShadowRepititions, vec3(0.0, -1.0, 0.0), -0.8, 1.5, uShadowColor, normal);
    color = halftone(color, uLightRepititions, vec3(1.0, 1.0, 0.0), 0.5, 1.5, uLightColor, normal);

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}