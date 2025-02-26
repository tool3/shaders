varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vPos;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    vec4 mvPosition = viewMatrix * modelPosition;

    // Varyings
    vNormal = normalize(modelNormal);
    vPosition = modelPosition.xyz;
    vPos = normalize(modelPosition.xyz - cameraPosition);
    
}