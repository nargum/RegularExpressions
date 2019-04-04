var canvas = document.getElementById('canvas');
var title = document.getElementById('title');
canvas.width = 800;
canvas.height = 600;

var c = canvas.getContext("2d");
var counter = 1;

var states = [];
var transitions = [];
var graphs = [];
var previousPart = null;
var activeTransition = null;
var buttonType = 1;
var mouseDown = false;

var circleRadius = 30;
var x = 100;
var y = 100;

class State{
    constructor(x, y, text, type){
        this.x = x;
        this.y = y;
        this.text = text;
        this.type = type;
        this.movable = false;
    }

    getText() {
        return this.text;
    }

    draw(){
        if (this.type == "begin") {
            drawBeginState(this.x, this.y, this);
        } else {
            drawNormalState(this.x, this.y);
        }
    }

    intersect(x, y){
        if (x >= this.x - 30 && x <= this.x + 30 && y >= this.y - 30 && y <= this.y + 30) {
            console.log("clicked state " + this.text);
            if (buttonType == 2) {
                this.movable = true;
            }
            return true;
        }
        return false;
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Transition {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.active = false;
        this.beginState;
        this.endState;
        this.text = "";
        this.transitionNames = [];
    }

    draw() {
        this.createText();
        if (this.beginState == this.endState) {
            drawShape(this.beginState.x, this.beginState.y, this.text);
        } else {
            drawTransition(this.startX, this.startY, this.endX, this.endY, this.text);
        }
    }

    createText() {
        this.text = "";
        for (var i = 0; i < this.transitionNames.length; i++) {
            if (i == this.transitionNames.length - 1) {
                this.text += this.transitionNames[i];
            } else {
                this.text += this.transitionNames[i] + ", ";
            }
        }
    }
}

function drawPart() {
    
    if (previousPart == null) {
        previousPart = [];

        let e = graphs.shift();
        e.draw('#ff0000')
        previousPart.push(e);
        title.innerHTML = e.getString();
    } else {
        let e = graphs.shift();
        if (e.text == "+" || e.text == ".") {
            for (let i = 0; i < previousPart.length; i++) {
                if (previousPart[i] == e.partA || previousPart[i] == e.partB) {
                    previousPart.splice(i, 1);
                    i--;
                }
            }
        }

        if (e.text == "*") {
            for (let i = 0; i < previousPart.length; i++) {
                if (previousPart[i] == e.part) {
                    previousPart.splice(i, 1);
                    i--;
                }
            }
        }

        for (let i = 0; i < previousPart.length; i++) {
            previousPart[i].draw('#000000');
        }

        e.draw('#ff0000');
        previousPart.push(e);
        title.innerHTML = e.getString();
    }
    
}

function test() {
    /*var a = new PlusGraph(new Element(100, 100, "a"), new Element(100, 100, "b"), 100, 150);
    var b = new PlusGraph(new Element(100, 100, "c"), a, 100, 250);
    b.draw();*/
    var expression = new Expression("a+b");
    var root = expression.parse();
    root.buildGraph();
    //root.drawGraph();
    console.log(root.buildShortExpression());
    console.log(root.buildFullExpression());
    
}

function getFirst() {
    var expression = new Expression("abc");
    var root = expression.parse();
    var first = [];
    first = root.getLast();

    for (let i = 0; i < first.length; i++) {
        console.log(first[i]);
    }
}

window.addEventListener('mousedown', function (event) {
    //console.log("funguje");
    switch (buttonType) {
        case 1:
            var coordinates, x, y;
            coordinates = getCursorPosition(event.x, event.y, canvas);
            x = coordinates[0];
            y = coordinates[1];
            if (x <= canvas.width && y <= canvas.height) {
                var state = new State(x, y, counter, "begin");
                counter++;
                states.push(state);
                state.draw();
            }
            break;
        case 2:
            mouseDown = true;
            coordinates = getCursorPosition(event.x, event.y, canvas);
            x = coordinates[0];
            y = coordinates[1];
            for (var i = 0; i < states.length; i++) {
                states[i].intersect(x, y);
            }
            break;
        case 3:
            mouseDown = true;
            coordinates = getCursorPosition(event.x, event.y, canvas);
            x = coordinates[0];
            y = coordinates[1];
            if (x <= canvas.width && y <= canvas.height) {
                for (var i = 0; i < states.length; i++) {
                    if (states[i].intersect(x, y)) {
                        var transition = new Transition(x, y, x, y);
                        transition.transitionNames.push("a");
                        transition.active = true;
                        transition.beginState = states[i];
                        activeTransition = transition;
                        break;
                    }
                }
            }
            break;
        case 4:
            coordinates = getCursorPosition(event.x, event.y, canvas);
            x = coordinates[0];
            y = coordinates[1];
            for (var i = 0; i < states.length; i++) {
                if (states[i].intersect(x, y)) {
                    var transition = new Transition(x, y, x, y);
                    transition.beginState = states[i];
                    transition.endState = states[i];
                    transition.transitionNames.push("a");
                    var join = false;
                    for (var j = 0; j < transitions.length; j++) {
                        if (transitions[j].beginState == transition.beginState && transitions[j].endState == transition.endState) {
                            transitions[j].transitionNames = transitions[j].transitionNames.concat(transition.transitionNames);
                            join = true;
                            break;
                        }
                    }

                    if (!join) {
                        transitions.push(transition);
                    }
                    
                    break;
                }
            }
            //drawShape(x, y);
            break;
    }
    
})

window.addEventListener('mousemove', function (event) {
    if (mouseDown) {

        switch (buttonType) {
            case 2:
                console.log("moving");
                for (var i = 0; i < states.length; i++) {
                    if (states[i].movable) {
                        var coordinates, x, y;
                        coordinates = getCursorPosition(event.x, event.y, canvas);
                        x = coordinates[0];
                        y = coordinates[1];
                        states[i].setCoordinates(x, y);
                        for (var j = 0; j < transitions.length; j++) {
                            if (states[i] == transitions[j].beginState) {
                                transitions[j].startX = x;
                                transitions[j].startY = y;
                            }
                            if (states[i] == transitions[j].endState) {
                                transitions[j].endX = x;
                                transitions[j].endY = y;
                            }
                        }
                        break;
                    }
                }

                c.clearRect(0, 0, canvas.width, canvas.height);
                for (var i = 0; i < states.length; i++) {
                    states[i].draw();
                }
                for (var i = 0; i < transitions.length; i++) {
                    transitions[i].draw();
                }
                break;
            case 3:
                if (activeTransition != null) {
                    var coordinates, x, y;
                    coordinates = getCursorPosition(event.x, event.y, canvas);
                    x = coordinates[0];
                    y = coordinates[1];
                    activeTransition.endX = x;
                    activeTransition.endY = y;

                    c.clearRect(0, 0, canvas.width, canvas.height);
                    for (var i = 0; i < states.length; i++) {
                        states[i].draw();
                    }
                    for (var i = 0; i < transitions.length; i++) {
                        transitions[i].draw();
                    }
                    activeTransition.draw();
                }
                
                break;
        }

    }

})

window.addEventListener('mouseup', function (event) {

    switch (buttonType) {
        case 2:
            for (var i = 0; i < states.length; i++) {
                states[i].movable = false;
            }
            break;
        case 3:
            var coordinates, x, y;
            coordinates = getCursorPosition(event.x, event.y, canvas);
            x = coordinates[0];
            y = coordinates[1];
            intersects = false;
            for (var j = 0; j < states.length; j++) {
                if (states[j].intersect(x, y)) {
                    intersects = true;
                    activeTransition.endState = states[j];
                    var join = false;
                    for (var i = 0; i < transitions.length; i++) {
                        if (transitions[i].beginState == activeTransition.beginState && transitions[i].endState == activeTransition.endState) {
                            join = true;
                            transitions[i].transitionNames = transitions[i].transitionNames.concat(activeTransition.transitionNames);
                            break;
                        }
                    }

                    if (!join) {
                        transitions.push(activeTransition);
                    }
                    break;
                }
            }

    }
    for (var i = 0; i < transitions.length; i++) {
        transitions[i].active = false;
    }

    c.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < states.length; i++) {
        states[i].draw();
    }
    for (var i = 0; i < transitions.length; i++) {
        transitions[i].draw();
    }

    activeTransition = null;
    mouseDown = false;
        
})


