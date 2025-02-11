// "Koch in 3d" 
// by Martijn Steinrucken aka The Art of Code/BigWings - 2022
// The MIT License
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// Email: countfrolic@gmail.com
// Twitter: @The_ArtOfCode
// YouTube: youtube.com/TheArtOfCodeIsCool
// Facebook: https://www.facebook.com/groups/theartofcode/
//
// To make this yourself, follow the tutorial on YouTube:
// https://youtu.be/BYv47pQPRDs
// NFT of this video:
// https://www.fxhash.xyz/generative/13884

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform sampler2D uChannel0;

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001
#define TAU 6.283185
#define PI 3.141592
#define S smoothstep


mat2 Rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

float sdBox(vec3 p, vec3 s) {
    p = abs(p) - s;
    return length(max(p, 0.)) + min(max(p.x, max(p.y, p.z)), 0.);
}

vec2 N(float angle) {
// angle to vector
    return vec2(sin(angle), cos(angle));
}

vec2 Koch(vec2 uv) {
    uv.x = abs(uv.x);

    vec3 col = vec3(0);
    float d;

    float angle = 0.;
    vec2 n = N((5. / 6.) * 3.1415);

    uv.y += tan((5. / 6.) * 3.1415) * .5;
    d = dot(uv - vec2(.5, 0), n);
    uv -= max(0., d) * n * 2.;

    float scale = 1.;

    n = N((2. / 3.) * 3.1415);
    uv.x += .5;
    for(int i = 0; i < 4; i++) {
        uv *= 3.;
        scale *= 3.;
        uv.x -= 1.5;

        uv.x = abs(uv.x);
        uv.x -= .5;
        d = dot(uv, n);
        uv -= min(0., d) * n * 2.;
    }
    uv /= scale;
    return uv;
}

float GetDist(vec3 p) {

    p.xz *= Rot(uTime * .2);

    /*
    // straight intersection
    vec2 xy = Koch(p.xy);
    vec2 yz = Koch(p.yz);
    vec2 xz = Koch(p.xz);
    float d = max(xy.y, max(yz.y, xz.y));
    */

    vec2 xz = Koch(vec2(length(p.xz), p.y));
    vec2 yz = Koch(vec2(length(p.yz), p.x));
    vec2 xy = Koch(vec2(length(p.xy), p.z));
    float d = max(xy.x, max(yz.x, xz.x));

    d = mix(d, length(p) - .5, .5);
    return d;
}

float RayMarch(vec3 ro, vec3 rd) {
    float dO = 0.;

    for(int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * dO;
        float dS = GetDist(p);
        dO += dS;
        if(dO > MAX_DIST || abs(dS) < SURF_DIST)
            break;
    }

    return dO;
}

vec3 GetNormal(vec3 p) {
    float d = GetDist(p);
    vec2 e = vec2(.001, 0);

    vec3 n = d - vec3(GetDist(p - e.xyy), GetDist(p - e.yxy), GetDist(p - e.yyx));

    return normalize(n);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l - p), r = normalize(cross(vec3(0, 1, 0), f)), u = cross(f, r), c = f * z, i = c + uv.x * r + uv.y * u, d = normalize(i);
    return d;
}

void main() {
    // out vec4 fragColor, in vec2 fragCoord
    vec2 uv = (gl_FragCoord.xy - .5 * uResolution.xy) / uResolution.y;
    vec2 m = (uMouse.xy);

    vec3 ro = vec3(0, 3, -3);
    ro.yz *= Rot(-m.y * PI + 1.);
    ro.xz *= Rot(-m.x * TAU);

    vec3 rd = GetRayDir(uv, ro, vec3(0, 0., 0), 3.);
    vec3 col = vec3(0);

    float d = RayMarch(ro, rd);

    if(d < MAX_DIST) {
        vec3 p = ro + rd * d;
        vec3 n = GetNormal(p);
        vec3 r = reflect(rd, n);

        float dif = dot(n, normalize(vec3(1, 2, 3))) * .5 + .5;
        col = vec3(dif);

        col = n * .5 + .5;
        col *= (uChannel0, r).rgb;
    }
    //col *= 0.;
    //vec2 st = Koch(uv)*4.;
    //col = vec3(st.y);
    col = pow(col, vec3(.4545));	// gamma correction

    gl_FragColor = vec4(col, 1.0);
}