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

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    vec4 O = gl_FragColor;
    vec2 I  = gl_FragCoord.xy;
    O *= 0.;
    //Initialize resolution for scaling
    vec2 r = uResolution.xy,
    //Save centered pixel coordinates
    p = (I - r * .6) * mat2(1, -1, 2, 2);

    //Initialize loop iterator and arc angle
    for(float i = 0., a;
        //Loop 300 times
        i++ < 3e1;
        //Add with ring attenuation
        O += .2 / (abs(length(I = p / (r + r - p).y) * 8e1 - i) + 4e1 / r.y) *
        //Limit to arcs
            clamp(cos(a = atan(I.y, I.x) * ceil(i * .1) + uTime * sin(i * i) + i * i), .0, .6) *
        //Give them color
            (cos(a - i + vec4(0, 1, 2, 0)) + 1.));

    gl_FragColor = O;
}