function getCursorPosition(x, y, canvas) {
    var newX, newY;
    canoffset = $(canvas).offset();
    newX = x + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
    newY = y + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

    return [newX, newY];
}

function drawCircle(x, y, radius) {
    c.beginPath();
    c.strokeStyle = "black";
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.stroke();
    c.closePath();
}

function drawCircle(x, y, radius, color) {
    c.beginPath();
    c.strokeStyle = color;
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.stroke();
    c.closePath();
}

function drawText(x, y, state) {
    c.font = "30px Verdana";
    if (counter > 10) {
        c.fillText(state.getText(), x - 18, y + 12);
    } else {
        c.fillText(state.getText(), x - 9, y + 12);
    }

    
}

function drawBeginState(x, y, state) {
    drawCircle(x, y, circleRadius);
    drawArrow(x - 55, y, x - 35, y);
    drawCircle(x, y, circleRadius - 5);
    drawText(x, y, state);
}

function drawNormalState(x, y) {
    drawCircle(x, y, circleRadius);
    drawText(x, y, counter);
}

function drawArrow(startX, startY, endX, endY) {
    var headLength = 10;
    var angle = Math.atan2(endY - startY, endX - startX);
    c.beginPath();
    c.moveTo(startX, startY);
    c.lineTo(endX, endY);
    c.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
    c.moveTo(endX, endY);
    c.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
    c.strokeStyle = "red";
    c.stroke();
}

