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
        this.setVector(new Vector(this.getPreviousPosition(), this.getPosition()));
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
        //console.log('game started');
    }
    start() {
        this.tickInterval = setInterval(this.gameTick.bind(this), 100);
    }
    stop() {
        clearInterval(this.tickInterval);
        this.tickInterval = null;
        //console.log('game stopped')
    }
    isRunning() {
        return this.tickInterval !== null;
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
        console.log('---- tick.move ----');
        let currentPosition = object.getPosition();
        let vector = object.getVector();
        let x = currentPosition.getCoordinates().x;
        let y = currentPosition.getCoordinates().y;
        let adjustX = 10;
        let adjustY = 10;

        console.log('vector: xpos and ypos', vector.isXaxelPositive(), vector.isYaxelPositive());
        let isOutOfBound = currentPosition.isOutOfBoundaries(this.boundaries);
        let outOfBoundShift = null;
        console.log(currentPosition.getCoordinates());
        if (isOutOfBound) {
            outOfBoundShift = currentPosition.getOutOfBoundariesShift(this.boundaries);
            console.error(outOfBoundShift);
        }
        let xDirectionForward = true;
        let yDirectionForward = true;
        if (!(vector.isXaxelPositive() || vector.isStallX())) {
            xDirectionForward = false;
        }
        if (!(vector.isYaxelPositive() || vector.isStallY())) {
            yDirectionForward = false;
        }

        //adjusting "speed" as vector tell us
        if (!xDirectionForward) {
            //console.log('change X dir forw');
            adjustX = -adjustX;
        }
        if (!yDirectionForward) {
            //console.log('change Y dir forw');
            adjustY = -adjustY;
        }

        if (isOutOfBound) {
            //changing vectors directions because of borders
            if (outOfBoundShift.hasOwnProperty('x')) {
                //console.log('change X dir bounce', outOfBoundShift.x);
                //console.log('x bounce change');
                adjustX = -adjustX;
            }
            if (outOfBoundShift.hasOwnProperty('y')) {
                //console.log('change Y dir bounce', outOfBoundShift.y);
                //console.log('y bounce change');
                adjustY = -adjustY;
            }
        }
        x += adjustX;
        y += adjustY;
        console.log('adjust X and Y', adjustX, adjustY);

        let pos = object.getPosition();
        pos.setCoordinates({x: x, y: y});
        object.setPosition(pos);
        console.log('new coords: ', pos.getCoordinates());
        //console.log(vector);
        //console.log(vector.isXaxelPositive(), vector.isYaxelPositive());
    }
}
(function () {
    let world = document.getElementById('world');
    window.addEventListener('keydown', function (e) {
        if (e.code === 'Escape') {
            if (game.isRunning()) {
                game.stop();
            } else {
                game.start();
            }
        }
        console.log('keypressed: ' + e.code);
    });
    const worldHeight = world.offsetHeight;
    const worldWidth = world.offsetWidth;
    let square = new Square('green');
    square.setPosition(new Position({x: 380, y: 250}));
    world.append(square.getHtmlElement());
    let game = new Game({boundaries: {x: worldWidth, y: worldHeight}});
    game.start();
    game.addObject(square);
    for (let i = 1; i < 10; i++) {
        let color = 'red';
        if (i % 2 > 0) {
            color = 'blue';
        } else if (i % 3 > 0) {
            color = 'yellow';
        } else if (i % 5 > 0) {
            color = 'brown';
        }
        let square2 = new Square(color);
        square2.setPosition(new Position({x: Math.round(Math.random() * 300), y: Math.round(Math.random() * 250)}));
        world.append(square2.getHtmlElement());
        game.addObject(square2);
    }
})(window);