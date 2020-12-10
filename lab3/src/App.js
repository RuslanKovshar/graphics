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
    secondPoints;
    oldPoints;

    BB;
    offsetX;
    offsetY;
    WIDTH;
    HEIGHT;

    // drag related variables
    dragok;
    startX;
    startY;

    kek;

    componentDidMount() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        const canvasWidth = this.canvas.width
        const canvasHeight = this.canvas.height
        this.xCenter = canvasWidth / 2
        this.yCenter = canvasHeight / 2

        this.BB = this.canvas.getBoundingClientRect();
        this.offsetX = this.BB.left;
        this.offsetY = this.BB.top;
        this.WIDTH = this.canvas.width;
        this.HEIGHT = this.canvas.height;

        // drag related variables
        this.dragok = false;

        // listen for mouse events
        this.canvas.onmousedown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const mx = parseInt(e.clientX - this.offsetX);
            const my = parseInt(e.clientY - this.offsetY);
            let radius = parseInt(this.state.radius)
            this.dragok = false;
            for (let i = 0; i < this.points.length; i++) {
                const r = this.points[i];
                if (mx > r.x - radius && mx < r.x + radius && my > r.y - radius && my < r.y + radius) {
                    this.dragok = true;
                    r.isDragging = true;
                }
            }
            this.startX = mx;
            this.startY = my;
        }
        this.canvas.onmouseup = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dragok = false;
            for (let i = 0; i < this.points.length; i++) {
                this.points[i].isDragging = false;
            }
        }
        this.canvas.onmousemove = (e) => {
            if (this.dragok) {
                e.preventDefault();
                e.stopPropagation();
                const mx = parseInt(e.clientX - this.offsetX);
                const my = parseInt(e.clientY - this.offsetY);
                const dx = mx - this.startX;
                const dy = my - this.startY;
                let points = this.points;
                for (let i = 0; i < points.length; i++) {
                    const r = points[i];
                    if (r.isDragging) {
                        const alpha1 = Math.sqrt((points[2].x - points[1].x) ** 2 + (points[2].y - points[1].y) ** 2);
                        const alpha2 = Math.sqrt((points[3].x - points[2].x) ** 2 + (points[3].y - points[2].y) ** 2);

                        if (i === 1) {
                            this.points[i + 2].x = points[i + 1].x - alpha2 / alpha1 * (points[i].x - points[i + 1].x)
                            this.points[i + 2].y = points[i + 1].y - alpha2 / alpha1 * (points[i].y - points[i + 1].y)
                        } else if (i === 2) {
                            this.points[i - 1].x -= dx
                            this.points[i - 1].y -= dy
                            this.points[i + 1].x -= dx
                            this.points[i + 1].y -= dy
                        } else if (i === 3) {
                            this.points[i - 2].x = points[i - 1].x - alpha1 / alpha2 * (points[i].x - points[i - 1].x)
                            this.points[i - 2].y = points[i - 1].y - alpha1 / alpha2 * (points[i].y - points[i - 1].y)
                        }
                            r.x += dx;
                            r.y += dy;

                    }
                }
                this.startX = mx;
                this.startY = my;
                this.setState({gridSize: 25})
            }
        }


        this.displayCoordinates()
        this.setPoints()
        this.setUpSecondFigurePoints()
        if (this.state.showPoints) this.displayPoints()
        if (this.state.showLines) this.displayPointLines()
        this.drawPointsByBezier(this.points)
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        this.displayCoordinates()
        this.turn(this.points)
        this.move(this.points)
        if (this.state.showPoints) this.displayPoints()
        if (this.state.showLines) this.displayPointLines()
        this.drawPointsByBezier(this.points)
    }

    constructor(props) {
        super(props);
        this.state = {
            gridSize: 25,
            radius: 7,
            showPoints: true,
            showLines: false,
            xShift: 0,
            yShift: 0,
            pivotPointX: 0,
            pivotPointY: 0,
            angle: 0
        };
    }

    setPoints() {
        this.points = []
        this.points.push({x: 383, y: 183, isDragging: false})
        this.points.push({x: 534, y: 84, isDragging: false})
        this.points.push({x: 412, y: 5, isDragging: false})
        this.points.push({x: 374, y: 11, isDragging: false})
        this.points.push({x: 408, y: 39, isDragging: false})
        this.points.push({x: 436, y: 96, isDragging: false})
        this.points.push({x: 356, y: 143, isDragging: false})
        this.points.push({x: 321, y: 112, isDragging: false})
        this.points.push({x: 279, y: 104, isDragging: false})
        this.points.push({x: 287, y: 37, isDragging: false})
        this.points.push({x: 223, y: 105, isDragging: false})
        this.points.push({x: 208, y: 124, isDragging: false})
        this.points.push({x: 190, y: 107, isDragging: false})
        this.points.push({x: 174, y: 60, isDragging: false})
        this.points.push({x: 135, y: 72, isDragging: false})
        this.points.push({x: 125, y: 93, isDragging: false})
        this.points.push({x: 156, y: 118, isDragging: false})
        this.points.push({x: 170, y: 136, isDragging: false})
        this.points.push({x: 149, y: 149, isDragging: false})
        this.points.push({x: 123, y: 163, isDragging: false})
        this.points.push({x: 108, y: 193, isDragging: false})
        this.points.push({x: 77, y: 212, isDragging: false})
        this.points.push({x: 65, y: 231, isDragging: false})
        this.points.push({x: 68, y: 258, isDragging: false})
        this.points.push({x: 98, y: 299, isDragging: false})
        this.points.push({x: 104, y: 317, isDragging: false})
        this.points.push({x: 115, y: 338, isDragging: false})
        this.points.push({x: 121, y: 391, isDragging: false})
        this.points.push({x: 113, y: 415, isDragging: false})
        this.points.push({x: 88, y: 447, isDragging: false})
        this.points.push({x: 78, y: 471, isDragging: false})
        this.points.push({x: 93, y: 490, isDragging: false})
        this.points.push({x: 75, y: 528, isDragging: false})
        this.points.push({x: 55, y: 575, isDragging: false})
        this.points.push({x: 85, y: 574, isDragging: false})
        this.points.push({x: 83, y: 592, isDragging: false})
        this.points.push({x: 94, y: 589, isDragging: false})
        this.points.push({x: 129, y: 545, isDragging: false})
        this.points.push({x: 114, y: 512, isDragging: false})
        this.points.push({x: 121, y: 495, isDragging: false})
        this.points.push({x: 132, y: 480, isDragging: false})
        this.points.push({x: 135, y: 409, isDragging: false})
        this.points.push({x: 187, y: 353, isDragging: false})
        this.points.push({x: 206, y: 356, isDragging: false})
        this.points.push({x: 227, y: 341, isDragging: false})
        this.points.push({x: 223, y: 356, isDragging: false})
        this.points.push({x: 236, y: 366, isDragging: false})
        this.points.push({x: 246, y: 430, isDragging: false})
        this.points.push({x: 199, y: 469, isDragging: false})
        this.points.push({x: 183, y: 485, isDragging: false})
        this.points.push({x: 189, y: 506, isDragging: false})
        this.points.push({x: 169, y: 528, isDragging: false})
        this.points.push({x: 143, y: 541, isDragging: false})
        this.points.push({x: 116, y: 568, isDragging: false})
        this.points.push({x: 126, y: 584, isDragging: false})
        this.points.push({x: 140, y: 579, isDragging: false})
        this.points.push({x: 150, y: 569, isDragging: false})
        this.points.push({x: 155, y: 589, isDragging: false})
        this.points.push({x: 218, y: 533, isDragging: false})
        this.points.push({x: 210, y: 509, isDragging: false})
        this.points.push({x: 236, y: 499, isDragging: false})
        this.points.push({x: 260, y: 462, isDragging: false})
        this.points.push({x: 255, y: 437, isDragging: false})
        this.points.push({x: 277, y: 392, isDragging: false})
        this.points.push({x: 301, y: 371, isDragging: false})
        this.points.push({x: 378, y: 311, isDragging: false})
        this.points.push({x: 377, y: 276, isDragging: false})
        this.points.push({x: 360, y: 236, isDragging: false})
        this.points.push({x: 383, y: 183, isDragging: false})

        this.shiftPoints(this.points)
        this.oldPoints = this.points
    }

    setUpSecondFigurePoints() {
        this.secondPoints = []
        this.secondPoints.push({x: 596, y: 228, isDragging: false})
        this.secondPoints.push({x: 578, y: 193, isDragging: false})
        this.secondPoints.push({x: 549, y: 176, isDragging: false})
        this.secondPoints.push({x: 546, y: 139, isDragging: false})
        this.secondPoints.push({x: 521, y: 126, isDragging: false})
        this.secondPoints.push({x: 541, y: 65, isDragging: false})
        this.secondPoints.push({x: 515, y: 68, isDragging: false})
        this.secondPoints.push({x: 511, y: 88, isDragging: false})
        this.secondPoints.push({x: 494, y: 99, isDragging: false})
        this.secondPoints.push({x: 421, y: 54, isDragging: false})
        this.secondPoints.push({x: 406, y: 29, isDragging: false})
        this.secondPoints.push({x: 381, y: 12, isDragging: false})
        this.secondPoints.push({x: 343, y: 9, isDragging: false})
        this.secondPoints.push({x: 291, y: 35, isDragging: false})
        this.secondPoints.push({x: 273, y: 24, isDragging: false})
        this.secondPoints.push({x: 199, y: 9, isDragging: false})
        this.secondPoints.push({x: 140, y: 26, isDragging: false})
        this.secondPoints.push({x: 98, y: 18, isDragging: false})
        this.secondPoints.push({x: 76, y: 71, isDragging: false})
        this.secondPoints.push({x: 79, y: 109, isDragging: false})
        this.secondPoints.push({x: 59, y: 133, isDragging: false})
        this.secondPoints.push({x: 45, y: 176, isDragging: false})
        this.secondPoints.push({x: 57, y: 214, isDragging: false})
        this.secondPoints.push({x: 32, y: 238, isDragging: false})
        this.secondPoints.push({x: 43, y: 291, isDragging: false})
        this.secondPoints.push({x: 36, y: 311, isDragging: false})
        this.secondPoints.push({x: 29, y: 332, isDragging: false})
        this.secondPoints.push({x: 57, y: 391, isDragging: false})
        this.secondPoints.push({x: 86, y: 342, isDragging: false})
        this.secondPoints.push({x: 54, y: 308, isDragging: false})
        this.secondPoints.push({x: 80, y: 254, isDragging: false})
        this.secondPoints.push({x: 103, y: 282, isDragging: false})
        this.secondPoints.push({x: 128, y: 261, isDragging: false})
        this.secondPoints.push({x: 91, y: 156, isDragging: false})
        this.secondPoints.push({x: 166, y: 256, isDragging: false})
        this.secondPoints.push({x: 192, y: 269, isDragging: false})
        this.secondPoints.push({x: 213, y: 261, isDragging: false})
        this.secondPoints.push({x: 229, y: 241, isDragging: false})
        this.secondPoints.push({x: 190, y: 244, isDragging: false})
        this.secondPoints.push({x: 147, y: 195, isDragging: false})
        this.secondPoints.push({x: 196, y: 162, isDragging: false})
        this.secondPoints.push({x: 243, y: 170, isDragging: false})
        this.secondPoints.push({x: 267, y: 190, isDragging: false})
        this.secondPoints.push({x: 275, y: 263, isDragging: false})
        this.secondPoints.push({x: 298, y: 338, isDragging: false})
        this.secondPoints.push({x: 330, y: 406, isDragging: false})
        this.secondPoints.push({x: 360, y: 397, isDragging: false})
        this.secondPoints.push({x: 379, y: 378, isDragging: false})
        this.secondPoints.push({x: 373, y: 362, isDragging: false})
        this.secondPoints.push({x: 351, y: 360, isDragging: false})
        this.secondPoints.push({x: 342, y: 344, isDragging: false})
        this.secondPoints.push({x: 329, y: 307, isDragging: false})
        this.secondPoints.push({x: 321, y: 243, isDragging: false})
        this.secondPoints.push({x: 327, y: 235, isDragging: false})
        this.secondPoints.push({x: 337, y: 227, isDragging: false})
        this.secondPoints.push({x: 367, y: 262, isDragging: false})
        this.secondPoints.push({x: 355, y: 297, isDragging: false})
        this.secondPoints.push({x: 441, y: 300, isDragging: false})
        this.secondPoints.push({x: 391, y: 271, isDragging: false})
        this.secondPoints.push({x: 368, y: 244, isDragging: false})
        this.secondPoints.push({x: 376, y: 204, isDragging: false})
        this.secondPoints.push({x: 406, y: 173, isDragging: false})
        this.secondPoints.push({x: 445, y: 207, isDragging: false})
        this.secondPoints.push({x: 486, y: 209, isDragging: false})
        this.secondPoints.push({x: 515, y: 244, isDragging: false})
        this.secondPoints.push({x: 517, y: 230, isDragging: false})
        this.secondPoints.push({x: 552, y: 253, isDragging: false})
        this.secondPoints.push({x: 585, y: 245, isDragging: false})
        this.secondPoints.push({x: 596, y: 228, isDragging: false})

        this.shiftPoints(this.secondPoints)
    }

    shiftPoints(points) {
        points.forEach(point => {
            point.x += 100
            point.y += 100
        })
    }

    drawPointsByBezier(points) {
        this.ctx.beginPath()
        for (let i = 0; i < points.length - 2; i += 2) {
            let point1 = points[i]
            let point2 = points[i + 1]
            let point3 = points[i + 2]
            this.ctx.moveTo(point1.x, point1.y)
            this.ctx.quadraticCurveTo(point2.x, point2.y, point3.x, point3.y)
        }
        this.ctx.strokeStyle = "red"
        this.ctx.lineWidth = 5
        this.ctx.stroke()
        this.ctx.closePath()
    }

    displayPointLines() {
        this.ctx.beginPath()
        for (let i = 0; i < this.points.length - 2; i += 2) {
            let point1 = this.points[i]
            let point2 = this.points[i + 1]
            let point3 = this.points[i + 2]
            this.ctx.moveTo(point1.x, point1.y)
            this.ctx.lineTo(point2.x, point2.y)
            this.ctx.lineTo(point3.x, point3.y)
        }
        this.ctx.strokeStyle = "blue"
        this.ctx.lineWidth = 2
        this.ctx.stroke()
        this.ctx.closePath()
    }

    displayPoints() {
        let radius = this.state.radius
        this.ctx.beginPath()
        this.points.forEach(point => {
            this.ctx.moveTo(point.x + radius, point.y)
            this.ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
            this.ctx.fillStyle = "#800080"
        })
        this.ctx.fill()
        this.ctx.stroke()
        this.ctx.closePath()
    }

    displayCoordinates() {
        this.drawGrid()
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

    showPoints = () => {
        let show = !this.state.showPoints
        this.setState({showPoints: show})
    }

    showLines = () => {
        let show = !this.state.showLines
        this.setState({showLines: show})
    }

    animate = () => {
        this.kek = []
        let oldPoints = this.oldPoints
        for (let i = 0; i < oldPoints.length; i++) {
            let a = oldPoints[i]
            let b = this.secondPoints[i]
            //let length = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
            //let step = length / 60
            this.kek.push([])
            for (let j = 0; j < 60; j++) {
                let alpha = j / (60 - j)
                let newX = (a.x + alpha * b.x) / (1 + alpha)
                let newY = (a.y + alpha * b.y) / (1 + alpha)
                this.kek[i].push({x: newX, y: newY})
            }
            this.kek[i].push({x: b.x, y: b.y})
        }
        this.lol()

    }

    lol = () => {
        let i = 0
        console.log(this.kek)
        let interval = setInterval(() => {
            if (i <= 60) {
                this.ctx.save();
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillRect(0, 0, 800, 800);
                this.ctx.restore();

                let points = []
                for (let j = 0; j < this.kek.length; j++) {
                    let point = this.kek[j][i]
                    points.push(point)
                }
                //this.drawPointsByBezier(points)
                this.points = points
                console.log(i)
                this.setState({gridSize: 25})
            } else {
                clearInterval(interval)
                return;
            }
            i++
        }, 10);
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
                            <Card.Body>
                                <Row className="m-3">
                                    <Form.Label>Розмір клітини</Form.Label>
                                    <Form.Control type="number"
                                                  onChange={this.handle}
                                                  name={"gridSize"}
                                                  value={this.state.gridSize}
                                                  min={1}/>
                                </Row>
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
                                <Button block onClick={this.showPoints}>Toggle show points</Button>

                                <Button block onClick={this.showLines}>Toggle show point lines</Button>

                                <Button block onClick={this.animate}>Animate</Button>

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
