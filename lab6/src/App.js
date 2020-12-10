import React from "react";
import './App.css';
import Canvas from "./Canvas";
import {Button, Card, Col, Form, Row} from "react-bootstrap";

class App extends React.Component {
    canvas;
    ctx;
    points;
    DEFAULT_GRID_SIZE = 40;

    componentDidMount() {
        this.canvas = document.getElementById("canvas")
        this.ctx = this.canvas.getContext("2d")
        const canvasHeight = this.canvas.height
        this.ctx.transform(1, 0, 0, -1, 0, canvasHeight)

        this.displayCoordinates()
        this.setPoints()
        this.drawFigure()
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        this.displayCoordinates()
        this.setPoints()
        this.move(this.points)
        this.turn(this.points)
        this.drawFigure()
    }

    constructor(props) {
        super(props);
        this.state = {
            gridSize: this.DEFAULT_GRID_SIZE,
            xShift: 0,
            yShift: 0,
            zShift: 0,
            pivotPointX: 300,
            pivotPointY: 300,
            angle: 180,
            alpha: 0,
            R: 100,
            r: 50
        };
    }

    setPoints() {
        let R = this.state.R * (this.state.gridSize / 25)
        let r = this.state.r * (this.state.gridSize / 25)
        let step = 0.1
        this.points = []

        for (let i = 0; i < 2 * Math.PI; i += step) {
            for (let j = -Math.PI; j < Math.PI; j += step) {
                let x = (R + r * Math.cos(j)) * Math.cos(i)
                let z = (R + r * Math.cos(j)) * Math.sin(i)
                let y = r * Math.sin(j)
                this.points.push({x: x, y: y, z: z})
            }
        }

        this.shiftPoints(this.points)
        this.makeProjection()
    }

    makeProjection() {
        this.projPoints = [];
        let angle = this.convertAngle(this.state.angle)
        this.points.forEach(point => {
            let r = point.z
            let x0 = point.x
            let y0 = point.y
            let px = -0.5 * Math.cos(angle)
            let py = -0.5 * Math.sin(angle)
            let x = x0 + r * px
            let y = y0 + r * py
            point.x = x
            point.y = y
            point.z = r
        });
    }

    shiftPoints(points) {
        points.forEach(point => {
            point.x += 400
            point.y += 300
        })
    }

    drawFigure() {
        this.ctx.lineWidth = 1
        this.ctx.strokeStyle = "blue"
        for (let i = 0; i < 63; i++) {
            this.ctx.beginPath()
            this.ctx.moveTo(this.points[63 * i].x, this.points[63 * i].y)
            for (let j = 0; j < 63; j++) {
                this.ctx.lineTo(this.points[j + 63 * i].x, this.points[j + 63 * i].y)
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }
        //////////////////
        this.ctx.lineWidth = 1
        this.ctx.strokeStyle = "blue"

        for (let j = 0; j < 63; j++) {
            this.ctx.beginPath()
            this.ctx.moveTo(this.points[63 + j].x, this.points[63 + j].y)

            for (let i = 0; i < 63; i++) {
                this.ctx.lineTo(this.points[i * 63 + j].x, this.points[i * 63 + j].y)
            }

            this.ctx.closePath();
            this.ctx.stroke();
        }

    }

    displayCoordinates() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.drawAxis()
    }

    drawAxis() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const gridSize = parseInt(this.state.gridSize);
        const numLinesX = Math.floor(canvasHeight / gridSize);
        const numLinesY = Math.floor(canvasWidth / gridSize);

        this.ctx.beginPath();
        this.ctx.lineWidth = 3
        this.ctx.strokeStyle = "#000000";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "16px Verdana"

        this.ctx.moveTo(0.5, 0.5)
        let angle = this.convertAngle(225)
        let x0 = 0.5
        let y0 = 0.5
        let px = -0.5 * Math.cos(angle)
        let py = -0.5 * Math.sin(angle)
        let x = x0 + canvasWidth * px
        let y = y0 + canvasHeight * py
        this.ctx.lineTo(x, y)


        this.ctx.lineTo(x, canvasHeight)
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(canvasWidth, y)

        this.ctx.stroke();

        this.ctx.lineWidth = 1
        for (let i = 0; i < numLinesY; i++) {
            this.ctx.moveTo(x, y + gridSize * i)
            this.ctx.lineTo(0.5, 0.5 + gridSize * i)
        }

