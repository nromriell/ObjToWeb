const FragmentShader = ""+
    "precision mediump float;"+
    "varying vec3 vLighting;" +
    "uniform vec4 color;"+
    "void main()"+
    "{"+
    "gl_FragColor = color*vec4(vLighting, 1.0);"+
    "}";

export default FragmentShader