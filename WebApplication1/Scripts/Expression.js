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