// // "Koch in 3d" 
// // by Martijn Steinrucken aka The Art of Code/BigWings - 2022
// // The MIT License
// // Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// // Email: countfrolic@gmail.com
// // Twitter: @The_ArtOfCode
// // YouTube: youtube.com/TheArtOfCodeIsCool
// // Facebook: https://www.facebook.com/groups/theartofcode/
// //
// // To make this yourself, follow the tutorial on YouTube:
// // https://youtu.be/BYv47pQPRDs
// // NFT of this video:
// // https://www.fxhash.xyz/generative/13884

// uniform float uTime;
// uniform vec2 uResolution;
// uniform vec2 uMouse;
// uniform sampler2D uChannel0;

// #define MAX_STEPS 100
// #define MAX_DIST 100.
// #define SURF_DIST .001
// #define TAU 6.283185
// #define PI 3.141592
// #define S smoothstep

// mat2 Rot(float a) {
//     float s = sin(a), c = cos(a);
//     return mat2(c, -s, s, c);
// }

// float sdBox(vec3 p, vec3 s) {
//     p = abs(p) - s;
//     return length(max(p, 0.)) + min(max(p.x, max(p.y, p.z)), 0.);
// }

// vec2 N(float angle) {
// // angle to vector
//     return vec2(sin(angle), cos(angle));
// }

// vec2 Koch(vec2 uv) {
//     uv.x = abs(uv.x);

//     vec3 col = vec3(0);
//     float d;

//     float angle = 0.;
//     vec2 n = N((5. / 6.) * 3.1415);

//     uv.y += tan((5. / 6.) * 3.1415) * .5;
//     d = dot(uv - vec2(.5, 0), n);
//     uv -= max(0., d) * n * 2.;

//     float scale = 1.;

//     n = N((2. / 3.) * 3.1415);
//     uv.x += .5;
//     for(int i = 0; i < 4; i++) {
//         uv *= 3.;
//         scale *= 3.;
//         uv.x -= 1.5;

//         uv.x = abs(uv.x);
//         uv.x -= .5;
//         d = dot(uv, n);
//         uv -= min(0., d) * n * 2.;
//     }
//     uv /= scale;
//     return uv;
// }

// float GetDist(vec3 p) {

//     p.xz *= Rot(uTime * .2);

//     /*
//     // straight intersection
//     vec2 xy = Koch(p.xy);
//     vec2 yz = Koch(p.yz);
//     vec2 xz = Koch(p.xz);
//     float d = max(xy.y, max(yz.y, xz.y));
//     */

//     vec2 xz = Koch(vec2(length(p.xz), p.y));
//     vec2 yz = Koch(vec2(length(p.yz), p.x));
//     vec2 xy = Koch(vec2(length(p.xy), p.z));
//     float d = max(xy.x, max(yz.x, xz.x));

//     d = mix(d, length(p) - .5, .5);
//     return d;
// }

// float RayMarch(vec3 ro, vec3 rd) {
//     float dO = 0.;

//     for(int i = 0; i < MAX_STEPS; i++) {
//         vec3 p = ro + rd * dO;
//         float dS = GetDist(p);
//         dO += dS;
//         if(dO > MAX_DIST || abs(dS) < SURF_DIST)
//             break;
//     }

//     return dO;
// }

// vec3 GetNormal(vec3 p) {
//     float d = GetDist(p);
//     vec2 e = vec2(.001, 0);

//     vec3 n = d - vec3(GetDist(p - e.xyy), GetDist(p - e.yxy), GetDist(p - e.yyx));

//     return normalize(n);
// }

// vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
//     vec3 f = normalize(l - p), r = normalize(cross(vec3(0, 1, 0), f)), u = cross(f, r), c = f * z, i = c + uv.x * r + uv.y * u, d = normalize(i);
//     return d;
// }

// void main() {
//     // out vec4 fragColor, in vec2 fragCoord
//     vec2 uv = (gl_FragCoord.xy - .5 * uResolution.xy) / uResolution.y;
//     vec2 m = (uMouse.xy);

