
class WebGLMaterial {
    constructor(glContext, color, ambient, vsSource, fsSource){
        this.glContext = glContext;
        this.shaderProgram = null;
        this.vertexShader = null;
        this.fragmentShader = null;
        this.color = color;
        this.ambient = ambient;
        this.initShaderProgram(vsSource, fsSource);
        this.programInfo = {
            program: this.shaderProgram,
            attribLocations: {
                vertexPosition:this.glContext.getAttribLocation(this.shaderProgram, "vertex_position"),
                normal: this.glContext.getAttribLocation(this.shaderProgram, "vertex_normal")
            },
            uniformLocations: {
                projectionMatrix: this.glContext.getUniformLocation(this.shaderProgram, "uProjectionViewMatrix"),
                modelViewMatrix: this.glContext.getUniformLocation(this.shaderProgram, "uModelViewMatrix"),
                normalMatrix: this.glContext.getUniformLocation(this.shaderProgram, "uNormalMatrix"),
                ambientLight: this.glContext.getUniformLocation(this.shaderProgram, "ambientLight"),
                lightPosition: this.glContext.getUniformLocation(this.shaderProgram, "lightPosition"),
                color: this.glContext.getUniformLocation(this.shaderProgram, "color")
               // _time: this.glContext.getUniformLocation(this.shaderProgram, "_time")
            }
        };
    }

    initShaderProgram(vsSource, fsSource)
    {
        this.vertexShader = this.loadShader(this.glContext.VERTEX_SHADER, vsSource);
        this.fragmentShader = this.loadShader(this.glContext.FRAGMENT_SHADER, fsSource);
        this.shaderProgram = this.glContext.createProgram();
        this.glContext.attachShader(this.shaderProgram, this.vertexShader);
        this.glContext.attachShader(this.shaderProgram, this.fragmentShader);
        this.glContext.linkProgram(this.shaderProgram);
        if(!this.glContext.getProgramParameter(this.shaderProgram, this.glContext.LINK_STATUS)){
            var compilationLog = this.glContext.getProgramInfoLog(this.shaderProgram);
            console.log('Shader compiler log: ' + compilationLog);
           // alert("Shader Initialization Failed!");
        }
    }

    loadShader(type, source){
        const shader = this.glContext.createShader(type);
        this.glContext.shaderSource(shader, source);
        this.glContext.compileShader(shader);
        if(!this.glContext.getShaderParameter(shader, this.glContext.COMPILE_STATUS)){
            var compilationLog = this.glContext.getShaderInfoLog(shader);
            console.log('Shader compiler log: ' + compilationLog);
           // alert("Shader Compilation Failed!");
        }
        return shader;
    }

}

export default WebGLMaterial