class TreeNode {
    constructor(data) {
        this.data = data;
        this.generatePriority();
        this.parent;
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

    drawGraph() {
        var graph = this.buildGraph();
        graph.draw();
    }

    buildGraph() {
        if (this.leftChild == null && this.rightChild == null) {
            let e = new Element(100, 100, this.data);
            graphs.push(e);
            return e;
        } else {
            var partA;
            var partB;
            if (this.leftChild != null) {
                partA = this.leftChild.buildGraph();
            }

            if (this.rightChild != null) {
                partB = this.rightChild.buildGraph();
            }

            if (this.data == "+") {
                let e = new PlusGraph(partA, partB, 100, 250, this.data);
                graphs.push(e);
                return e;
            }

            if (this.data == ".") {
                let e = new DotGraph(partA, partB, 100, 250, this.data);
                graphs.push(e);
                return e;
            }

            if (this.data == "*") {
                let e = new StarGraph(partA, 100, 250, this.data);
                graphs.push(e);
                return e;
            }
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

    getFirst() {
        let first = []
        if (this.leftChild == null && this.rightChild == null) {
            first.push(this.data);
            return first;
        }

        if (this.leftChild.data != "*" && this.leftChild.data != "." && this.leftChild.data != "+") {
            
            if (this.data == "+") {
                first.push(this.leftChild.data);
                first = first.concat(this.rightChild.getFirst());
                return first;
            }

            if (this.data == ".") {
                first.push(this.leftChild.data);
                return first;
            }

            if (this.data == "*") {
                first.push("ε");
                first = first.concat(this.leftChild.getFirst());
                return first;
            }
        } else {
            first = first.concat(this.leftChild.getFirst());
            if (this.data == "+") {
                first = first.concat(this.rightChild.getFirst());
            }

            if (this.data == "*") {
                first.push("ε");
            }
            return first;
        }
    }

    getLast() {
        let last = []
        if (this.leftChild == null && this.rightChild == null) {
            last.push(this.data);
            return last;
        }

        if (this.rightChild.data != "*" && this.rightChild.data != "." && this.rightChild.data != "+") {
            if (this.data == "+") {
                last.push(this.rightChild.data);
                last = last.concat(this.leftChild.getLast());
                return last;
            }

            if (this.data == ".") {
                last.push(this.rightChild.data);
                return last;
            }

            if (this.data == "*") {
                last.push("ε");
                last = last.concat(this.leftChild.getLast());
                return last;
            }
        } else {
            
            if (this.data == "+") {
                last = last.concat(this.rightChild.getLast());
                last = last.concat(this.leftChild.getLast());
            }

            if (this.data == "*") {
                last = last.concat(this.leftChild.getLast());
                last.push("ε");
            }

            if (this.data == ".") {
                last = last.concat(this.rightChild.getLast());
            }

            return last;
        }
    }

    getFirst2(first) {
        if (this.data != "*" && this.data != "." && this.data != "+") {
            first.push(this.data);
            return first;
        }

        if (this.data == ".") {
            first = [];
            //first = this.leftChild.getFirst2(first);
            first = first.concat(this.leftChild.getFirst2(first));
        }

        if (this.data == "+") {
            first = first.concat(this.rightChild.getFirst2(first));
            first = first.concat(this.leftChild.getFirst2(first));
        }

        if (this.data == "*") {
            first.push("ε");
            first = first.concat(this.leftChild.getFirst2(first));
        }

        return first;
    }
}