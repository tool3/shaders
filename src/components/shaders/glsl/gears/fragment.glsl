varying vec3 vPosition;
uniform float uSliceStart;
uniform float uSliceArc;

void main() {
    float angle = atan(vPosition.y, vPosition.x);
    angle -= uSliceStart;
    angle = mod(angle, PI2);

    if(angle > 0.0 && angle < uSliceArc)
        discard;

    vec2 csm_Slice;
}