//     vec3 ro = vec3(0, 3, -3);
//     ro.yz *= Rot(-m.y * PI + 1.);
//     ro.xz *= Rot(-m.x * TAU);

//     vec3 rd = GetRayDir(uv, ro, vec3(0, 0., 0), 3.);
//     vec3 col = vec3(0);

//     float d = RayMarch(ro, rd);

//     if(d < MAX_DIST) {
//         vec3 p = ro + rd * d;
//         vec3 n = GetNormal(p);
//         vec3 r = reflect(rd, n);

//         float dif = dot(n, normalize(vec3(1, 2, 3))) * .5 + .5;
//         col = vec3(dif);

//         col = n * .5 + .5;
//         col *= (uChannel0, r).rgb;
//     }
//     //col *= 0.;
//     //vec2 st = Koch(uv)*4.;
//     //col = vec3(st.y);
//     col = pow(col, vec3(.4545));	// gamma correction

//     gl_FragColor = vec4(col, 1.0);
// }

// Plasma Globe by nimitz (twitter: @stormoid)
// https://www.shadertoy.com/view/XsjXRm
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
// Contact the author for other licensing options

//looks best with around 25 rays
uniform vec2 uMouse;
uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D iChannel0;


#define NUM_RAYS 13.

#define VOLUMETRIC_STEPS 19

#define MAX_ITER 35
#define FAR 6.

mat2 mm2(in float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}
float noise(in float x) {
    return textureLod(iChannel0, vec2(x * .01, 1.), 0.0).x;
}

float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

float noise(in vec3 p) {
    vec3 ip = floor(p);
    vec3 fp = fract(p);
    fp = fp * fp * (3.0 - 2.0 * fp);

    vec2 tap = (ip.xy + vec2(37.0, 17.0) * ip.z) + fp.xy;
    vec2 rg = textureLod(iChannel0, (tap + 0.5) / 256.0, 0.0).yx;
    return mix(rg.x, rg.y, fp.z);
}

mat3 m3 = mat3(0.00, 0.80, 0.60, -0.80, 0.36, -0.48, -0.60, -0.48, 0.64);

//See: https://www.shadertoy.com/view/XdfXRj
float flow(in vec3 p, in float t) {
    float z = 2.;
    float rz = 0.;
    vec3 bp = p;
    for(float i = 1.; i < 5.; i++) {
        p += uTime * .1;
        rz += (sin(noise(p + t * 0.8) * 6.) * 0.5 + 0.5) / z;
        p = mix(bp, p, 0.6);
        z *= 2.;
        p *= 2.01;
        p *= m3;
    }
    return rz;
}

//could be improved
float sins(in float x) {
    float rz = 0.;
    float z = 2.;
    for(float i = 0.; i < 3.; i++) {
        rz += abs(fract(x * 1.4) - 0.5) / z;
        x *= 1.3;
        z *= 1.15;
        x -= uTime * .65 * z;
    }
    return rz;
}

float segm(vec3 p, vec3 a, vec3 b) {
    vec3 pa = p - a;
    vec3 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.);
    return length(pa - ba * h) * .5;
}

vec3 path(in float i, in float d) {
    vec3 en = vec3(0., 0., 1.);
    float sns2 = sins(d + i * 0.5) * 0.22;
    float sns = sins(d + i * .6) * 0.21;
    en.xz *= mm2((hash(i * 10.569) - .5) * 6.2 + sns2);
    en.xy *= mm2((hash(i * 4.732) - .5) * 6.2 + sns);
    return en;
}

vec2 map(vec3 p, float i) {
    float lp = length(p);
    vec3 bg = vec3(0.);
    vec3 en = path(i, lp);

    float ins = smoothstep(0.11, .46, lp);
    float outs = .15 + smoothstep(.0, .15, abs(lp - 1.));
    p *= ins * outs;
    float id = ins * outs;

    float rz = segm(p, bg, en) - 0.011;
    return vec2(rz, id);
}

