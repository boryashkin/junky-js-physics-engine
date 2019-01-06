"use strict";
class Vector {
    constructor(position0, position1) {
        this.position0 = position0;
        this.position1 = position1;
    }
    isXaxelPositive() {
        return this.position0.getCoordinates().x < this.position1.getCoordinates().x;
    }
    isYaxelPositive() {
        return this.position0.getCoordinates().y < this.position1.getCoordinates().y;
    }
    isStallX() {
        return this.position0.getCoordinates().x === this.position1.getCoordinates().x;
    }
    isStallY() {
        return this.position0.getCoordinates().y === this.position1.getCoordinates().y;
    }
}
class Position {
    constructor(coordinates) {
        this.coordinates = coordinates;
        this.prevCoordinates = null;
    }
    getCoordinates() {
        return this.coordinates;
    }
    setCoordinates(coordinates) {
        this.prevCoordinates = this.coordinates;
        this.coordinates = coordinates;
    }
    getPreviousCoordinates() {
        return this.prevCoordinates;
    }
    isOutOfBoundaries(boundaries) {
        return JSON.stringify(this.getOutOfBoundariesShift(boundaries)) !== "{}";
    }
    getOutOfBoundariesShift(boundaries) {
        let currentPos = this.getCoordinates();
        let outOfBoundShift = {};
        for (let axel in currentPos) {
            //console.log(axel);
            if (boundaries.hasOwnProperty(axel) && boundaries[axel] < currentPos[axel]) {
                outOfBoundShift[axel] = currentPos[axel] - boundaries[axel];
            } else if (currentPos[axel] < 0) {
                outOfBoundShift[axel] = currentPos[axel];
            }
        }

        return outOfBoundShift;
    }
}
class Shape {
    constructor (properties) {
        this.timestamp = new Date();
        let shape = document.createElement('div');
        this.setHtmlElement(shape);
        this.addProperties(properties);
        let currentPos = new Position({x: shape.offsetLeft, y: shape.offsetTop});
        this.setPosition(currentPos);
        let prevPos = new Position({x: shape.offsetLeft, y: shape.offsetTop});
        this.setPreviousPosition(prevPos);
        this.setVector(new Vector(prevPos, currentPos));
    }

    /**
     * Реализовать самому
     */
    addProperties() {
        //console.log('parend.addProperties() called. Need to redefine this functuon.');
    }
    setHtmlElement(element) {
        this.htmlElement = element;
    }
    getHtmlElement(element) {
        return this.htmlElement;
    }
    setPosition(position) {
        let element = this.getHtmlElement();
        let coords = position.getCoordinates();
        if (position.getPreviousCoordinates()) {
            this.getPreviousPosition().setCoordinates(position.getPreviousCoordinates());
        }
        element.style.left = coords.x + 'px';
        element.style.top = coords.y + 'px';
        this.setHtmlElement(element);
        this.position = position;
    }
    getPosition() {
        return this.position;
    }
    setPreviousPosition(position) {
        this.previousPosition = position;
    }
    getPreviousPosition() {
        return this.previousPosition;
    }
    getVector() {
        return this.vector;
    }
    setVector(vector) {
        this.vector = vector;
    }
}
class Square extends Shape {
    constructor(color) {
        super({'color': color});
    }
    addProperties(properties) {
        let element = this.getHtmlElement();
        element.style.background = properties.color;
        element.classList.add('square');
        this.setHtmlElement(element);
    }

}
class Game {
    constructor(options) {
        this.boundaries = options.boundaries;
        this.objects = [];
        this.tickInterval = setInterval(this.gameTick.bind(this), 100);
        //console.log('game started');
    }
    stop() {
        clearInterval(this.tickInterval);
        //console.log('game stopped')
    }
    addObject(object) {
        this.objects.push(object);
    }
    gameTick() {
        //console.log(this);
        for (let i in this.objects) {
            //console.log(i)
        }
        this.objects.forEach(this.movePosition.bind(this));
        //console.log('tick');
    }
    movePosition(object) {
        //console.log('tick.move');
        let currentPosition = object.getPosition();
        let vector = object.getVector();
        let x = currentPosition.getCoordinates().x;
        let y = currentPosition.getCoordinates().y;

        //console.log(currentPosition.getCoordinates(),object.getPreviousPosition().getCoordinates());
        //console.log(vector.isXaxelPositive(), vector.isYaxelPositive());
        let turnVector = false;
        if (currentPosition.isOutOfBoundaries({x: this.boundaries.x, y: this.boundaries.y})) {
            turnVector = true;
            console.error(currentPosition.getOutOfBoundariesShift(this.boundaries));
        }
        let xDirection = true;
        let yDirection = true;
        if (vector.isXaxelPositive() || vector.isStallX()) {

        } else {
            xDirection = false;
        }
        if (vector.isYaxelPositive() || vector.isStallY()) {

        } else {
            yDirection = false;
        }

        if (xDirection) {
            x += 10;
        } else {
            x -= 10;
        }
        if (yDirection) {
            y += 10;
        } else {
            y -= 10;
        }

        if (turnVector) {
            if (x >= 0) {
                x -= 20;
            } else {
                x += 20;
            }
            if (y >= 0) {
                y -= 20;
            } else {
                y += 20;
            }
        }

        let pos = object.getPosition();
        pos.setCoordinates({x: x, y: y});
        object.setPosition(pos);
        //console.log(vector);
        //console.log(vector.isXaxelPositive(), vector.isYaxelPositive());
    }
}
(function () {
    let world = document.getElementById('world');
    window.addEventListener('keydown', function (e) {
        if (e.code === 'Escape') {
            game.stop();
        }
        console.log('keypressed: ' + e.code);
    });
    const worldHeight = world.offsetHeight;
    const worldWidth = world.offsetWidth;
    let square = new Square('green');
    world.append(square.getHtmlElement());
    let game = new Game({boundaries: {x: worldWidth, y: worldHeight}});
    game.addObject(square);
    setTimeout(function () {
        let square2 = new Square('red');
        world.append(square2.getHtmlElement());
        game.addObject(square2);
    }, 1000);
    setTimeout(function () {
        let square2 = new Square('blue');
        world.append(square2.getHtmlElement());
        game.addObject(square2);
    }, 2000);
})(window);