uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#pragma glslify: pointLight = require(../lights/point.glsl);

void main() {
    // direction
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);

    // base color
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

        // lights
    vec3 light = vec3(0.0);
    light += pointLight(vec3(1.0), 10.0, normal, vec3(0.0, 0.25, 0.0), viewDirection, 30.0, vPosition, 0.95);

    color *= light;

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}