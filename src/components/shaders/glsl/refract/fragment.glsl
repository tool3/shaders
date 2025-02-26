uniform vec2 uResolution;
uniform sampler2D uTexture;
varying vec3 vColor;
varying vec3 vPosition;
varying vec3 vPos;
varying vec3 vNormal;
uniform float uTime;
uniform vec2 uMouse;

#pragma glslify: cnoise = require(../noise/perlin3D.glsl);
#pragma glslify: random2D = require(../noise/random2D.glsl);
#pragma glslify: simplex4D = require(../noise/simplex4D.glsl);

mat2 rot2D(float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return mat2(c, -s, s, c);
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
    vec3 baseFirst = vec3(240.0 / 255.0, 0.0 / 255.0, 255.0 / 255.0);
    vec3 accent = vec3(0.0, 0.0, 0.1);
    vec3 baseSecond = vec3(77.0 / 255.0, 238.0 / 255.0, 234.0 / 255.0);
    vec3 baseThird = vec3(240.0 / 255.0, 0.0 / 255.0, 255.0 / 255.0);

    vec2 a = fract(uv - .5);
    a *= 20.0;

    vec3 positionUv = vPosition;
    // positionUv.xy += uMouse.xy * 0.8;

    float baseN = random2D(positionUv.xy + uTime);
    float n = simplex4D(vec4(positionUv + uTime * 0.1, 1.0));
    float n2 = mix(n, baseN, 0.1);

    vec2 baseUv = rot2D(n * .5) * positionUv.xy * 0.05;
    float basePattern = lines(baseUv, 0.8);
    float secondPattern = lines(baseUv, 0.3);

    vec3 baseColor = mix(baseSecond, baseFirst, basePattern);
    vec3 secondBaseColor = mix(baseColor, accent, secondPattern);

    // color
    vec3 col = vec3(1.0);

    vec2 uvRandom = uv.xy * n;
    uvRandom.y *= random(vec2(uvRandom.y, 0.4));
    // col.rgb += random(uvRandom);

    col = mix(col, secondBaseColor, 0.9);
    float iorRatio = 1.0 / 1.305;
    
    vec3 refractVec = refract(vPosition, vNormal, iorRatio);

    vec4 color = texture2D(uTexture, fract(a) + fract(refractVec.xy));

    vec3 col2 = vec3(fract(a.x) * 3.1);
    // col2 = mix(col2, color.xyz , 0.8);

    col = mix(col2, col, 0.9);
    col += mix(refractVec * 0.01, col, smoothstep(0.0, 1.0, 0.5));
    // col *= refractVec.xyz;

    gl_FragColor = vec4(col, 1.0);

}
