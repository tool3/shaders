varying vec2 vUv;
uniform float uTime;
uniform vec3 uResolution;
uniform sampler2D uChannel;

void main() {
    vec4 I = vec4(0.0);
    vec2 u = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
    vec4 res = vec4(u, 1.0, 1.0);
    float M, A, T = uTime, R;
    for(I *= R; R++ < 66.;) {
        vec4 X = res.xyzx, p = A * normalize(vec4((u + u - X.xy) *
            mat2(cos(A * sin(T * .1) * .3 + vec4(0, 33, 11, 0))), X.y, 0));
        p.z += T;
        p.y = abs(abs(p.y) - 1.);

        X = fract(dot(X = ceil(p * 4.), sin(X)) + X);
        X.g += 4.;
        M = 4. * pow(smoothstep(1., .5, texture(uChannel, (p.xz + ceil(T + X.x)) / 4.).a), 8.) - 5.;

        A += p.y * .6 - (M + A + A + 3.) / 67.;

        gl_FragColor += (X.a + .5) * (X + A) * (1.4 - p.y) / 2e2 / M / M / exp(A * .1);
    }
}