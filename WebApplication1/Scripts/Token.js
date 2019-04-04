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