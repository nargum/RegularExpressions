class Element {
    constructor(startX, startY, text) {
        this.startX = startX;
        this.startY = startY;
        this.endX = this.startX + circleRadius + 100;
        this.endY = this.startY;
        this.text = text;
        this.width = this.endX - this.startX;
        this.height = circleRadius;
        this.begin = true;
        this.end = true;
    }

    getString() {
        return this.text;
    }

    draw(color) {
        if (this.begin) {
            drawCircle(this.startX, this.startY, circleRadius, color);
            drawArrow(this.startX - 55, this.startY, this.startX - 35, this.startY, color);
        } else {
            drawCircle(this.startX, this.startY, circleRadius, color);
        }

        if (this.end) {
            drawCircle(this.endX, this.endY, circleRadius, color);
            drawCircle(this.endX, this.endY, circleRadius - 5, color);
        } else {
            drawCircle(this.endX, this.endY, circleRadius, color);
        }

        drawTransition(this.startX, this.startY, this.endX, this.endY, this.text, color);
    }

    setStartCoord(startX, startY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = startX + circleRadius + 100;
        this.endY = startY;
    }

}

class StarGraph {
    constructor(part, startX, startY, text) {
        this.text = text;
        this.part = part;
        this.startX = startX;
        this.startY = startY;
        this.part.begin = false;
        this.part.end = false;
        this.begin = true;
        this.end = true;
        this.width = this.part.width + 200 + 2 * circleRadius;
        this.height = this.part.height;
        this.endX = this.startX + this.width;
        this.endY = this.startY;
        this.update();
    }

    getString() {
        let stringPart = "";
        if (this.part.text == "+" || this.part.text == ".") {
            stringPart = "(" + this.part.getString() + ")";
        } else {
            stringPart = this.part.getString();
        }
        return stringPart + this.text;
    }

    draw(color) {

        if (this.begin == true) {
            drawCircle(this.startX, this.startY, circleRadius, color);
            drawArrow(this.startX - 55, this.startY, this.startX - 35, this.startY, color);
        } else {
            drawCircle(this.startX, this.startY, circleRadius, color);
        }

        drawShapeUp(this.part.startX, this.part.startY, this.part.endX, this.part.endY, this.height, "ε", color);
        drawShapeDown(this.startX, this.startY, this.endX, this.endY, this.height, "ε", color);
        drawTransition(this.startX, this.startY, this.part.startX, this.part.startY, "ε", color);
        this.part.draw(color);
        drawTransition(this.part.endX, this.part.endY, this.endX, this.endY, "ε", color);

        if (this.end == true) {
            drawCircle(this.endX, this.endY, circleRadius, color);
            drawCircle(this.endX, this.endY, circleRadius - 5, color);
        } else {
            drawCircle(this.endX, this.endY, circleRadius, color);
        }
    }

    setStartCoord(startX, startY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = this.startX + this.width;
        this.endY = this.startY;
        this.update();
    }

    update() {
        this.part.setStartCoord(this.startX + 100 + circleRadius, this.startY);

    }
}

class DotGraph {
    constructor(partA, partB, startX, startY, text) {
        this.text = text;
        this.partA = partA;
        this.partB = partB;
        this.partA.begin = false;
        this.partB.begin = false;
        this.partA.end = false;
        this.partB.end = false;
        this.begin = true;
        this.end = true;
        this.startX = startX;
        this.startY = startY;

        if (this.partA.height > this.partB.height) {
            this.height = this.partA.height;
        } else {
            this.height = this.partB.height;
        }

        this.width = this.partA.width + this.partB.width + 100 + circleRadius;
        this.endX = this.startX + this.width;
        this.endY = this.startY;
        this.update();
    }

    getString() {
        let stringA = "";
        let stringB = "";

        if (this.partA.text == "+") {
            stringA = "(" + this.partA.getString() + ")";
        } else {
            stringA = this.partA.getString();
        }

        if (this.partB.text == "+") {
            stringB = "(" + this.partB.getString() + ")";
        } else {
            stringB = this.partB.getString();
        }

        
        return stringA + " . " +  stringB;
    }

    draw(color) {
        if (this.start == true) {
            this.partA.start = true;
            this.partA.end = false;
        } else {
            this.partA.start = false;
            this.partA.end = false;
        }
        this.partA.draw(color);
        drawTransition(this.partA.endX, this.partA.endY, this.partB.startX, this.partB.startY, "ε", color);

        if (this.end == true) {
            this.partB.start = false;
            this.partB.end = true;
        } else {
            this.partB.start = false;
            this.partB.end = false;
        }
        this.partB.draw(color);
    }

    setStartCoord(startX, startY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = this.startX + this.width;
        this.endY = this.startY;
        this.update();
    }

    update() {
        this.partA.setStartCoord(this.startX, this.startY);
        this.partB.setStartCoord(this.partA.endX + 100 + circleRadius, this.partA.endY);
    }
}

class PlusGraph {
    constructor(partA, partB, startX, startY, text) {
        this.text = text;
        this.partA = partA;
        this.partB = partB;
        this.partA.begin = false;
        this.partB.begin = false;
        this.partA.end = false;
        this.partB.end = false;
        this.begin = true;
        this.end = true;
        this.startX = startX;
        this.startY = startY;

        this.height = this.partA.height + this.partB.height + 200;
        if (this.partA.width >= this.partB.width) {
            this.width = 200 + this.partA.width;
        } else {
            this.width = 200 + this.partB.width;
        }
        this.endX = this.startX + this.width;
        this.endY = this.startY;

        this.update();

    }

    getString() {
        return this.partA.getString() + " + " + this.partB.getString();
    }

    drawStart(color) {
        if (this.begin) {
            drawCircle(this.startX, this.startY, circleRadius, color);
            drawArrow(this.startX - 55, this.startY, this.startX - 35, this.startY, color);
        } else {
            drawCircle(this.startX, this.startY, circleRadius, color);
        }

        drawTransition(this.startX, this.startY, this.partA.startX, this.partA.startY, "ε", color);
        drawTransition(this.startX, this.startY, this.partB.startX, this.partB.startY, "ε", color);
    }

    drawEnd(color) {
        drawTransition(this.partA.endX, this.partA.endY, this.endX, this.endY, "ε", color);
        drawTransition(this.partB.endX, this.partB.endY, this.endX, this.endY, "ε", color);

        if (this.end) {
            drawCircle(this.endX, this.endY, circleRadius, color);
            drawCircle(this.endX, this.endY, circleRadius - 5, color);
        } else {
            drawCircle(this.endX, this.endY, circleRadius, color);
        }
    }

    draw(color) {
        this.drawStart(color);
        this.partA.draw(color);
        this.partB.draw(color);
        this.drawEnd(color);

    }

    setStartCoord(startX, startY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = this.startX + this.width;
        this.endY = this.startY;
        this.update();
    }

    update() {
        if (this.partA.height / 2 < 100) {
            this.partA.setStartCoord(this.startX + 100, this.startY - 100);
        } else {
            this.partA.setStartCoord(this.startX + 100, this.startY - (this.partA.height / 2));
        }

        if (this.partB.height / 2 < 100) {
            this.partB.setStartCoord(this.startX + 100, this.startY + 100);
        } else {
            this.partB.setStartCoord(this.startX + 100, this.startY + (this.partB.height / 2));
        }
    }
}