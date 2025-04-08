uniform float uTime;
uniform float uDeltaTime;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrength;
uniform float uFlowFieldFrequency;
uniform sampler2D uBase;

#pragma glslify: simplex4D = require(../../noise/simplex4D.glsl);

void main() {
    float time = uTime * 0.2;
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particle = texture(uParticles, uv);
    vec4 base = texture(uBase, uv);

    if(particle.a >= 1.0) {
        particle.a = mod(particle.a, 1.0);
        particle.xyz = base.xyz;
    } else {
        float strength = simplex4D(vec4(base.xyz * 0.2, time + 1.0));
        float influence = (uFlowFieldInfluence - 0.5) * (-2.0);

        strength = smoothstep(influence, 1.0, strength);

        vec3 flowField = vec3(
         simplex4D(vec4(particle.xyz * uFlowFieldFrequency + 0.0, time)), 
         simplex4D(vec4(particle.xyz * uFlowFieldFrequency + 1.0, time)),
         simplex4D(vec4(particle.xyz * uFlowFieldFrequency + 2.0, time))
        );

        flowField = normalize(flowField);
        particle.xyz += flowField * uDeltaTime * strength * uFlowFieldStrength;


        particle.a += uDeltaTime * 0.3;
    }

    gl_FragColor = particle;
}