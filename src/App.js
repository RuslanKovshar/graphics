import React from 'react';
import './App.css';
import Canvas from "./Canvas";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import image from "../src/image_2020-09-15_10-20-41.png"
import Button from "react-bootstrap/Button";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

class App extends React.Component {
    gridDefaultSize;
    commands;
    axis;
    grid;
    canvas;
    ctx;


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.type === "update") {
            this.setUpFigure()
            this.setUpGrid()
            this.setUpAxis()
            this.moveFigure(this.state.xShift, this.state.yShift)
            this.turnFigure()
        } else if (this.state.type === "affine") {
            this.affineFigure()
        } else if (this.state.type === "homography") {
            this.homographyFigure();
        } else if (this.state.type === "turn") {
            this.turnFigure()
        } else {
            this.moveFigure(this.state.x, this.state.y)
        }
        this.draw()
    }

    componentDidMount() {
        this.gridDefaultSize = 25;
        this.commands = [];
        this.axis = [];
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.setUpFigure()
        this.setUpAxis()
        this.setUpGrid()
        this.draw()
    }

    constructor(props) {
        super(props);
        this.state = {
            radius: 50,
            distance: 100,
            grid: 25,
            hight: 50,
            x: 0,
            y: 0,
            type: "",
            yShift: 0,
            xShift: 0,
            angle: 0,
            pivotPointX: null,
            pivotPointY: null,
            affine_xx: 0,
            affine_xy: 0,
            affine_x0: 0,
            affine_yx: 0,
            affine_yy: 0,
            affine_y0: 0,
            homography_xx: 0,
            homography_xy: 0,
            homography_x0: 0,
            homography_yx: 0,
            homography_yy: 0,
            homography_y0: 0,
            homography_wx: 0,
            homography_wy: 0,
            homography_w0: 0
        };
    }

    drawMoved() {
        this.moveFigure()
        this.draw()
    }

    turnFigure() {
        let x0 = this.state.pivotPointX;
        let y0 = this.state.pivotPointY;
        let angle = this.state.angle * Math.PI / 180;
        this.commands.forEach(command => {
            let x = command.x;
            let y = command.y;
            command.x = x0 + (x - x0) * Math.cos(angle) - (y - y0) * Math.sin(angle);
            command.y = y0 + (y - y0) * Math.cos(angle) + (x - x0) * Math.sin(angle);
        })
    }

    moveFigure(x, y) {
        this.commands.forEach(command => {
            command.x += parseInt(x);
            command.y += parseInt(y);
        })
    }

    setUpFigure() {
        this.commands = [];
        const gridSize = this.state.grid;
        const pixelSize = gridSize / this.gridDefaultSize;
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const startX = canvasWidth / 2;
        const startY = canvasHeight / 2;

        this.moveLine(startX, startY, this.commands);

        //params
        let r = this.state.radius * pixelSize;
        let circleDistanceFromCenter = r + this.state.distance * pixelSize;
        let rightIndent = 1.5 * this.state.radius * pixelSize + circleDistanceFromCenter;
        let topIndent = 2 * this.state.radius * pixelSize;
        let bottomIndent = 1.75 * this.state.radius * pixelSize;

        // правый круг и нижняя линия
        let prevX = startX + circleDistanceFromCenter;
        let prevY = startY;
        this.moveLine(prevX, prevY, this.commands);

        this.moveLine(prevX + r * Math.cos(1.17 * Math.PI), prevY + r * Math.sin(1.17 * Math.PI), this.commands)
        let circleCenterX = prevX;
        let circleCenterY = prevY;
        for (let i = 1.17 * Math.PI; i < 2.83 * Math.PI; i += 1 / r) {
            prevX = circleCenterX + r * Math.cos(i)
            prevY = circleCenterY + r * Math.sin(i)
            this.drawLine(circleCenterX + r * Math.cos(i), circleCenterY + r * Math.sin(i), this.commands)
        }
        let length = 2 * (circleDistanceFromCenter - (circleCenterX - prevX));
        prevX = prevX - length
        this.drawLine(prevX, prevY, this.commands);

        //левый круг и верхняя линия
        prevX = startX - circleDistanceFromCenter;
        prevY = startY;
        this.moveLine(prevX, prevY, this.commands);

        this.moveLine(prevX + r * Math.cos(2.17 * Math.PI), prevY + r * Math.sin(2.17 * Math.PI), this.commands)
        circleCenterX = prevX;
        circleCenterY = prevY;
        for (let i = 2.17 * Math.PI; i < 3.83 * Math.PI; i += 1 / r) {
            prevX = circleCenterX + r * Math.cos(i)
            prevY = circleCenterY + r * Math.sin(i)
            this.drawLine(circleCenterX + r * Math.cos(i), circleCenterY + r * Math.sin(i), this.commands)
        }
        length = 2 * (circleDistanceFromCenter - (prevX - circleCenterX));
        prevX = prevX + length;
        this.drawLine(prevX, prevY, this.commands);

        let hight = r * 0.02 * this.state.hight * pixelSize;

        this.moveLine(startX + rightIndent, startY - topIndent, this.commands);
        this.drawLine(startX + rightIndent, startY + bottomIndent - hight, this.commands);
        this.drawLine(startX + (this.state.radius * pixelSize + circleDistanceFromCenter), startY + bottomIndent, this.commands);

        this.drawLine(startX - (this.state.radius * pixelSize + circleDistanceFromCenter), startY + bottomIndent, this.commands);
        this.drawLine(startX - rightIndent, startY + bottomIndent - hight, this.commands);

        this.drawLine(startX - rightIndent, startY - topIndent, this.commands);

        this.drawLine(startX - (this.state.radius * pixelSize + circleDistanceFromCenter), startY - topIndent - hight, this.commands);

        this.drawLine(startX - rightIndent + 1.5 * this.state.radius * pixelSize, startY - topIndent - hight, this.commands);
        this.drawLine(startX - rightIndent + 1.5 * this.state.radius * pixelSize, startY - topIndent, this.commands);
        this.drawLine(startX - rightIndent + 1.5 * this.state.radius * pixelSize + 2 * circleDistanceFromCenter, startY - topIndent, this.commands);
        this.drawLine(startX - rightIndent + 1.5 * this.state.radius * pixelSize + 2 * circleDistanceFromCenter, startY - topIndent - hight, this.commands);
        this.drawLine(startX + (this.state.radius * pixelSize + circleDistanceFromCenter), startY - topIndent - hight, this.commands);
        this.drawLine(startX - rightIndent + 1.5 * this.state.radius * pixelSize + 2 * circleDistanceFromCenter + 1.5 * this.state.radius * pixelSize, startY - topIndent, this.commands);
    }

    drawGrid() {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#e9e9e9";
        this.grid.forEach(command => {
            let point = {x: command.x, y: command.y}
            if (command.type === "line") {
                ctx.lineTo(point.x, point.y);
            } else {
                ctx.moveTo(point.x, point.y);
            }
        })
        ctx.stroke();
        ctx.closePath();
    }

    setUpGrid() {
        this.grid = [];
        const gridSize = this.state.grid;
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const numLinesX = Math.floor(canvasHeight / gridSize);
        const numLinesY = Math.floor(canvasWidth / gridSize);

        let i;
        for (i = 0; i <= numLinesX; i++) {
            this.moveLine(0, gridSize * i + 0.5, this.grid);
            this.drawLine(canvasWidth, gridSize * i + 0.5, this.grid);
        }

        for (i = 0; i <= numLinesY; i++) {
            this.moveLine(gridSize * i + 0.5, 0, this.grid);
            this.drawLine(gridSize * i + 0.5, canvasHeight, this.grid);
        }
    }

    setUpAxis() {
        this.axis = []
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const gridSize = parseInt(this.state.grid);
        // y
        this.moveLine(0, 0, this.axis);
        this.drawLine(0, canvasHeight, this.axis);
        // x
        this.moveLine(0, 0, this.axis);
        this.drawLine(canvasWidth, 0, this.axis);
        // y arrow
        this.moveLine(0, canvasHeight, this.axis);
        let arrowTop = canvasHeight - 20.5;
        this.drawLine(0, arrowTop, this.axis);
        this.moveLine(0, canvasHeight, this.axis);
        this.drawLine(10.5, arrowTop, this.axis)
        this.fillText('Y', 21, arrowTop, this.axis);
        // x arrow
        this.moveLine(canvasWidth, 0, this.axis);
        this.drawLine(arrowTop, 0, this.axis);
        this.moveLine(canvasWidth, 0, this.axis);
        this.drawLine(arrowTop, 10.5, this.axis);
        this.fillText('X', arrowTop, 21, this.axis);
        // x grid size
        this.moveLine(gridSize, 0, this.axis);
        this.drawLine(gridSize, 10.5, this.axis);
        this.fillText(gridSize + '', gridSize + 10.5, 21, this.axis);
        // y grid size
        this.moveLine(0, gridSize, this.axis);
        this.drawLine(10.5, gridSize, this.axis);
        this.fillText(gridSize + '', 21, gridSize + 10.5, this.axis);
    }

    drawCoordinate() {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "16px Verdana"
        let tab = 1.5
        this.axis.forEach(command => {
            let point = {x: command.x, y: command.y}
            if (command.type === "line") {
                ctx.lineTo(point.x+tab, point.y+tab);
            } else if (command.type === "text") {
                ctx.fillText(command.text, point.x+tab, point.y+tab);
            } else {
                ctx.moveTo(point.x+tab, point.y+tab);
            }
        })
        ctx.stroke();
        ctx.closePath();
    }

    drawFigure() {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = "#dd1212";
        ctx.lineWidth = 1;
        this.commands.forEach(command => {
            let point = {x: command.x, y: command.y}
            if (command.type === "line") {
                ctx.lineTo(point.x, point.y);
            } else {
                ctx.moveTo(point.x, point.y);
            }
        })
        ctx.stroke();
        ctx.closePath();
    }

    multiplyVectorAndMatrix = (vector, matrix) => [
        vector[0] * matrix[0][0] + vector[1] * matrix[1][0] + vector[2] * matrix[2][0],
        vector[0] * matrix[0][1] + vector[1] * matrix[1][1] + vector[2] * matrix[2][1],
        vector[0] * matrix[0][2] + vector[1] * matrix[1][2] + vector[2] * matrix[2][2]
    ];

    calculateAffineTransformation = (x, y) => {
        let xx = this.state.affine_xx
        let xy = this.state.affine_xy
        let x0 = this.state.affine_x0
        let yx = this.state.affine_yx
        let yy = this.state.affine_yy
        let y0 = this.state.affine_y0
        let stepGrid = this.state.grid

        const wa = [
            [xx / stepGrid, yx / stepGrid, 0],
            [xy / stepGrid, yy / stepGrid, 0],
            [x0 / stepGrid, y0 / stepGrid, 1]
        ];

        const resultVector = this.multiplyVectorAndMatrix([x, y, 1], wa);
        return {x: resultVector[0] / resultVector[2], y: resultVector[1] / resultVector[2]};
    };

    calculateHomography(x, y, w0, wx, wy) {
        let xx = parseInt(this.state.homography_xx)
        let xy = parseInt(this.state.homography_xy)
        let x0 = parseInt(this.state.homography_x0)
        let yx = parseInt(this.state.homography_yx)
        let yy = parseInt(this.state.homography_yy)
        let y0 = parseInt(this.state.homography_y0)

        // let xx = 2000, xy = 0, x0 = 0
        // let yx = 0, yy = 1700, y0 = 0
        // let w0 = 1000, wx = 1, wy = 1
        let axis = false
        w0 = axis ? 2000 : w0;
        // const wa = [
        //     [xx * wx, yx * wx, wx],
        //     [xy * wy, yy * wy, wy],
        //     [x0 * w0, y0 * w0, w0]
        // ];
        const xResult = (x0 * w0 + xx * wx * x + xy * wy * y) / (w0 + wx * x + wy * y);
        const yResult = (y0 * w0 + x * yx * wx + y * yy * wy) / (w0 + x * wx + y * wy);
        //const resultVector = this.multiplyVectorAndMatrix([x, y, 1], wa);
        return {x: xResult, y: yResult};
    };

    affineFigure() {
        this.commands.forEach(command => {
            let newPoint = this.calculateAffineTransformation(command.x, command.y);
            command.x = newPoint.x;
            command.y = newPoint.y;
        })
        this.axis.forEach(command => {
            let newPoint = this.calculateAffineTransformation(command.x, command.y);
            command.x = newPoint.x;
            command.y = newPoint.y;
        })
        this.grid.forEach(command => {
            let newPoint = this.calculateAffineTransformation(command.x, command.y);
            command.x = newPoint.x;
            command.y = newPoint.y;
        })
    }

    homographyFigure() {
        let wx = parseInt(this.state.homography_wx)
        let wy = parseInt(this.state.homography_wy)
        let w0 = parseInt(this.state.homography_w0)
        this.commands.forEach(command => {
            let newPoint = this.calculateHomography(command.x, command.y, w0, wx, wy);
            command.x = newPoint.x;
            command.y = newPoint.y;
        })
        this.axis.forEach(command => {
            let newPoint = this.calculateHomography(command.x, command.y, w0, wx, wy);
            command.x = newPoint.x;
            command.y = newPoint.y;
        })
        this.grid.forEach(command => {
            let newPoint = this.calculateHomography(command.x, command.y, w0, wx, wy);
            command.x = newPoint.x;
            command.y = newPoint.y;
        })
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCoordinate()
        this.drawGrid()
        this.drawFigure()
    }

    drawLine(x, y, collection) {
        collection.push({
            type: "line",
            x: x,
            y: y
        });
    }

    moveLine(x, y, collection) {
        collection.push({
            type: "move",
            x: x,
            y: y
        });
    }

    fillText(text, x, y, collection) {
        console.log(text)
        collection.push({
            text: text,
            type: "text",
            x: x,
            y: y
        });
    }

    handle = (e) => {
        const {name, value} = e.currentTarget;
        this.setState({
            [name]: value,
            type: "update"
        })
    }

    handleShift = e => {
        e.preventDefault()
        let x = parseInt(e.target["x"].value);
        let y = parseInt(e.target["y"].value);
        let xShift = parseInt(this.state.xShift) + parseInt(x);
        let yShift = parseInt(this.state.yShift) + parseInt(y);
        this.setState({
            x: x,
            y: y,
            xShift: xShift,
            yShift: yShift,
            type: "change"
        })
    }

    handleAngle = (e) => {
        e.preventDefault()
        let angle = parseInt(e.target["angle"].value);
        let pivotPointX = parseInt(e.target["pivotPointX"].value);
        let pivotPointY = parseInt(e.target["pivotPointY"].value);
        if (!isNaN(angle) && !isNaN(pivotPointX) && !isNaN(pivotPointY)) {
            this.setState({
                angle: angle,
                pivotPointX: pivotPointX,
                pivotPointY: pivotPointY,
                type: "turn"
            })
        }
    }

    handleAffine = (e) => {
        e.preventDefault()
        let affine_xx = parseInt(e.target["affine_xx"].value);
        let affine_xy = parseInt(e.target["affine_xy"].value);
        let affine_x0 = parseInt(e.target["affine_x0"].value);
        let affine_yx = parseInt(e.target["affine_yx"].value);
        let affine_yy = parseInt(e.target["affine_yy"].value);
        let affine_y0 = parseInt(e.target["affine_y0"].value);

        this.setState({
            affine_xx: affine_xx,
            affine_xy: affine_xy,
            affine_x0: affine_x0,
            affine_yx: affine_yx,
            affine_yy: affine_yy,
            affine_y0: affine_y0,
            type: "affine"
        })
    }

    hundle = (e) => {
        const {name, value} = e.currentTarget;
        this.setState({
            [name]: value,
            type: "update"
        })
    }

    handleHomography = (e) => {
        e.preventDefault()
        let homography_xx = parseInt(e.target["homography_xx"].value);
        let homography_xy = parseInt(e.target["homography_xy"].value);
        let homography_x0 = parseInt(e.target["homography_x0"].value);
        let homography_yx = parseInt(e.target["homography_yx"].value);
        let homography_yy = parseInt(e.target["homography_yy"].value);
        let homography_y0 = parseInt(e.target["homography_y0"].value);
        let homography_wx = parseInt(e.target["homography_wx"].value);
        let homography_wy = parseInt(e.target["homography_wy"].value);
        let homography_w0 = parseInt(e.target["homography_w0"].value);

        this.setState({
            homography_xx: homography_xx,
            homography_xy: homography_xy,
            homography_x0: homography_x0,
            homography_yx: homography_yx,
            homography_yy: homography_yy,
            homography_y0: homography_y0,
            homography_wx: homography_wx,
            homography_wy: homography_wy,
            homography_w0: homography_w0,
            type: "homography"
        })
    }

    render() {
        return (
            <div className={"mt-5"}>
                <Row>
                    <Col>
                        <div>

                            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                                <Tab eventKey="home" title="Лінійні">
                                    <Card>
                                        <Card.Body>
                                            <Form.Group>
                                                <Form.Label>Радіус (R)</Form.Label>
                                                <Form.Control name="radius"
                                                              type="number"
                                                              value={this.state.radius}
                                                              onChange={this.handle}/>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Відстань від центру до кола (D)</Form.Label>
                                                <Form.Control name="distance"
                                                              type="number"
                                                              value={this.state.distance}
                                                              onChange={this.handle}/>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Розмір клітини</Form.Label>
                                                <Form.Control name="grid"
                                                              type="number"
                                                              value={this.state.grid}
                                                              min={1}
                                                              onChange={this.handle}/>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Виступ (H)</Form.Label>
                                                <Form.Control name="hight"
                                                              value={this.state.hight}
                                                              max={this.state.radius}
                                                              type="number"
                                                              onChange={this.handle}/>
                                            </Form.Group>

                                            <hr/>
                                            <Form onSubmit={this.handleShift}>
                                                <Form.Label>Зсув по Х</Form.Label>
                                                <Form.Control name="x"
                                                              type="number"
                                                              value={this.state.x}
                                                              onChange={this.handle}/>

                                                <Form.Label>Зсув по Y</Form.Label>
                                                <Form.Control name="y"
                                                              type="number"
                                                              value={this.state.y}
                                                              onChange={this.handle}/>
                                                <br/>
                                                <Button type="submit">Пересунути</Button>
                                            </Form>
                                            <br/>

                                            <Form onSubmit={this.handleAngle}>
                                                <Form.Group>
                                                    <Form.Label>Кут повороту</Form.Label>
                                                    <Form.Control name="angle"
                                                                  type="number"/>
                                                </Form.Group>
                                                <Row>
                                                    <Col>
                                                        <Form.Group>
                                                            <Form.Label>Точка повороту Х</Form.Label>
                                                            <Form.Control name="pivotPointX"
                                                                          type="number"/>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group>
                                                            <Form.Label>Точка повороту Y</Form.Label>
                                                            <Form.Control name="pivotPointY"
                                                                          type="number"/>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Button type="submit">Повернути</Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Tab>
                                <Tab eventKey="profile" title="Афінні">
                                    <Card>
                                        <Card.Body>
                                            <Form onSubmit={this.handleAffine}>
                                                <Form.Group>
                                                    <Row>
                                                        <Col>
                                                            <Form.Label>xx</Form.Label>
                                                            <Form.Control name="affine_xx"
                                                                          type="number"/>
                                                        </Col>
                                                        <Col>
                                                            <Form.Label>yx</Form.Label>
                                                            <Form.Control name="affine_yx"
                                                                          type="number"/>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Form.Label>xy</Form.Label>
                                                            <Form.Control name="affine_xy"
                                                                          type="number"/>
                                                        </Col>
                                                        <Col>
                                                            <Form.Label>yy</Form.Label>
                                                            <Form.Control name="affine_yy"
                                                                          type="number"/>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Form.Label>x0</Form.Label>
                                                            <Form.Control name="affine_x0"
                                                                          type="number"/>

                                                        </Col>
                                                        <Col>
                                                            <Form.Label>y0</Form.Label>
                                                            <Form.Control name="affine_y0"
                                                                          type="number"/>
                                                        </Col>
                                                    </Row>
                                                </Form.Group>
                                                <Button type="submit">Перетворити</Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Tab>
                                <Tab eventKey="homography" title="Проективні">
                                    <Card>
                                        <Card.Body>
                                            <Form onSubmit={this.handleHomography}>
                                                <Form.Group>
                                                    <Row>
                                                        <Col>
                                                            <Form.Label>xx</Form.Label>
                                                            <Form.Control name="homography_xx"
                                                                          type="number"/>
                                                        </Col>
                                                        <Col>
                                                            <Form.Label>yx</Form.Label>
                                                            <Form.Control name="homography_yx"
                                                                          type="number"/>
                                                        </Col>
                                                        <Col>
                                                            <Form.Label>wx</Form.Label>
                                                            <Form.Control name="homography_wx"
                                                                          type="number"/>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Form.Label>xy</Form.Label>
                                                            <Form.Control name="homography_xy"
                                                                          type="number"/>
                                                        </Col>
                                                        <Col>
                                                            <Form.Label>yy</Form.Label>
                                                            <Form.Control name="homography_yy"
                                                                          type="number"/>
                                                        </Col>
                                                        <Col>
                                                            <Form.Label>wy</Form.Label>
                                                            <Form.Control name="homography_wy"
                                                                          type="number"/>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Form.Label>x0</Form.Label>
                                                            <Form.Control name="homography_x0"
                                                                          type="number"/>

                                                        </Col>
                                                        <Col>
                                                            <Form.Label>y0</Form.Label>
                                                            <Form.Control name="homography_y0"
                                                                          type="number"/>
                                                        </Col>
                                                        <Col>
                                                            <Form.Label>w0</Form.Label>
                                                            <Form.Control name="homography_w0"
                                                                          type="number"/>
                                                        </Col>
                                                    </Row>

                                                </Form.Group>

                                                <Button type="submit">Перетворити</Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Tab>
                            </Tabs>
                        </div>
                    </Col>

                    <Col>
                        <Canvas/>
                    </Col>

                    <Col>
                        <img src={image}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default App;