        for (let i = 0; i < numLinesX; i++) {
            this.ctx.moveTo(x + gridSize * i, y)
            this.ctx.lineTo(x + gridSize * i, canvasWidth)

            this.ctx.moveTo(x, y + gridSize * i)
            this.ctx.lineTo(canvasHeight, y + gridSize * i)
        }

        for (let i = 0; i <= numLinesX; i++) {
            this.ctx.moveTo(gridSize * i + 0.5, 0.5)
            let x0 = gridSize * i + 0.5
            let y0 = 0.5
            let px = -0.5 * Math.cos(angle)
            let py = -0.5 * Math.sin(angle)
            let x = x0 + canvasWidth * px
            let y = y0 + canvasHeight * py
            this.ctx.lineTo(x, y)
        }

        for (let i = 0; i < numLinesY; i++) {
            angle = this.convertAngle(45)
            x0 = x + 0.5
            y0 = y + 0.5
            px = -Math.cos(angle)
            py = -Math.sin(angle)
            x = x0 + gridSize * px
            y = y0 + gridSize * py
            this.ctx.moveTo(x, y)
            this.ctx.lineTo(canvasWidth + 0.5, y + 0.5)
            this.ctx.moveTo(x, y)
            this.ctx.lineTo(x + 0.5, canvasHeight + 0.5)
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }

    convertAngle(angle) {
        return angle * Math.PI / 180
    }

    xTurn(x, y) {
        let x0 = parseInt(this.state.pivotPointX)
        let y0 = parseInt(this.state.pivotPointY)
        let angle = this.convertAngle(this.state.alpha)
        return x0 + (x - x0) * Math.cos(angle) - (y - y0) * Math.sin(angle);
    }

    yTurn(x, y) {
        let x0 = parseInt(this.state.pivotPointX)
        let y0 = parseInt(this.state.pivotPointY)
        let angle = this.convertAngle(this.state.alpha)
        return y0 + (y - y0) * Math.cos(angle) + (x - x0) * Math.sin(angle);
    }

    turn(points) {
        this.polygon = []
        points.forEach(command => {
            let x = command.x
            let y = command.y
            command.x = this.xTurn(x, y)
            command.y = this.yTurn(x, y)
            this.polygon.push([command.x, command.y])
        })
    }

    move(points) {
        this.polygon = []
        points.forEach(command => {
            command.x += parseInt(this.state.xShift);
            command.y += parseInt(this.state.yShift);
            this.polygon.push([command.x, command.y])

            command.x += parseInt(this.state.zShift);
            command.y += parseInt(this.state.zShift);
        })
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
                        <Card>
                            <Card.Body className={"mx-2"}>
                                <Row className="m-3">
                                    <Form.Label>Розмір клітини</Form.Label>
                                    <Form.Control type="number"
                                                  onChange={this.handle}
                                                  name={"gridSize"}
                                                  value={this.state.gridSize}
                                                  min={1}/>
                                </Row>
                                <Row className="m-3">
                                    <Form.Label>R</Form.Label>
                                    <Form.Control type="number"
                                                  onChange={this.handle}
                                                  name={"R"}
                                                  value={this.state.R}/>
                                </Row>
                                <Row className="m-3">
                                    <Form.Label>r</Form.Label>
                                    <Form.Control type="number"
                                                  onChange={this.handle}
                                                  name={"r"}
                                                  value={this.state.r}/>
                                </Row>
                                <Row className="m-3">
                                    <Form.Label>Кут проекції</Form.Label>
                                    <Form.Control type={"number"}
                                                  onChange={this.handle}
                                                  name={"angle"}
                                                  value={this.state.angle}/>
                                </Row>
                                <Row className="m-3">
                                    <Form.Label>Кут повороту</Form.Label>
                                    <Form.Control type={"number"}
                                                  min={0}
                                                  max={360}
                                                  onChange={this.handle}
                                                  name={"alpha"}
                                                  value={this.state.alpha}/>
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

                                    <Form.Label>Зсув по Z</Form.Label>
                                    <Form.Control name="yShift"
                                                  type="number"
                                                  value={this.state.yShift}
                                                  onChange={this.handle}/>
                                    <Form.Label>Зсув по Y</Form.Label>
                                    <Form.Control name="zShift"
                                                  type="number"
                                                  value={this.state.zShift}
                                                  onChange={this.handle}/>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Canvas/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default App;
