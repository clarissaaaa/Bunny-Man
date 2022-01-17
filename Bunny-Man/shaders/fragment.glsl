uniform sampler2D moonTexture;
varying vec3 vertexNormal;

varying vec2 vertexUV;

void main() {
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(1.0,0.75,0.75) * pow(intensity, 1.5);
    gl_FragColor = vec4(atmosphere + texture2D(moonTexture, vertexUV).xyz, 1.0);
}