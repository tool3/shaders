varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;
uniform float uAbberation;
uniform float uGridSize;

#pragma glslify: cnoise = require(../noise/perlin3D.glsl);

float circleAt(vec2 uv) {
    float gridSize = uGridSize;
    vec2 tiledUV = fract(uv * gridSize);
    vec2 centerOffset = tiledUV - 0.5;
    float radius = 0.5;
    float speed = 0.09;

    // vec2 center = vec2(0.5, 0.5);
    // float dast = -distance(uv, center);
    float uvMultiplier = 6.5;

    float n1 = cnoise(vec3(uv * uvMultiplier, 1.0) + uTime * speed);
    float n2 = cnoise(vec3(uv * uvMultiplier, 1.0) + uTime * speed);
    float n3 = cnoise(vec3(uv * uvMultiplier, 1.0) + uTime * speed);

    float dist = length(centerOffset);
    return step(dist, radius + (n1 * n2 + (n3 * uv.y))) * 5.0;
}

void main() {
    vec2 uv = vUv;

    vec2 direction = uv - vec2(0.5);
    float strength = length(direction) * uAbberation;
    vec2 caOffset = normalize(direction) * strength;

    float r = 1.0 - circleAt(uv + caOffset);
    float g = 1.0 - circleAt(uv);
    float b = 1.0 - circleAt(uv - caOffset);

    float n = cnoise(vec3(uTime));
    // float center = distance(uv, vec2(0.5)) * -3.0;

    vec3 finalColor = vec3(r, g, b) + cnoise(vec3(vec2(3.14), 1.0));
    gl_FragColor = vec4(finalColor, 1.0);
}