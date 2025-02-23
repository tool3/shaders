uniform vec2 uResolution;
varying vec3 vColor;
varying vec3 vPosition;
uniform float uTime;
uniform vec2 uMouse;

#pragma glslify: cnoise = require(../noise/perlin3D.glsl);
#pragma glslify: random2D = require(../noise/random2D.glsl);
#pragma glslify: simplex4D = require(../noise/simplex4D.glsl);

vec3 palette(float t) {
    // vec3 a = vec3(0.5, 0.5, 0.5);
    // vec3 b = vec3(0.5, 0.5, 0.5);
    // vec3 c = vec3(1.0, 1.0, 1.0);
    // vec3 d = vec3(0.30, 0.20, 0.20);

    // vec3 a = vec3(0.5, 0.5, 0.5);
    // vec3 b = vec3(0.5, 0.5, 0.5);
    // vec3 c = vec3(2.0, 1.0, 0.0);
    // vec3 d = vec3(0.50, 0.20, 0.25);

    // vec3 a = vec3(0.5, 0.5, 0.5);
    // vec3 b = vec3(0.5, 0.5, 0.5);
    // vec3 c = vec3(2.0, 1.0, 0.0);
    // vec3 d = vec3(0.50, 0.20, 0.25);

    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 0.7, 0.4);
    vec3 d = vec3(0.00, 0.15, 0.20);

    // vec3 a = vec3(0.5, 0.5, 0.5);
    // vec3 b = vec3(0.5, 0.5, 0.5);
    // vec3 c = vec3(1.0, 1.0, 1.0);
    // vec3 d = vec3(0.00, 0.33, 0.67);

    // vec3 a = vec3(0.5, 0.5, 0.5);
    // vec3 b = vec3(0.5, 0.5, 0.5);
    // vec3 c = vec3(1.0, 1.0, 1.0);
    // vec3 d = vec3(0.263, 0.416, 0.557);

    return a + b * cos(6.28318 * (c * t + d));
}

mat2 rot2D(float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return mat2(c, -s, s, c);
}

vec3 rot3D(vec3 p, vec3 axis, float angle) {
    return mix(dot(axis, p) * axis, p, cos(angle)) + cross(axis, p) * sin(angle);
}

float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    return (p.x + p.y + p.z - s) * 0.57735027;
}

float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdBoxFrame(vec3 p, vec3 b, float e) {
    p = abs(p) - b;
    vec3 q = abs(p + e) - e;
    return min(min(length(max(vec3(p.x, q.y, q.z), 0.0)) + min(max(p.x, max(q.y, q.z)), 0.0), length(max(vec3(q.x, p.y, q.z), 0.0)) + min(max(q.x, max(p.y, q.z)), 0.0)), length(max(vec3(q.x, q.y, p.z), 0.0)) + min(max(q.x, max(q.y, p.z)), 0.0));
}

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float sdPyramid(vec3 p, float h) {
    float m2 = h * h + 0.25;

    p.xz = abs(p.xz);
    p.xz = (p.z > p.x) ? p.zx : p.xz;
    p.xz -= 0.5;

    vec3 q = vec3(p.z, h * p.y - 0.5 * p.x, h * p.x + 0.5 * p.y);

    float s = max(-q.x, 0.0);
    float t = clamp((q.y - 0.5 * p.z) / (m2 + 0.25), 0.0, 1.0);

    float a = m2 * (q.x + s) * (q.x + s) + q.y * q.y;
    float b = m2 * (q.x + 0.5 * t) * (q.x + 0.5 * t) + (q.y - m2 * t) * (q.y - m2 * t);

    float d2 = min(q.y, -q.x * m2 - q.y * 0.5) > 0.0 ? 0.0 : min(a, b);

    return sqrt((d2 + q.z * q.z) / m2) * sign(max(q.z, -p.y));
}

float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * h * k * (1.0 / 6.0);
}

float map(vec3 p) {
    p.z += uTime * 0.4;
    p.y += sin(uTime * 0.4);

    p = fract(p) - 0.5;

    float box = sdBox(p, vec3(0.15));

    return box;
}

float lines(vec2 uv, float offset) {
    return smoothstep(0., 0.5 + offset * 0.5, abs(0.5 * abs(sin(uv.x * 30.0) + offset * 2.0)));
}

float random(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) *
        43758.5453123);
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;

    // init
    vec3 baseFirst = vec3(120.0 / 255.0, 158.0 / 255.0, 113.0 / 255.0);
    vec3 accent = vec3(0.0, 0.0, 0.0);
    vec3 baseSecond = vec3(224.0 / 255.0, 148.0 / 255.0, 66.0 / 255.0);
    vec3 baseThird = vec3(232.0 / 255.0, 201.0 / 255.0, 73.0 / 255.0);

    vec3 positionUv = vPosition;
    positionUv.xy += uMouse.xy * 0.8;

    float baseN = random2D(positionUv.xy + uTime);
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

    gl_FragColor = vec4(col, 1.0);
}
