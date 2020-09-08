import React from 'react';
import './App.css';
import Canvas from "./Canvas";

class App extends React.Component {

    componentDidMount() {
        this.draw()
    }

    draw() {
        let canvas = document.getElementById('canvas');

        if (canvas.getContext) {
            let x;
            let ctx = canvas.getContext('2d');

            const {width, height} = canvas.getBoundingClientRect();

            ctx.beginPath()
            for (x = 0; x <= width; x += 15) {
                ctx.moveTo(x + 0.5, 0);
                ctx.lineTo(x + 0.5, height);
                console.log(x)
            }

            for (x = 0; x <= height; x += 15) {
                ctx.moveTo(0, 0.5 + x);
                ctx.lineTo(width, 0.5 + x);
            }
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.closePath()

            ctx.beginPath()
            ctx.moveTo(0, 0.5);
            ctx.lineTo(width / 2+ 0.5, height / 2 + 0.5);
            ctx.strokeStyle = "red";
            ctx.stroke();
            ctx.closePath()


        }
    }


    render() {
        return (
            <div className="App">
                <Canvas/>
            </div>
        );
    }
}

export default App;
