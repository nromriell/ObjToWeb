import React from 'react'
import GLCanvas from '../../Components/WebGL/GLCanvas'
import WebGLCamera from "../../Data/WebGLCamera";
import WebGLMaterial from "../../Data/WebGLMaterial";
import WebGLLight from "../../Data/WebGLLight";
import WebGLMesh from "../../Data/WebGLMesh";
import VertexShader from "../../Data/VertexShader";
import FragmentShader from "../../Data/FragmentShader";
import Suzanne from "../../Data/monkey";

class WebGLMain extends React.Component {

    constructor(props){
        super(props);
        this.glContext = null;
        this.camera = null;
        this.light = null;
        this.frame = 0;
        this.selectedPosition = [0,0.5,0];
        this.rotatingCamera = false;
        this.clearColor = [props.red, props.green, props.blue, props.alpha];
        this.lastMousePosition = null;
        this.lastUpdateTime = new Date().getTime();
    }

    componentDidMount() {
        document.addEventListener("keydown", this.onButtonDown.bind(this));
        document.addEventListener("keyup", this.onButtonUp.bind(this));
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.getGLContext();

        const selectedMaterial = new WebGLMaterial(this.glContext, [1.0, 0, 0, 1], 0.3, VertexShader, FragmentShader);
        this.selectedObject = new WebGLMesh(selectedMaterial, Suzanne, this.camera, this.light, this.selectedPosition, [0,0,0], [1,1,1]);
        this.update();
    }

    resize(){
        // Lookup the size the browser is displaying the canvas.
        var realToCSSPixels = window.devicePixelRatio;
        var displayWidth  = Math.floor(this.glContext.canvas.clientWidth  * realToCSSPixels);
        var displayHeight = Math.floor(this.glContext.canvas.clientHeight * realToCSSPixels);

        // Check if the canvas is not the same size.
        if (this.glContext.canvas.width  !== displayWidth ||
            this.glContext.canvas.height !== displayHeight) {

            // Make the canvas the same size
            this.glContext.canvas.width  = displayWidth;
            this.glContext.canvas.height = displayHeight;
        }
        this.glContext.viewport(0, 0, this.glContext.canvas.width, this.glContext.canvas.height);
    }

    update() {
        let currentTime = new Date().getTime();
        if(currentTime-this.lastUpdateTime >= 16) { //Lock to 60 FPS
            this.lastUpdateTime = new Date().getTime();
            this.resize();
            this.frame += 1;
            this.clearWithColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
            this.selectedObject.draw(this.frame);
        }
    }

    getGLContext(){
        if(this.glContext == null) {
            const canvas = document.querySelector("#glCanvas");
            this.glContext = canvas.getContext("webgl");
            if(this.glContext == null){
                alert("WebGL Not Supported By This Browser");
            }
            this.camera = new WebGLCamera(this.glContext, [0,0,-5], [3.14/6,0,0]);
            this.light = new WebGLLight([0, 10 , 20], [1,1,1,1]);
        }
        return this.glContext;
    }

    clearWithColor(red, green, blue, alpha){
        if(this.glContext == null) {
            alert("No GL Context! Check WebGL Support");
            return;
        }
        this.glContext.clearColor(red, green, blue, alpha);
        this.glContext.clearDepth(10.0);
        this.glContext.enable(this.glContext.DEPTH_TEST);
        this.glContext.depthFunc(this.glContext.LEQUAL);
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT);
    }

    onMouseMove(e) {
        //console.log("Mouse Move");
        if(this.rotatingCamera){
            let diff = e.clientX-this.lastMousePosition;
            this.selectedObject.rotateAroundOrigin(diff*0.01);
            this.update();
        }
        this.lastMousePosition = e.clientX;
    }

    onMouseDown(e){
       // console.log("Mouse Down");
        this.lastMousePosition = e.clientX;
        this.rotatingCamera = true;
    }

    onMouseUp(e){
       // console.log("Mouse Up");
        this.rotatingCamera = false;
    }

    onButtonDown(e) {
        //console.log("Pressed:" + e.keyCode);
        this.update();
    }


    onButtonUp(e){
        //console.log("Pressed:"+e.keyCode);
    }

    render() {
        return (
            <GLCanvas onKeyDown={(e) => this.onButtonDown(e)} onKeyUp={(e) => this.onButtonUp(e)} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove} tabIndex="0"/>
        )
    }

}

export default WebGLMain