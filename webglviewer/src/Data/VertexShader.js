const VertexShader = ""+
    "attribute vec4 vertex_position;"+
    "attribute vec3 vertex_normal;"+
    "uniform mat4 uModelViewMatrix;"+
    "uniform mat4 uProjectionViewMatrix;"+
    "uniform mat4 uNormalMatrix;"+
    "uniform float ambientLight;"+
    "uniform vec3 lightPosition;"+
    "varying vec3 vLighting;"+

    "void main() {"+
    "vec4 offsetPos = vec4(0,0,0,0);"+
    "gl_Position = uProjectionViewMatrix * uModelViewMatrix * vertex_position;"+
    "vec3 directionalVector = normalize(lightPosition);"+
    "vec4 v_normal = uNormalMatrix*vec4(vertex_normal, 1.0);"+
    "float directional = max(dot(v_normal.xyz, directionalVector), 0.0);"+
    "vLighting = vec3(1,1,1)*(directional+ambientLight);"+

    "}";

export default VertexShader