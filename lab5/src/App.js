import React from "react";
import './App.css';
import Canvas from "./Canvas";
import {Button, Card, Col, Form, Row} from "react-bootstrap";

class App extends React.Component {
    canvas;
    ctx;
    xCenter;
    yCenter;
    points;
    projPoints;
    oldPoints;
    polygon;

    componentDidMount() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        const canvasWidth = this.canvas.width
        const canvasHeight = this.canvas.height
        this.ctx.transform(1, 0, 0, -1, 0, canvasHeight)

        this.xCenter = canvasWidth / 2
        this.yCenter = canvasHeight / 2

        this.displayCoordinates()
        this.setPoints()
        this.makeProjection()
        if (this.state.showPoints) this.displayPoints()
        if (this.state.showLines) this.displayPointLines()
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        this.displayCoordinates()
        this.setPoints()
        this.move(this.points)
        this.turn(this.points)
        this.makeProjection()
        if (this.state.showPoints) this.displayPoints()
        if (this.state.showLines) this.displayPointLines()
    }

    constructor(props) {
        super(props);
        this.state = {
            gridSize: 25,
            radius: 7,
            showPoints: false,
            showLines: true,
            xShift: 0,
            yShift: 0,
            zShift: 0,
            pivotPointX: 200,
            pivotPointY: 200,
            angle: 225,
            alpha: 0,
            budSizeX: 250,
            budSizeY: 200,
        };
    }

    setPoints() {
        let lx = parseInt(this.state.budSizeX) * (this.state.gridSize / 25)
        let ly = parseInt(this.state.budSizeY) * (this.state.gridSize / 25)
        let startX = 350
        let startY = 500

        this.points = []
        //========initial cube=========//
        this.points.push({x: startX, y: startY, col: "red"})
        this.points.push({x: startX + lx / 2, y: startY + ly / 2, col: "red"})
        this.points.push({x: startX + lx, y: startY, col: "red"})
        this.points.push({x: startX + lx, y: startY - ly, col: "red"})
        this.points.push({x: startX, y: startY - ly, col: "red"})

        this.polygon = []
        this.points.forEach(point => {
            this.polygon.push([point.x, point.y])
        })

        this.oldPoints = this.points.slice(0, this.points.length)
    }

    makeProjection() {
        let lx = parseInt(this.state.budSizeX) * (this.state.gridSize / 25)
        let ly = parseInt(this.state.budSizeY) * (this.state.gridSize / 25)
        this.projPoints = [];
        let angle = this.convertAngle(this.state.angle)
        this.oldPoints.forEach(point => {
            let x0 = point.x
            let y0 = point.y
            let px = -0.5 * Math.cos(angle)
            let py = -0.5 * Math.sin(angle)
            let x = x0 + lx * px
            let y = y0 + ly * py
            this.projPoints.push({x: x, y: y, col: "blue"})
        });
    }

    shiftPoints(points) {
        points.forEach(point => {
            point.x += 100
            point.y += 100
        })
    }

    inside(point, vs) {
        // ray-casting algorithm based on
        // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

        let x = point[0], y = point[1];

        let inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            let xi = vs[i][0], yi = vs[i][1];
            let xj = vs[j][0], yj = vs[j][1];

            let intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    };


    displayPointLines() {
        const canvasHeight = this.canvas.height;
        // this.ctx.transform(1, 0, 0, -1, 0, canvasHeight)
        for (let i = 0; i < this.points.length - 1; i += 1) {
            this.ctx.lineWidth = 3
            this.ctx.strokeStyle = "purple"
            this.ctx.beginPath()
            if (this.inside([this.projPoints[i + 1].x, this.projPoints[i + 1].y], this.polygon) ||
                this.inside([this.projPoints[i].x, this.projPoints[i].y], this.polygon)) {
                this.ctx.setLineDash([5, 15]);
                this.ctx.strokeStyle = "purple"
            }
            this.ctx.moveTo(this.points[i].x, this.points[i].y)
            this.ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y)
            this.ctx.lineTo(this.projPoints[i + 1].x, this.projPoints[i + 1].y)
            this.ctx.lineTo(this.projPoints[i].x, this.projPoints[i].y)
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }

        this.ctx.lineWidth = 3
        this.ctx.strokeStyle = "purple"
        this.ctx.beginPath()
        if (this.inside([this.projPoints[4].x, this.projPoints[4].y], this.polygon) ||
            this.inside([this.projPoints[0].x, this.projPoints[0].y], this.polygon)) {
            this.ctx.setLineDash([5, 15]);
            this.ctx.strokeStyle = "purple"
        }
        this.ctx.moveTo(this.points[4].x, this.points[4].y)
        this.ctx.lineTo(this.points[0].x, this.points[0].y)
        this.ctx.lineTo(this.projPoints[0].x, this.projPoints[0].y)
        this.ctx.lineTo(this.projPoints[4].x, this.projPoints[4].y)
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        this.ctx.lineWidth = 3
        this.ctx.strokeStyle = "purple"
        this.ctx.beginPath()
        this.ctx.moveTo(this.points[0].x, this.points[0].y)
        for (let i = 1; i < this.points.length; i++) {
            let point1 = this.points[i]
            this.ctx.lineTo(point1.x, point1.y)
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    displayPoints() {
        let radius = this.state.radius
        this.points.forEach(point => {
            this.ctx.beginPath()
            this.ctx.moveTo(point.x, point.y)
            this.ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
            this.ctx.fillStyle = point.col
            this.ctx.fill()
            this.ctx.stroke()
            this.ctx.closePath()
        })
    }

    displayCoordinates() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        //this.drawGrid()
        this.drawAxis()
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
            this.ctx.strokeStyle = "black"
            this.ctx.lineWidth = 1
            this.ctx.stroke();
            this.ctx.closePath();
        }
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
        /*// y
        this.ctx.moveTo(1.5, 0);
        this.ctx.lineTo(1.5, canvasHeight);

        // x
        this.ctx.moveTo(0, 1.5);
        this.ctx.lineTo(canvasWidth, 1.5);

        */
        //
        // // y arrow
        // this.ctx.moveTo(0, canvasHeight);
        // let arrowTop = canvasHeight - 20.5;
        // this.ctx.lineTo(0, arrowTop);
        // this.ctx.moveTo(0, canvasHeight);
        // this.ctx.lineTo(10.5, arrowTop)
        // this.ctx.fillText('Y', 21, arrowTop);
        // // x arrow
        // this.ctx.moveTo(canvasWidth, 0);
        // this.ctx.lineTo(arrowTop, 0);
        // this.ctx.moveTo(canvasWidth, 0);
        // this.ctx.lineTo(arrowTop, 10.5);
        // this.ctx.fillText('X', arrowTop, 21);
        // // x grid size
        // this.ctx.moveTo(gridSize, 0);
        // this.ctx.lineTo(gridSize, 10.5);
        // this.ctx.fillText(gridSize + '', gridSize + 10.5, 21);
        // // y grid size
        // this.ctx.moveTo(0, gridSize);
        // this.ctx.lineTo(10.5, gridSize);
        // this.ctx.fillText(gridSize + '', 21, gridSize + 10.5);

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

    showPoints = () => {
        let show = !this.state.showPoints
        this.setState({showPoints: show})
    }

    showLines = () => {
        let show = !this.state.showLines
        this.setState({showLines: show})
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
                                    <Form.Label>Ширина будинку</Form.Label>
                                    <Form.Control type="number"
                                                  onChange={this.handle}
                                                  name={"budSizeX"}
                                                  value={this.state.budSizeX}
                                                  min={1}/>
                                </Row>
                                <Row className="m-3">
                                    <Form.Label>Висота будинку</Form.Label>
                                    <Form.Control type="number"
                                                  onChange={this.handle}
                                                  name={"budSizeY"}
                                                  value={this.state.budSizeY}
                                                  min={1}/>
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

                                    <Form.Label>Зсув по Y</Form.Label>
                                    <Form.Control name="yShift"
                                                  type="number"
                                                  value={this.state.yShift}
                                                  onChange={this.handle}/>
                                    <Form.Label>Зсув по Z</Form.Label>
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
