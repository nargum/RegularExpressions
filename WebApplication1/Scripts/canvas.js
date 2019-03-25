//console.log('r/place');

//var canvas = document.querySelector("canvas");
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;

var c = canvas.getContext("2d");
var counter = 0;

/*c.fillStyle = "blue";
c.fillRect(100, 100, 100, 100);

//line
c.beginPath();
c.moveTo(50, 300);
c.lineTo(300, 100);
c.strokeStyle = "red";
c.stroke();

//arc, circle
c.beginPath();
c.arc(300, 300, 30, 0, Math.PI, true);
c.stroke();*/

//animate();

var states = [];
var transitions = [];
var activeTransition = null;
var buttonType = 1;
var mouseDown = false;

function State(x, y, counter, type) {
    this.x = x;
    this.y = y;
    this.counter = counter;
    this.type = type;
    this.movable = false;

    this.draw = function () {
        if (type == "begin") {
            drawBeginState(this.x, this.y, this);
        } else {
            drawNormalState(this.x, this.y);
        }
    }

    this.intersect = function (x, y) {
        if (x >= this.x - 30 && x <= this.x + 30 && y >= this.y - 30 && y <= this.y + 30) {
            console.log("clicked state " + this.counter);
            if (buttonType == 2) {
                this.movable = true;
            }
            return true;
        }
        return false;
    }

    this.setCoordinates = function (x, y) {
        this.x = x;
        this.y = y;
    }
    
}

