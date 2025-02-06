uniform vec2 uResolution;
varying vec3 vColor;
uniform float uTime;

vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);

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

float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * h * k * (1.0 / 6.0);
}

float map(vec3 p) {
    vec3 spherePos = vec3(sin(uTime) * 3.0, 0.0, 0.0);
    float sphere = sdSphere(p - spherePos, 1.0);

    float box = sdBox(p, vec3(0.75));

    float ground = p.y + 0.75;

    return smin(ground, smin(sphere, box, 2.0), 1.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
    // vec2 uv = ((gl_FragCoord.xy * 2.0) - uResolution.xy) / uResolution.y;

    // init
    vec3 ro = vec3(0.0, 0.0, -3.0);
    vec3 rd = normalize(vec3(uv * 1.5, 1.0));
    vec3 col = vec3(0.0);

    float t = 0.0;

    // raymarch
    for(int i = 0; i < 80; i++) {
        vec3 p = ro + rd * t;

        float d = map(p);

        t += d;

        // col = vec3(i) / 80.0;

        if(d < 0.001 || t > 100.0)
            break;
    }

    // color
    col = vec3(t * 0.2);

    gl_FragColor = vec4(col, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
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