float march(in vec3 ro, in vec3 rd, in float startf, in float maxd, in float j) {
    float precis = 0.001;
    float h = 0.5;
    float d = startf;
    for(int i = 0; i < MAX_ITER; i++) {
        if(abs(h) < precis || d > maxd)
            break;
        d += h * 1.2;
        float res = map(ro + rd * d, j).x;
        h = res;
    }
    return d;
}

//volumetric marching
vec3 vmarch(in vec3 ro, in vec3 rd, in float j, in vec3 orig) {
    vec3 p = ro;
    vec2 r = vec2(0.);
    vec3 sum = vec3(0);
    float w = 0.;
    for(int i = 0; i < VOLUMETRIC_STEPS; i++) {
        r = map(p, j);
        p += rd * .03;
        float lp = length(p);

        vec3 col = sin(vec3(1.05, 2.5, 1.52) * 3.94 + r.y) * .85 + 0.4;
        col.rgb *= smoothstep(.0, .015, -r.x);
        col *= smoothstep(0.04, .2, abs(lp - 1.1));
        col *= smoothstep(0.1, .34, lp);
        sum += abs(col) * 5. * (1.2 - noise(lp * 2. + j * 13. + uTime * 5.) * 1.1) / (log(distance(p, orig) - 2.) + .75);
    }
    return sum;
}

//returns both collision dists of unit sphere
vec2 iSphere2(in vec3 ro, in vec3 rd) {
    vec3 oc = ro;
    float b = dot(oc, rd);
    float c = dot(oc, oc) - 1.;
    float h = b * b - c;
    if(h < 0.0)
        return vec2(-1.);
    else
        return vec2((-b - sqrt(h)), (-b + sqrt(h)));
}

void main() {
    vec2 p = gl_FragCoord.xy / uResolution.xy - 0.5;
    p.x *= uResolution.x / uResolution.y;
    vec2 um = uMouse.xy / uResolution.xy - .5;

	//camera
    vec3 ro = vec3(0., 0., 5.);
    vec3 rd = normalize(vec3(p * .7, -1.5));
    mat2 mx = mm2(uTime * .4 + um.x * 6.);
    mat2 my = mm2(uTime * 0.3 + um.y * 6.);
    ro.xz *= mx;
    rd.xz *= mx;
    ro.xy *= my;
    rd.xy *= my;

    vec3 bro = ro;
    vec3 brd = rd;

    vec3 col = vec3(0.0125, 0., 0.025);
    #if 1
    for(float j = 1.; j < NUM_RAYS + 1.; j++) {
        ro = bro;
        rd = brd;
        mat2 mm = mm2((uTime * 0.1 + ((j + 1.) * 5.1)) * j * 0.25);
        ro.xy *= mm;
        rd.xy *= mm;
        ro.xz *= mm;
        rd.xz *= mm;
        float rz = march(ro, rd, 2.5, FAR, j);
        if(rz >= FAR)
            continue;
        vec3 pos = ro + rz * rd;
        col = max(col, vmarch(pos, rd, j, bro));
    }
    #endif

    ro = bro;
    rd = brd;
    vec2 sph = iSphere2(ro, rd);

    if(sph.x > 0.) {
        vec3 pos = ro + rd * sph.x;
        vec3 pos2 = ro + rd * sph.y;
        vec3 rf = reflect(rd, pos);
        vec3 rf2 = reflect(rd, pos2);
        float nz = (-log(abs(flow(rf * 1.2, uTime) - .01)));
        float nz2 = (-log(abs(flow(rf2 * 1.2, -uTime) - .01)));
        col += (0.1 * nz * nz * vec3(0.12, 0.12, .5) + 0.05 * nz2 * nz2 * vec3(0.55, 0.2, .55)) * 0.8;
    }

    gl_FragColor = vec4(col * 1.3, 1.0);
}