function Transition(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.active = false;
    this.beginState = null;
    this.endState = null;
    this.text = "";
    this.transitionNames = [];

    this.draw = function () {
        this.createText();
        if (this.beginState == this.endState) {
            drawShape(this.beginState.x, this.beginState.y, this.text);
        } else {
            drawTransition(this.startX, this.startY, this.endX, this.endY, this.text);
        }
    }

    this.createText = function () {
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

class TreeNode {
    constructor(data) {
        this.data = data;
        this.priority = this.generatePriority();
    }

    generatePriority() {
        if (this.data == "*") {
            this.priority = 1;
        }

        if (this.data == ".") {
            this.priority = 2;
        }

        if (this.data == "+") {
            this.priority = 3;
        }
    }

    addLeftChild(leftChild) {
        this.leftChild = leftChild;
    }

    addRightChild(rightChild) {
        this.rightChild = rightChild;
    }

    buildFullExpression() {
        var expression = "";
        if (this.leftChild == null && this.rightChild == null) {
            expression += this.data;
            return expression;
        } else {
            expression += "(";
            if (this.leftChild != null) {
                expression += this.leftChild.buildFullExpression();
            }

            expression += this.data;

            if (this.rightChild != null) {
                expression += this.rightChild.buildFullExpression();
            }

            expression += ")";
            return expression;
        }
    }

    buildShortExpression() {
        var expression = "";

        if (this.leftChild == null && this.rightChild == null) {
            expression += this.data;
            return expression;
        } else {
            if (this.leftChild != null) {
                expression = this.comparePriority(this, this.leftChild, expression);
            }

            if (this.data != ".") {
                expression += this.data;
            }

            if (this.rightChild != null) {
                expression = this.comparePriority(this, this.rightChild, expression);
            }

            return expression;
        }
    }

    comparePriority(currentNode, child, expression) {
        if (currentNode.priority < child.priority) {
            expression += "(";
            expression += child.buildShortExpression();
            expression += ")";
        } else {
            expression += child.buildShortExpression();
        }
        return expression;
    }
}

class Token {
    constructor(name) {
        this.name = name;
    }

    getData() {
        return this.name;
    }

    getName() {
        switch (this.name) {
            case ".":
                return "TDot_";
            case "+":
                return "TPlus_";
            case "*":
                return "TStar_";
            case "(":
                return "TLParen_";
            case ")":
                return "TRParen_";
            case "#":
                return "TEmptySet_";
            case "?":
                return "TEof_";
            case "ε":
                return "TEps_";
            default:
                return "TIdent_";
        }
    }
}

class Expression {
    constructor(data) {
        this.data = data + "?";
        this.currentCharacter;
        this.currentToken;
        this.counter = -1;
        this.isFalseExpression = false;
    }

    getData() {
        return this.data.slice(0, this.data.length - 1);
    }

    parse() {
        this.currentCharacter = this.nextCharacter();
        this.currentToken = this.nextToken();

        var nodeS = this.parseS();
        if (this.isFalseExpression) {
            return null;
        }
        return nodeS;
    }

    parseS() {
        var nodeE = this.parseE();
       
        if (this.currentToken.getName() != "TEof_") {
            this.error();
            return null;
        }
        return nodeE;
    }

    parseE() {
        var nodeT = this.parseT();
        var nodeG = this.parseG();

        if (nodeG != null) {
            nodeG.addLeftChild(nodeT);
            return nodeG;
        }
        return nodeT; 
    }

    parseT() {
        var nodeF = this.parseF();
        var nodeU = this.parseU();

        if (nodeU != null) {
            nodeU.addLeftChild(nodeF);
            return nodeU;
        }
        return nodeF;
    }

    parseG() {
        if (this.currentToken.getName() == "TPlus_") {
            var node = new TreeNode(this.currentToken.getData());
            this.currentToken = this.nextToken();
            var nodeT = this.parseT();
            var nodeG = this.parseG();

            if (nodeG != null) {
                nodeG.addLeftChild(nodeT)
                node.addRightChild(nodeG);
                return node;
            }
            node.addRightChild(nodeT);
            return node;
        }
        return null;
    }

    parseF() {
        var nodeX = this.parseX();
        var nodeH = this.parseH(nodeX);

        if (nodeH == null) {
            return nodeX;
        }
        return nodeH;
    }

    parseU() {
        if (this.currentToken.getName() == "TDot_") {
            var node = new TreeNode(this.currentToken.getData());
            this.currentToken = this.nextToken();
            var nodeF = this.parseF();
            var nodeU = this.parseU();

            if (nodeU != null) {
                nodeU.addLeftChild(nodeF);
                node.addRightChild(nodeU);
                return node;
            }
            node.addRightChild(nodeF);
            return node;
        } else if (this.currentToken.getName() == "TLParen_" || this.currentToken.getName() == "TIdent_" || this.currentToken.getName() == "TEmptySet_" || this.currentToken.getName() == "TEps_") {
            var node = new TreeNode(".");
            var nodeF = this.parseF();
            var nodeU = this.parseU();

            if (nodeU != null) {
                nodeU.addLeftChild(nodeF);
                node.addRightChild(nodeU);
                return node;
            }
            node.addRightChild(nodeF);
            return node;
        }
        return null;
    }

    parseX() {
        var node;
        switch (this.currentToken.getName()) {
            case "TIdent_":
                node = new TreeNode(this.currentToken.getData());
                this.currentToken = this.nextToken();
                return node;
            case "TLParen_":
                this.currentToken = this.nextToken();
                node = this.parseE();
                if (this.currentToken.getName() != "TRParen_") {
                    this.error();
                    return null;
                }

                this.currentToken = this.nextToken();
                return node;
            case "TEmptySet_":
                node = new TreeNode(this.currentToken.getData());
                this.currentToken = this.nextToken();
                return node;
            case "TEps_":
                node = new TreeNode(this.currentToken.getData());
                this.currentToken = this.nextToken();
                return node;
            default:
                this.error();
                return null;
        }
    }

    parseH(nodeX) {
        var root = null;
        if (this.currentToken.getName() == "TStar_") {
            root = new TreeNode(this.currentToken.getData());
            this.currentToken = this.nextToken();
            var starCounter = 0;

            while (this.currentToken.getName() == "TStar_") {
                starCounter++;
                this.currentToken = this.nextToken();
            }

            if (starCounter > 0) {
                var node = [];
                for (var i = 0; i < starCounter; i++) {
                    node.push(new TreeNode("*"));
                }

                node[starCounter - 1].addLeftChild(nodeX);

                for (var i = starCounter - 1; i > 0; i--) {
                    node[i - 1].addLeftChild(node[i]);
                }

                root.addLeftChild(node[0]);
            } else {
                root.addLeftChild(nodeX);
            }
            
        }
        return root;
    }

    nextCharacter() {
        try {
            this.counter++;
            return this.data.charAt(this.counter);
        } catch (err) {
            return "-";
        }
    }

    nextToken() {
        while (this.currentCharacter == " " || this.currentCharacter == "\t") {
            this.currentCharacter = this.nextCharacter();
        }

        switch (this.currentCharacter) {
            case "?":
                return new Token("?");
            case "(":
                this.currentCharacter = this.nextCharacter();
                return new Token("(");
            case ")":
                this.currentCharacter = this.nextCharacter();
                return new Token(")");
            case ".":
                this.currentCharacter = this.nextCharacter();
                return new Token(".");
            case "+":
                this.currentCharacter = this.nextCharacter();
                return new Token("+");
            case "*":
                this.currentCharacter = this.nextCharacter();
                return new Token("*");
            case "#":
                this.currentCharacter = this.nextCharacter();
                return new Token("#");
            case "ε":
                this.currentCharacter = this.nextCharacter();
                return new Token("ε");
            default:
                if (this.isValidCharacter(this.currentCharacter)) {
                    var c = this.currentCharacter;
                    this.currentCharacter = this.nextCharacter();
                    return new Token(c);
                } else {
                    this.error();
                    return new Token("?");
                }
        }
    }

    isValidCharacter(c) {
        if ((c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57) || (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122)) {
            return true;
        }
        return false;
    }

    error() {
        if (this.isFalseExpression == false) {
            this.isFalseExpression = true;
            console.log("False expression.");
        }
    }
}


function test() {
    var expression = new Expression("((a)*)b");
    var root = expression.parse();
    console.log(root.buildShortExpression());
    console.log(root.buildFullExpression());
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

function drawText(x, y, state) {
    c.font = "30px Verdana";
    if (counter > 10) {
        c.fillText(state.counter, x - 18, y + 12);
    } else {
        c.fillText(state.counter, x - 9, y + 12);
    }

    
}

function drawBeginState(x, y, state) {
    drawCircle(x, y, 30);
    drawArrow(x - 55, y, x - 35, y);
    drawCircle(x, y, 25);
    drawText(x, y, state);
}

function drawNormalState(x, y) {
    drawCircle(x, y, 30);
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
    c.stroke();
}

function drawTransition(startX, startY, endX, endY, text) {
    drawArrow(startX, startY, endX, endY);
    c.font = "15px Verdana";
    c.fillText(text, (startX + endX) / 2, (startY + endY) / 2);
}

function drawShape(x, y, text) {
    var beginX = 25 * Math.cos((3 * Math.PI) / 4) + x;
    var beginY = 25 * Math.sin((3 * Math.PI) / 4) + y;
    var endX = 25 * Math.cos(Math.PI / 4) + x;
    var endY = 25 * Math.sin(Math.PI / 4) + y;

    beginY = beginY - 50;
    endY = endY - 50;

    c.beginPath();
    c.moveTo(beginX, beginY);
    c.bezierCurveTo(beginX - 35, beginY - 70, endX + 35, endY - 70, endX, endY);
    
    c.stroke();
    c.font = "15px Verdana";
    c.fillText(text, ((beginX + endX) / 2) - 5, endY - 55);
}

function clearCanvas() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    counter = 1;
    states = [];
    transitions = [];
    activeTransition = null;
}

function drawIdent(x, y, text) {
    drawCircle(x, y, 30);
    drawTransition(x, y, x + 150, y, text);
    drawCircle(x + 150, y, 30);
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