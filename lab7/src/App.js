import React from "react";
import './App.css';
import Canvas from "./Canvas";
import {Col, Row, Form} from "react-bootstrap";

class App extends React.Component {
    canvas;
    ctx;
    deg;
    canvasWidth;
    canvasHeight;

    componentDidMount() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvasWidth = this.canvas.width
        this.canvasHeight = this.canvas.height
        this.deg = Math.PI / 180;
        this.draw();
    }


    draw() {
        let count = parseInt(this.state.count)
        let i = 0;
        let interval = setInterval(() =>{
            if (i === count) {
                clearInterval(interval)
            } else {

                for (let i = 0; i < count; i++) {
                    this.drawFlake(
                        i + Math.floor(Math.random() * this.canvasWidth),
                        i + Math.floor(Math.random() * this.canvasHeight),
                        this.state.length,
                        this.state.n,
                        "#" + Math.floor(Math.random() * 16777215).toString(16))
                }
            }
            i++;
        }, 80);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.draw()
    }

    constructor(props) {
        super(props);
        this.state = {
            length: 200,
            count: 10,
            n: 3
        };
    }

    leg(n, len) {
        this.ctx.save();       // Сохраняем текущую трансформацию
        if (n === 0) {      // Нерекурсивный случай - отрисовываем линию
            this.ctx.lineTo(len, 0);
            // this.points.push({x: len, y: 0})
        } else {
            this.ctx.scale(1 / 3, 1 / 3);  // Уменьшаем масштаб в 3 раза
            this.leg(n - 1, len);
            this.ctx.rotate(60 * this.deg);
            this.leg(n - 1, len);
            this.ctx.rotate(-120 * this.deg);
            this.leg(n - 1, len);
            this.ctx.rotate(60 * this.deg);
            this.leg(n - 1, len);
        }
        this.ctx.restore();      // Восстанавливаем трансформацию
        this.ctx.translate(len, 0); // переходим в конец ребра
    }

    drawFlake(x, y, len, n, stroke) {
        this.ctx.save()
        this.ctx.strokeStyle = stroke;
        this.ctx.fillStyle = stroke;
        this.ctx.beginPath();
        this.ctx.translate(x, y);
        this.ctx.moveTo(0, 0);
        this.leg(n, len);
        this.ctx.rotate(-120 * this.deg);
        this.leg(n, len);
        this.ctx.rotate(-120 * this.deg);
        this.leg(n, len);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore()
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
                    <Col>
                        <Canvas/>
                    </Col>
                    <Col sm={2}>
                        <Form.Label>Довжина</Form.Label>
                        <Form.Control type="number"
                                      onChange={this.handle}
                                      name={"length"}
                                      value={this.state.length}
                                      min={100}
                                      max={400}/>
                        <Form.Label>Кількість сніжинок</Form.Label>
                        <Form.Control type="number"
                                      onChange={this.handle}
                                      name={"count"}
                                      value={this.state.count}
                                      min={1}
                                      max={150}/>
                        <Form.Label>Кількість вершин</Form.Label>
                        <Form.Control type="number"
                                      onChange={this.handle}
                                      name={"n"}
                                      value={this.state.n}
                                      min={2}
                                      max={5}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default App;
