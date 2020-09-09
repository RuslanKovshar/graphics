import React from 'react';
import './App.css';
import Canvas from "./Canvas";

class App extends React.Component {

    componentDidMount() {
        this.draw()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.draw()
    }

    constructor(props) {
        super(props);
        this.state = {
            radius: 50,
            distance: 100,
            grid: 50
        };

        this.handleRadius = this.handleRadius.bind(this);
        this.handleDistance = this.handleDistance.bind(this);
        this.handleGrid = this.handleGrid.bind(this);
    }

    draw() {
        const defaultSize = 50;
        let i;
        const gridSize = this.state.grid;
        const pixelSize = gridSize / defaultSize;
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const numLinesX = Math.floor(canvasHeight / gridSize);
        const numLinesY = Math.floor(canvasWidth / gridSize);

        for (i = 0; i <= numLinesX; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#e9e9e9";
            ctx.moveTo(0, gridSize * i + 0.5);
            ctx.lineTo(canvasWidth, gridSize * i + 0.5);
            ctx.stroke();
            ctx.closePath();
        }

        for (i = 0; i <= numLinesY; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#e9e9e9";
            ctx.moveTo(gridSize * i + 0.5, 0);
            ctx.lineTo(gridSize * i + 0.5, canvasHeight);
            ctx.stroke();
            ctx.closePath();
        }

        //draw coordinates lines
        const startX = canvasWidth / 2;
        const startY = canvasHeight / 2;
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.moveTo(canvasWidth / 2 + 0.5, 0);
        ctx.lineTo(canvasWidth / 2 + 0.5, canvasHeight);
        ctx.moveTo(0, canvasHeight / 2 + 0.5);
        ctx.lineTo(canvasWidth, canvasHeight / 2 + 0.5);
        ctx.stroke();
        ctx.closePath();

        //draw figure
        ctx.beginPath();
        ctx.strokeStyle = "#dd1212";
        ctx.lineWidth = 1;
        ctx.moveTo(startX, startY);

        //params
        let r = this.state.radius * pixelSize;
        let circleDistanceFromCenter = this.state.distance * pixelSize;
        let rightIndent = 1.5 * this.state.radius * pixelSize + circleDistanceFromCenter;
        let topIndent = 2 * this.state.radius * pixelSize;
        let bottomIndent = 1.75 * this.state.radius * pixelSize;

        // правый круг и нижняя линия
        let prevX = startX + circleDistanceFromCenter;
        let prevY = startY;
        ctx.moveTo(prevX, prevY);

        ctx.moveTo(prevX + r * Math.cos(1.17 * Math.PI), prevY + r * Math.sin(1.17 * Math.PI))
        let circleCenterX = prevX;
        let circleCenterY = prevY;
        for (let i = 1.17 * Math.PI; i < 2.83 * Math.PI; i += 1 / r) {
            prevX = circleCenterX + r * Math.cos(i)
            prevY = circleCenterY + r * Math.sin(i)
            ctx.lineTo(circleCenterX + r * Math.cos(i), circleCenterY + r * Math.sin(i))
        }
        let length = 2 * (circleDistanceFromCenter - (circleCenterX - prevX));
        prevX = prevX - length
        ctx.lineTo(prevX, prevY);

        //левый круг и верхняя линия
        prevX = startX - circleDistanceFromCenter;
        prevY = startY;
        ctx.moveTo(prevX, prevY);

        ctx.moveTo(prevX + r * Math.cos(2.17 * Math.PI), prevY + r * Math.sin(2.17 * Math.PI))
        circleCenterX = prevX;
        circleCenterY = prevY;
        for (let i = 2.17 * Math.PI; i < 3.83 * Math.PI; i += 1 / r) {
            prevX = circleCenterX + r * Math.cos(i)
            prevY = circleCenterY + r * Math.sin(i)
            ctx.lineTo(circleCenterX + r * Math.cos(i), circleCenterY + r * Math.sin(i))
        }
        length = 2 * (circleDistanceFromCenter - (prevX - circleCenterX));
        prevX = prevX + length;
        ctx.lineTo(prevX, prevY);

        ctx.moveTo(startX + rightIndent, startY - topIndent);
        ctx.lineTo(startX + rightIndent, startY + bottomIndent);
        ctx.lineTo(startX - rightIndent, startY + bottomIndent);

        ctx.lineTo(startX - rightIndent, startY - topIndent);

        let hight = 50 * pixelSize;

        ctx.lineTo(startX - rightIndent, startY - topIndent - hight);
        ctx.lineTo(startX - rightIndent + 1.5 * this.state.radius * pixelSize, startY - topIndent - hight);
        ctx.lineTo(startX - rightIndent + 1.5 * this.state.radius * pixelSize, startY - topIndent);
        ctx.lineTo(startX - rightIndent + 1.5 * this.state.radius * pixelSize + 2 * circleDistanceFromCenter, startY - topIndent);
        ctx.lineTo(startX - rightIndent + 1.5 * this.state.radius * pixelSize + 2 * circleDistanceFromCenter, startY - topIndent - hight);
        ctx.lineTo(startX - rightIndent + 1.5 * this.state.radius * pixelSize + 2 * circleDistanceFromCenter + 1.5 * this.state.radius * pixelSize, startY - topIndent - hight);
        ctx.lineTo(startX - rightIndent + 1.5 * this.state.radius * pixelSize + 2 * circleDistanceFromCenter + 1.5 * this.state.radius * pixelSize, startY - topIndent);


        ctx.stroke();
        ctx.closePath();
    }

    handleRadius(event) {
        this.setState({radius: event.target.value});
    }

    handleDistance(event) {
        this.setState({distance: event.target.value});
    }

    handleGrid(event) {
        let value = event.target.value;
        if (value > 0)
            this.setState({grid: value});
    }

    render() {
        return (
            <div className="App">
                <input placeholder={"Radius"} type="range" onChange={this.handleRadius}/>
                <input placeholder={"Distance"} type="range" max={300} onChange={this.handleDistance}/>
                <input placeholder={"Grid"} type="range" onChange={this.handleGrid}/>
                <Canvas/>
            </div>
        );
    }
}

export default App;
