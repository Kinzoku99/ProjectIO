// @ts-check

class Expression {
	constructor() {
		if (this.constructor === Expression) {
			throw new Error("Abstract class");
		}
	}

	// @ts-ignore
	evaluate(argument) {
		throw new Error("Abstract method");
	}

	integrate() {
		throw new Error("Abstract method");
	}

	print() {
		throw new Error("Abstract method");
	}
}

function gcd(a, b) {
	return b < a ? gcd(b,a) : (a === 0 ? b : gcd(b % a, a));
}

class Fraction extends Expression {
	constructor(numerator, denominator) {
		super();
		let common = gcd(numerator, denominator)
		this.numerator = numerator / common;
		this.denominator = denominator / common;
	}

	multiply(other) {
		return new Fraction(this.numerator * other.numerator, this.denominator * other.denominator);
	}

	divide(other) {
		return new Fraction(this.numerator * other.denominator, this.denominator * other.numerator);
	}

	add(other) {
		return new Fraction(this.numerator * other.denominator + other.numerator * this.denominator, this.denominator * other.denominator);
	}

	subtract(other) {
		return new Fraction(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator);
	}

	evaluate() {
		if (this.denominator == 0)
			throw new Error("Invalid fraction");
		else
			return this.numerator / this.denominator;
	}

	isZero() {
		return this.numerator === 0 && this.denominator !== 0;
	}

	isOne() {
		return this.numerator === 1 && this.denominator ===  1;
	}

	print() {
		if (this.denominator == 1)
			return String(this.numerator);
		else if (this.numerator == 0)
			return "0";
		else if (this.denominator == 0)
			return "undefined";
		else
			return "\\frac\{"+ String(this.numerator) + "\}\{" + String(this.denominator) + "\}";
	}
}

//Equivalent to Monomial(value,0)
class Integer extends Expression {
	constructor(value) {
		super();
		this.value = value;
	}

	evaluate(argument) {
		return this.value;
	}

	integrate() {
		if (this.value === 0)
			return new Integer(0);
		return new Monomial(new Fraction(this.value, 1), 1);
	}

	print() {
		return String(this.value);
	}
}

class Polynomial extends Expression {
	constructor(monomials) {
		super();
		this.monomials = monomials;
	}

	evaluate(argument) {
		return this.monomials.reduce((prev, curr) => prev + curr.evaluate(argument),0);
	}

	integrate() {
		return new Polynomial(this.monomials.map(x => x.integrate()));
	}

	print() {
		return this.monomials[0] ? this.monomials.slice(1).reduce((prev, curr) => prev + "+" + curr.print(),this.monomials[0].print()) : "";
	}
}

//Coeff to fraction
//Exp to liczba całkowita nieujemna
class Monomial extends Expression {
	constructor(coeff, exp) {
		super();
		this.coeff = coeff;
		this.exp = exp;
	}

	evaluate(argument) {
		return this.coeff.multiply(new Fraction(Math.pow(argument,this.exp),1));
	}

	integrate() {
		if (this.coeff.isZero())
			return new Number(0);
		
		return new Monomial(new Fraction(this.coeff.numerator, this.coeff.denominator * (this.exp + 1)), this.exp + 1);
	}

	print() {
		if (this.exp === 0)
			return this.coeff.print();
		else if(this.exp === 1)
			return this.coeff.isOne() ? "x" : this.coeff.print() + "x";
		else
			return this.coeff.isOne() ? "x^\{" + String(this.exp) + "\}" : this.coeff.print() + "x^\{" + String(this.exp) + "\}";
	}
}

//pair must be a double element array
function pairMonomial(pair) {
	if (pair.length === 1)
		return new Monomial(new Fraction(Number.isNaN(pair[0]) ? 1 : pair[0], 1), 1);
	else if (pair.length !== 2)
		throw Error("Invalid pair");
	else
		return new Monomial(new Fraction(Number.isNaN(pair[0]) ? 1 : pair[0] === NaN ? 1 : pair[0], 1), pair[1]);
}

function testInput(input) {
	//Ten regex obsługuje na razie jedynie wielomiany z całkowitymi współczynnikami.
	//let regex = new RegExp("^(\\-)?((\\d+)|(\\d*x(\\^\\d+)?))((\\+|\\-)((\\d+)|(\\d*x(\\^\\d+)?)))*$");
	//Funkcja dalej dziala tylko dla + wiec - tez na razie nie dopuszczam.

	let regex = new RegExp("^((\\d+)|(\\d*x(\\^\\d+)?))(\\+((\\d+)|(\\d*x(\\^\\d+)?)))*$");
	
	return regex.test(input);
}

function result(input) {
	let plus = new RegExp("\\+");
	let expSign = new RegExp("\\^");
	let xSign = new RegExp("x");
	let monomials = input.split(plus);
	let poly = new Polynomial(monomials.map(x => xSign.test(x) ? pairMonomial(x.split(expSign).map(x => parseInt(x, 10))) : new Integer(parseInt(x, 10))));
	return [poly.print(), poly.integrate().print()];
}

window.onload = () => {
	// @ts-ignore
    document.getElementById("contact").onclick = () => {
        let myAlert = document.getElementById('liveToast');
        // @ts-ignore
        let bsAlert = new bootstrap.Toast(myAlert);
        bsAlert.show();
    };
    document.getElementById("sources").onclick = () => {
        let myAlert = document.getElementById('liveToast2');
        // @ts-ignore
        let bsAlert = new bootstrap.Toast(myAlert);
        bsAlert.show();
    };

    document.getElementById("exactbtn").onclick = () => {
        // @ts-ignore
        let input = document.getElementById("exactexpression").value.split(' ').join('');
		if (testInput(input) === false) {
			alert("Bad input");
			// @ts-ignore
			document.getElementById("exactexpression").value = "";
		}
		else {
			let el = document.getElementById("exactresult");
			let res = result(input);
			el.innerHTML = "$$\\int_0^{x} " + res[0] + "\\: dx = "  + res[1] + "$$";
			// @ts-ignore
			MathJax.typeset();
		}
    };
}
