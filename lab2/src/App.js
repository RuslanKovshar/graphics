import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Row, Col, Form} from "react-bootstrap";
import Canvas from "./Canvas";

class App extends React.Component {
    canvas;
    ctx;
    figurePoints;
    tangentPoints;
    normalPoints;
    xCenter;
    yCenter;
    arcLength;

    componentDidMount() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        const canvasWidth = this.canvas.width
        const canvasHeight = this.canvas.height
        this.xCenter = canvasWidth / 2
        this.yCenter = canvasHeight / 2
        this.displayCoordinates()
        this.displayFigure()
        this.displayTangent()
        this.displayNormal()
        this.setState({
            arcLength: this.calculateArcLength()
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.displayCoordinates()
        this.displayFigure()
        this.displayTangent()
        this.displayNormal()
        let arcLength = this.calculateArcLength();
        let prevArcLength = prevState.arcLength
        arcLength = Math.round((arcLength * 100) / 100)
        prevArcLength = Math.round((prevArcLength * 100) / 100)
        if (arcLength !== prevArcLength) {
            this.setState({
                arcLength: arcLength
            })
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            gridSize: 25,
            figureParamA: 300,
            figureParamB: 300,
            figureParamN: 1 / 2,
            angle: 0,
            pivotPointX: 400,
            pivotPointY: 400,
            xShift: 0,
            yShift: 0,
            phi: 45,
            arcLength: 0
        };
    }

    displayCoordinates() {
        this.drawGrid()
        this.drawAxis()
    }

    displayFigure() {
        this.setUpFigure()
        this.turn(this.figurePoints)
        this.move(this.figurePoints)
        this.draw(this.figurePoints, "black")
    }

    displayTangent() {
        this.setUpTangent()
        this.turn(this.tangentPoints)
        this.move(this.tangentPoints)
        console.log(this.tangentPoints)
        this.draw(this.tangentPoints, "red")
    }

    displayNormal() {
        this.setUpNormal()
        this.turn(this.normalPoints)
        this.move(this.normalPoints)
        this.draw(this.normalPoints, "blue")
    }

    drawGrid() {
        const gridSize = this.state.gridSize;
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const numLinesX = Math.floor(canvasHeight / gridSize);
        const numLinesY = Math.floor(canvasWidth / gridSize);
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        if (gridSize > 0) {
            this.ctx.beginPath()
            let i;
            for (i = 0; i <= numLinesX; i++) {
                this.ctx.moveTo(0, gridSize * i + 0.5);
                this.ctx.lineTo(canvasWidth, gridSize * i + 0.5);
            }

            for (i = 0; i <= numLinesY; i++) {
                this.ctx.moveTo(gridSize * i + 0.5, 0);
                this.ctx.lineTo(gridSize * i + 0.5, canvasHeight);
            }
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    drawAxis() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const gridSize = parseInt(this.state.gridSize);

        this.ctx.beginPath();
        this.ctx.strokeStyle = "#000000";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "16px Verdana"
        // y
        this.ctx.moveTo(1.5, 0);
        this.ctx.lineTo(1.5, canvasHeight);
        // x
        this.ctx.moveTo(0, 1.5);
        this.ctx.lineTo(canvasWidth, 1.5);
        // y arrow
        this.ctx.moveTo(0, canvasHeight);
        let arrowTop = canvasHeight - 20.5;
        this.ctx.lineTo(0, arrowTop);
        this.ctx.moveTo(0, canvasHeight);
        this.ctx.lineTo(10.5, arrowTop)
        this.ctx.fillText('Y', 21, arrowTop);
        // x arrow
        this.ctx.moveTo(canvasWidth, 0);
        this.ctx.lineTo(arrowTop, 0);
        this.ctx.moveTo(canvasWidth, 0);
        this.ctx.lineTo(arrowTop, 10.5);
        this.ctx.fillText('X', arrowTop, 21);
        // x grid size
        this.ctx.moveTo(gridSize, 0);
        this.ctx.lineTo(gridSize, 10.5);
        this.ctx.fillText(gridSize + '', gridSize + 10.5, 21);
        // y grid size
        this.ctx.moveTo(0, gridSize);
        this.ctx.lineTo(10.5, gridSize);
        this.ctx.fillText(gridSize + '', 21, gridSize + 10.5);

        this.ctx.stroke();
        this.ctx.closePath();
    }

    setUpFigure() {
        this.figurePoints = []
        let initialPoints = this.calculateInitialFigurePoints(this.figurePoints)
        this.figurePoints = this.figurePoints.concat(this.createOtherFigurePart(initialPoints, 1, 1))
        this.figurePoints = this.figurePoints.concat(this.createOtherFigurePart(initialPoints, -1, 1))
        this.figurePoints = this.figurePoints.concat(this.createOtherFigurePart(initialPoints, -1, -1))
        this.figurePoints = this.figurePoints.concat(this.createOtherFigurePart(initialPoints, 1, -1))
    }


    createOtherFigurePart(points, xMultiplier, yMultiplier) {
        let newPoints = []
        let point = points[0]
        if (xMultiplier * yMultiplier < 0) {
            for (let i = points.length - 1; i >= 0; i--) {
                point = points[i]
                newPoints.push({x: xMultiplier * point.x + this.xCenter, y: yMultiplier * point.y + this.yCenter})
            }
        } else {
            for (let i = 0; i < points.length; i++) {
                point = points[i]
                newPoints.push({x: xMultiplier * point.x + this.xCenter, y: yMultiplier * point.y + this.yCenter})
            }
        }
        return newPoints
    }

    calculateInitialFigurePoints() {
        let points = []
        for (let i = 0; i < Math.PI / 2; i += 0.001) {
            points.push({x: this.x(i), y: this.y(i)})
        }
        return points
    }

    calculateArcLength() {
        let sum = 0;
        for (let i = 0; i < this.figurePoints.length - 1; i++) {
            let a = this.figurePoints[i]
            let b = this.figurePoints[i + 1]
            sum += Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
        }
        return sum
    }

    x(angle) {
        let a = this.state.figureParamA;
        let n = this.state.figureParamN;
        return a * Math.pow(Math.cos(angle), 2 / n);
    }

    y(angle) {
        let b = this.state.figureParamB;
        let n = this.state.figureParamN;
        return b * Math.pow(Math.sin(angle), 2 / n);
    }

    xDerivative(angle) {
        let a = this.state.figureParamA;
        let n = parseFloat(this.state.figureParamN)
        return -(2 * a * Math.sin(angle) * Math.pow(Math.cos(angle), 2 / n - 1)) / n
    }

    yDerivative(angle) {
        let b = this.state.figureParamB;
        let n = this.state.figureParamN;
        return (2 * b * Math.cos(angle) * Math.pow(Math.sin(angle), 2 / n - 1)) / n
    }


    setUpTangent() {
        this.tangentPoints = []
        let xStart = 0, xEnd = 1000;
        let {dx, dy, x1, y1} = this.getFunctionAndDerivativeValues();

        let yStart = this.yCenter + y1 - dy / dx * (Math.abs(xStart - this.xCenter) + x1);
        let yEnd = this.yCenter + y1 + dy / dx * (Math.abs(xEnd - this.xCenter) - x1);

        this.tangentPoints.push({x: xStart, y: yStart})
        this.tangentPoints.push({x: xEnd, y: yEnd})
    }

    setUpNormal() {
        this.normalPoints = []
        let xStart = 0, xEnd = 1000;
        let {dx, dy, x1, y1} = this.getFunctionAndDerivativeValues();

        let yStart = this.yCenter + y1 + 1 / (dy / dx) * (Math.abs(xStart - this.xCenter) + x1);
        let yEnd = this.yCenter + y1 - 1 / (dy / dx) * (Math.abs(xEnd - this.xCenter) - x1);

        this.normalPoints.push({x: xStart, y: yStart})
        this.normalPoints.push({x: xEnd, y: yEnd})
    }

    getFunctionAndDerivativeValues() {
        let phi = Math.abs(parseInt(this.state.phi))
        phi = this.getPhiAs360(phi);
        let {xMult, yMult} = this.getMultipliers(phi);
        phi = this.getPhiAs90(phi);
        phi = this.convertAngle(phi)

        let dx = xMult * this.xDerivative(phi);
        let dy = yMult * this.yDerivative(phi);
        let x1 = xMult * this.x(phi);
        let y1 = yMult * this.y(phi);
        return {dx, dy, x1, y1};
    }

    getPhiAs90(phi) {
        while (phi >= 90) {
            phi -= 90;
        }
        return phi;
    }

    getMultipliers(phi) {
        let xMult, yMult
        let round = Math.floor(phi / 90);
        switch (round) {
            case 0:
                xMult = 1;
                yMult = 1;
                break;
            case 1:
                xMult = -1;
                yMult = 1;
                break;
            case 2:
                xMult = -1;
                yMult = -1;
                break;
            case 3:
                xMult = 1;
                yMult = -1;
                break;
        }
        return {xMult, yMult};
    }

    getPhiAs360(phi) {
        while (phi >= 360) {
            phi -= 360
        }
        return phi;
    }

    convertAngle(angle) {
        return angle * Math.PI / 180
    }

    xTurn(x, y) {
        let x0 = parseInt(this.state.pivotPointX)
        let y0 = parseInt(this.state.pivotPointY)
        let angle = this.convertAngle(this.state.angle)
        return x0 + (x - x0) * Math.cos(angle) - (y - y0) * Math.sin(angle);
    }

    yTurn(x, y) {
        let x0 = parseInt(this.state.pivotPointX)
        let y0 = parseInt(this.state.pivotPointY)
        let angle = this.convertAngle(this.state.angle)
        return y0 + (y - y0) * Math.cos(angle) + (x - x0) * Math.sin(angle);
    }

    turn(points) {
        points.forEach(command => {
            let x = command.x
            let y = command.y
            command.x = this.xTurn(x, y)
            command.y = this.yTurn(x, y)
        })
    }

    move(points) {
        points.forEach(command => {
            command.x += parseInt(this.state.xShift);
            command.y += parseInt(this.state.yShift);
        })
    }

    draw(points, color) {
        this.ctx.beginPath()
        this.ctx.strokeStyle = color
        points.forEach(point => {
            this.ctx.lineTo(point.x, point.y)
        })
        this.ctx.stroke()
        this.ctx.strokeStyle = "black"
        this.ctx.closePath()
    }

    handle = (e) => {
        const {name, value} = e.currentTarget;
        this.setState({
            [name]: value
        })
    }


    render() {
        return (
            <div className="mt-2">
                <Row>
                    <Col sm={3}>
                        <Row className="m-3">
                            <Form.Label>Розмір клітини</Form.Label>
                            <Form.Control type="number"
                                          onChange={this.handle}
                                          name={"gridSize"}
                                          value={this.state.gridSize}
                                          min={1}/>
                        </Row>
                        <hr/>
                        <Row className="m-3">
                            <Form.Label>Параметр a</Form.Label>
                            <Form.Control type={"number"}
                                          onChange={this.handle}
                                          name={"figureParamA"}
                                          value={this.state.figureParamA}/>
                        </Row>
                        <Row className="m-3">
                            <Form.Label>Параметр b</Form.Label>
                            <Form.Control type={"number"}
                                          onChange={this.handle}
                                          name={"figureParamB"}
                                          value={this.state.figureParamB}/>
                        </Row>
                        <Row className="m-3">
                            <Form.Label>Параметр N</Form.Label>
                            <Form.Control type={"number"}
                                          step={"0.1"}
                                          min={0.2}
                                          onChange={this.handle}
                                          name={"figureParamN"}
                                          value={this.state.figureParamN}/>
                        </Row>
                        <hr/>
                        <Row className="m-3">
                            <Form.Label>Кут повороту</Form.Label>
                            <Form.Control type={"number"}
                                          onChange={this.handle}
                                          name={"angle"}
                                          value={this.state.angle}/>
                        </Row>
                        <Row className="m-3">
                            <Col>
                                <Form.Label>Точка повороту Х</Form.Label>
                                <Form.Control name="pivotPointX"
                                              type="number"
                                              onChange={this.handle}
                                              value={this.state.pivotPointX}/>
                            </Col>
                            <Col>
                                <Form.Label>Точка повороту Y</Form.Label>
                                <Form.Control name="pivotPointY"
                                              type="number"
                                              onChange={this.handle}
                                              value={this.state.pivotPointY}/>
                            </Col>
                        </Row>
                        <hr/>
                        <Row className="m-3">
                            <Form.Label>Зсув по Х</Form.Label>
                            <Form.Control name="xShift"
                                          type="number"
                                          value={this.state.xShift}
                                          onChange={this.handle}/>

                            <Form.Label>Зсув по Y</Form.Label>
                            <Form.Control name="yShift"
                                          type="number"
                                          value={this.state.yShift}
                                          onChange={this.handle}/>
                        </Row>
                        <hr/>
                        <Row className="m-3">
                            <Form.Label>Phi</Form.Label>
                            <Form.Control name="phi"
                                          type="number"
                                          value={this.state.phi}
                                          onChange={this.handle}/>
                        </Row>
                        <Row className="m-3">
                            <Form.Label>Довжина дуги</Form.Label>
                            <Form.Control readOnly
                                          value={this.state.arcLength}/>
                        </Row>
                    </Col>
                    <Col><Canvas/></Col>
                </Row>
            </div>
        );
    }
}

export default App;
