class Calculator {
    actions = {
        "/": (a, b) => a / b,
        "*": (a, b) => a * b,
        "-": (a, b) => a - b,
        "+": (a, b) => +a + +b,
    }

    constructor(elem) {
        this._elem = elem;
        this.field = elem.querySelector('#calculating-field');
        elem.onclick = this.onClick.bind(this);
    }

    transInArr(exp) {
        return exp.match(/(?<=[\*\/\-\+]|^)\-(\d+|\d+\.?\d+)|(\d+|\d+\.?\d+)|[\*\/\-\+\(\)]/gi);
    }

    transUnaryOps(exp) {
        while (/\-\-|\+\+/.test(exp)) {
            exp = exp.replace(/\-\-+|\+\++/gi, '+');
        }
        return exp;
    }

    calcBrackets(exp) {
        while (exp.includes('(') && exp.includes(')')) {
            let firstCloseBracket = exp.indexOf(')');
            let currentOpenBracket = exp.indexOf('(');
            let nextOpenBracket = exp.indexOf('(', currentOpenBracket + 1);
            while ((nextOpenBracket < firstCloseBracket) && nextOpenBracket != -1) {
                currentOpenBracket = nextOpenBracket;
                nextOpenBracket = exp.indexOf('(', currentOpenBracket + 1);
            }
            let result = this.calc(exp.slice(currentOpenBracket + 1, firstCloseBracket));
            exp = exp.slice(0, currentOpenBracket) + result + exp.slice(firstCloseBracket + 1, exp.length);
        }
        return exp;
    }

    calc(exp) {
        exp = this.transUnaryOps(exp);
        exp = this.calcBrackets(exp);
        exp = this.transInArr(exp);
        console.log(exp);
        for (let key of Object.keys(this.actions)) {
            while (exp.includes(key)) {
                let opIndex = exp.indexOf(key);
                let start = opIndex - 1;
                let end = opIndex + 1;
                exp.splice(start, 3, this.actions[key](exp[start], exp[end]));
            }
        }
        return +exp.join('');
    }

    reset() {
        this.field.value = '';
    }
    result() {
        this.field.value = this.calc(this.field.value);
    }
    checkLastOp(exp) {
        return /[\*\+\/\-]$/.test(exp);
    }
    onClick(event) {
        if (event.target.tagName !== 'BUTTON') return;
        let action = event.target.dataset.action;
        if (action) {
            this[action]();
        } else {
            let content = event.target.textContent;
            console.log(content);
            let exp = this.field.value;
            if (this.checkLastOp(exp) && /[\*\+\-\/]/.test(content)) {
                this.field.value = exp.slice(0, exp.length - 1) + content;
            } else {
                this.field.value += content;
            }
        }
    }
}

let calc = new Calculator(document.getElementById('calculator'));