function drawArrow(startX, startY, endX, endY, color) {
    var headLength = 10;
    var angle = Math.atan2(endY - startY, endX - startX);
    c.beginPath();
    c.moveTo(startX, startY);
    c.lineTo(endX, endY);
    c.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
    c.moveTo(endX, endY);
    c.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
    c.strokeStyle = color;
    c.stroke();
}

function drawTransition(startX, startY, endX, endY, text) {
    drawArrow(startX, startY, endX, endY);
    c.font = "15px Verdana";
    c.fillText(text, (startX + endX) / 2, (startY + endY) / 2);
}

function drawTransition(startX, startY, endX, endY, text, color) {
    drawArrow(startX, startY, endX, endY, color);
    c.font = "15px Verdana";
    c.fillStyle = color;
    c.fillText(text, (startX + endX) / 2, (startY + endY) / 2);
    
}

function drawShape(x, y, text) {
    var beginX = (circleRadius / 2) * Math.cos((3 * Math.PI) / 4) + x;
    var beginY = (circleRadius / 2) * Math.sin((3 * Math.PI) / 4) + y;
    var endX = (circleRadius / 2) * Math.cos(Math.PI / 4) + x;
    var endY = (circleRadius / 2) * Math.sin(Math.PI / 4) + y;

    //beginY = beginY - 50;
    //endY = endY - 50;

    c.beginPath();
    c.moveTo(beginX, beginY);
    c.bezierCurveTo(beginX - 35, beginY - 70, endX + 35, endY - 70, endX, endY);
    
    c.stroke();
    c.font = "15px Verdana";
    c.fillText(text, ((beginX + endX) / 2) - 5, endY - 55);
}

function drawShapeUp(beginX, beginY, endX, endY, height, text, color) {
    c.beginPath();
    beginY = beginY - circleRadius;
    endY = endY - circleRadius;
    
    c.moveTo(beginX, beginY);

    if (height / 2 < 70) {
        c.bezierCurveTo(beginX + 35, beginY - 70, endX - 35, endY - 70, endX, endY);
        c.strokeStyle = color;
        c.stroke();
        c.font = "15px Verdana";
        c.fillText(text, ((beginX + endX) / 2) - 5, endY - 55);
    } else {
        c.bezierCurveTo(beginX + 35, beginY - height / 2, endX - 35, endY - height / 2, endX, endY);
        c.strokeStyle = color;
        c.stroke();
        c.font = "15px Verdana";
        c.fillText(text, ((beginX + endX) / 2) - 5, endY - (height / 2) - 15);
    }
}

function drawShapeDown(beginX, beginY, endX, endY, height, text, color) {
    c.beginPath();
    beginY = beginY + circleRadius;
    endY = endY + circleRadius;
    c.moveTo(beginX, beginY);

    if (height / 2 < 70) {
        c.bezierCurveTo(beginX + 35, beginY + 70, endX - 35, endY + 70, endX, endY);
        c.strokeStyle = color;
        c.stroke();
        c.closePath();
        c.font = "15px Verdana";
        c.fillText(text, ((beginX + endX) / 2) + 5, endY + 50);
    } else {
        c.bezierCurveTo(beginX + 35, beginY + height / 2, endX - 35, endY + height / 2, endX, endY);
        c.strokeStyle = color;
        c.stroke();
        c.closePath();
        c.font = "15px Verdana";
        c.fillText(text, ((beginX + endX) / 2) + 5, endY + (height / 2) + 15);
    }
}

function clearCanvas() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    counter = 1;
    states = [];
    transitions = [];
    graphs = [];
    previousPart = null;
    activeTransition = null;
}

function drawIdent(x, y, text) {
    drawCircle(x, y, circleRadius);
    drawTransition(x, y, x + 150, y, text);
    drawCircle(x + 150, y, circleRadius);
}

function addNewState() {
    buttonType = 1;
}

function move() {
    buttonType = 2;
}

function arrow() {
    buttonType = 3;
}

function arc() {
    buttonType = 4;
}