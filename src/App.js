import React from 'react';
import './App.css';
import Canvas from "./Canvas";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

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
            grid: 50,
            hight: 50
        };
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
        let circleDistanceFromCenter = r + this.state.distance * pixelSize;
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

        let hight = r * 0.02 * this.state.hight * pixelSize;

        ctx.moveTo(startX + rightIndent, startY - topIndent);
        ctx.lineTo(startX + rightIndent, startY + bottomIndent - hight);
        ctx.lineTo(startX + (this.state.radius * pixelSize + circleDistanceFromCenter), startY + bottomIndent);

        ctx.lineTo(startX - (this.state.radius * pixelSize + circleDistanceFromCenter), startY + bottomIndent);
        ctx.lineTo(startX - rightIndent, startY + bottomIndent - hight);

        ctx.lineTo(startX - rightIndent, startY - topIndent);

        ctx.lineTo(startX - (this.state.radius * pixelSize + circleDistanceFromCenter), startY - topIndent - hight);

        ctx.lineTo(startX - rightIndent + 1.5 * this.state.radius * pixelSize, startY - topIndent - hight);
        ctx.lineTo(startX - rightIndent + 1.5 * this.state.radius * pixelSize, startY - topIndent);
        ctx.lineTo(startX - rightIndent + 1.5 * this.state.radius * pixelSize + 2 * circleDistanceFromCenter, startY - topIndent);
        ctx.lineTo(startX - rightIndent + 1.5 * this.state.radius * pixelSize + 2 * circleDistanceFromCenter, startY - topIndent - hight);
        ctx.lineTo(startX + (this.state.radius * pixelSize + circleDistanceFromCenter), startY - topIndent - hight);
        ctx.lineTo(startX - rightIndent + 1.5 * this.state.radius * pixelSize + 2 * circleDistanceFromCenter + 1.5 * this.state.radius * pixelSize, startY - topIndent);


        ctx.stroke();
        ctx.closePath();
    }

    handle = (e) => {
        const {name, value} = e.currentTarget;
        this.setState((p) => ({...p, [name]: value}))
    }

    render() {
        return (
            <Container className={"mt-5"}>
                <Row>
                    <Col>
                        <div>
                            <Card>
                                <Card.Body>
                                    <Form>
                                    <Form.Group>
                                        <Form.Label>Radius</Form.Label>
                                        <Form.Control name="radius"
                                                      type="range"
                                                      onChange={this.handle}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Distance</Form.Label>
                                        <Form.Control name="distance"
                                                      type="range"
                                                      onChange={this.handle}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Grid</Form.Label>
                                        <Form.Control name="grid"
                                                      type="range"
                                                      min={1}
                                                      max={200}
                                                      onChange={this.handle}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Height</Form.Label>
                                        <Form.Control name="hight"
                                                      type="range"
                                                      onChange={this.handle}/>
                                    </Form.Group>
                                </Form>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                    <Col>
                        <Canvas/>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default App;
