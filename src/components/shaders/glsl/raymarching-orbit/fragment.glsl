uniform vec2 uResolution;
uniform vec2 uMouse;
varying vec3 vColor;
uniform float uTime;
uniform sampler2D uTexture;

vec3 palette(float t) {
    // vec3 a = vec3(0.5, 0.5, 0.5);
    // vec3 b = vec3(0.5, 0.5, 0.5);
    // vec3 c = vec3(1.0, 1.0, 1.0);
    // vec3 d = vec3(0.30, 0.20, 0.20);

    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.33, 0.67);

    // vec3 a = vec3(0.5, 0.5, 0.5);
    // vec3 b = vec3(0.5, 0.5, 0.5);
    // vec3 c = vec3(2.0, 1.0, 0.0);
    // vec3 d = vec3(0.50, 0.20, 0.25);

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

float sdVerticalCapsule(vec3 p, float h, float r) {
    p.y -= clamp(p.y, 0.0, h);
    return length(p) - r;
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
    // p.z += uTime * 0.4;
    p.y -= uTime * 0.4;

    p = fract(p) - 0.5;

    // float box = sdVerticalCapsule(p, 0.15, 0.05);
    float box = sdSphere(p, 0.15);

    return box;
}

// float map(vec3 p) {
//     float box = sdBox(p, vec3(0.5));
//     return length(box) - 1.0;
// }

float noise(vec2 p) {
    return fract(sin(p.x * 100.0 + p.y * 6574.0) * 5647.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
    vec2 m = (uMouse * 2.0);

    // init
    vec3 ro = vec3(0.0, 0.0, -3.0);
    vec3 rd = normalize(vec3(uv, 1.0));
    vec3 col = vec3(0.0);

    float t = 0.0;

    ro.yz *= rot2D(-m.y);
    rd.yz *= rot2D(-m.y);
    
    ro.xz *= rot2D(-m.x);
    rd.xz *= rot2D(-m.x);

    // raymarch
    int i;
    for(i = 0; i < 80; i++) {
        vec3 p = ro + rd * t;

        float d = map(p);

        t += d;

        // col = vec3(i) / 80.0;

        if(d < 0.001 || t > 100.0)
            break;
    }

    // color
    col = palette(t * 0.09 + float(i) * 0.009 * noise(uv) * 0.5);

    gl_FragColor = vec4(col, 1.0);
}

// RAYMARCH BASE
// uniform vec2 uResolution;
// varying vec3 vColor;
// uniform float uTime;

// vec3 palette(float t) {
//     vec3 a = vec3(0.5, 0.5, 0.5);
//     vec3 b = vec3(0.5, 0.5, 0.5);
//     vec3 c = vec3(1.0, 1.0, 1.0);
//     vec3 d = vec3(0.263, 0.416, 0.557);

//     return a + b * cos(6.28318 * (c * t + d));
// }

// float map(vec3 p) {
//     return length(p) - 1.0;
// }

// void main() {
//     vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
//     // vec2 uv = ((gl_FragCoord.xy * 2.0) - uResolution.xy) / uResolution.y;

//     // init
//     vec3 ro = vec3(0.0, 0.0, -3.0);
//     vec3 rd = normalize(vec3(uv, 1.0));
//     vec3 col = vec3(0.0);

//     float t = 0.0;

//     // raymarch
//     for(int i = 0; i < 80; i++) {
//         vec3 p = ro + rd * t;

//         float d = map(p);

//         t += d;

//         // col = vec3(i) / 80.0;

//         if (d < 0.001 || t > 100.0) break;
//     }

//     // color
//     col = vec3(t * 0.2);

//     gl_FragColor = vec4(col, 1.0);

//     #include <tonemapping_fragment>
//     #include <colorspace_fragment>
// }
