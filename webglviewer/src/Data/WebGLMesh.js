import * as glMatrix from "./gl-matrix"

class WebGLMesh {
    constructor(material, mesh, camera, light, position, rotation, scale){
        this.material = material;
        this.mesh = mesh;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.modelViewMatrix = glMatrix.mat4.create();
        this.normalMatrix = glMatrix.mat4.create();
        this.camera = camera;
        this.light = light;
    }

    setCamera(camera){
        this.camera = camera;
    }

    bindBuffers(){
        this.material.glContext.enableVertexAttribArray(
            this.material.programInfo.attribLocations.vertexPosition
        );
        const positionBuffer = this.material.glContext.createBuffer();
        this.material.glContext.bindBuffer(this.material.glContext.ARRAY_BUFFER, positionBuffer);
        this.material.glContext.bufferData(this.material.glContext.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), this.material.glContext.STATIC_DRAW);
        this.material.glContext.vertexAttribPointer(this.material.programInfo.attribLocations.vertexPosition,
            3,
            this.material.glContext.FLOAT,
            false,
            0,
            0);
        this.material.glContext.enableVertexAttribArray(
            this.material.programInfo.attribLocations.normal
        );
        const normalBuffer = this.material.glContext.createBuffer();
        this.material.glContext.bindBuffer(this.material.glContext.ARRAY_BUFFER, normalBuffer);
        this.material.glContext.bufferData(this.material.glContext.ARRAY_BUFFER, new Float32Array(this.mesh.normals), this.material.glContext.STATIC_DRAW);
        this.material.glContext.vertexAttribPointer(this.material.programInfo.attribLocations.normal,
            3,
            this.material.glContext.FLOAT,
            false,
            0,
            0);
        const indexBuffer = this.material.glContext.createBuffer();
        this.material.glContext.bindBuffer(this.material.glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.material.glContext.bufferData(this.material.glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.tris), this.material.glContext.STATIC_DRAW);
    }

    rotateAroundOrigin(rads){
        this.rotation[1] = (this.rotation[1]+rads)%6.28;
        if(this.rotation[1] < 0){
            this.rotation[1] = 6.28-this.rotation[1];
        }
    }

    draw(frame){
        this.bindBuffers();
        const glContext = this.material.glContext;
        glMatrix.mat4.identity(this.modelViewMatrix);
        glMatrix.mat4.rotate(this.modelViewMatrix,
            this.modelViewMatrix,
            this.rotation[0],
            [1,0,0]);
        glMatrix.mat4.rotate(this.modelViewMatrix,
            this.modelViewMatrix,
            this.rotation[1],
            [0,1,0]);
        glMatrix.mat4.rotate(this.modelViewMatrix,
            this.modelViewMatrix,
            this.rotation[2],
            [0,0,1]);
      //  glContext.bindBuffer(glContext.ARRAY_BUFFER, this.buffers.position);
        glMatrix.mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.position);
        glMatrix.mat4.scale(this.modelViewMatrix, this.modelViewMatrix, this.scale);
        glMatrix.mat4.invert(this.normalMatrix, this.modelViewMatrix);
        glMatrix.mat4.transpose(this.normalMatrix, this.normalMatrix);
        glContext.useProgram(this.material.programInfo.program);
        glContext.uniformMatrix4fv(
            this.material.programInfo.uniformLocations.projectionMatrix,
            false,
            this.camera.projectionMatrix
        );
        glContext.uniformMatrix4fv(
            this.material.programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix
        );
        glContext.uniformMatrix4fv(
            this.material.programInfo.uniformLocations.normalMatrix,
            false,
            this.normalMatrix
        );
        glContext.uniform3fv(this.material.programInfo.uniformLocations.lightPosition, this.light.position);
        glContext.uniform4fv(this.material.programInfo.uniformLocations.color, this.material.color);
        glContext.uniform1f(this.material.programInfo.uniformLocations.ambientLight, this.material.ambient);
        glContext.drawElements(glContext.TRIANGLES, this.mesh.tris.length, glContext.UNSIGNED_SHORT, 0);
    }
}

export default WebGLMesh