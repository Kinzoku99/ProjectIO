import React, {useState} from "react";
import {EQ, iEQ} from "../mathOutputFunctions";


// TODO typowanie w funkcjach do obliczania jeszcze do poprawki
class Expression {
    constructor() {
        if (this.constructor === Expression) {
            throw new Error("Abstract class");
        }
    }

    evaluate(argument: any) {
        throw new Error("Abstract method");
    }

    integrate() {
        throw new Error("Abstract method");
    }

    print() {
        throw new Error("Abstract method");
    }
}

function gcd(a: number, b: number): number {
    return b < a ? gcd(b, a) : (a === 0 ? b : gcd(b % a, a));
}

function sign(x: number): number {
    return x < 0 ? -1 : (x > 0 ? 1 : 0);
}

class Fraction extends Expression {
    readonly sign: number;
    numerator: number;
    readonly denominator: number;

    constructor(numerator: number, denominator: number) {
        super();
        this.sign = sign(numerator) * sign(denominator);
        numerator *= sign(numerator);
        denominator *= sign(denominator);
        let common = gcd(numerator, denominator);
        this.numerator = numerator / common;
        this.denominator = denominator / common;
    }

    multiply(other: Fraction) {
        this.numerator *= this.sign;
        other.numerator *= other.sign;
        return new Fraction(this.numerator * other.numerator, this.denominator * other.denominator);
    }

    divide(other: Fraction) {
        this.numerator *= this.sign;
        other.numerator *= other.sign;
        return new Fraction(this.numerator * other.denominator, this.denominator * other.numerator);
    }

    add(other: Fraction) {
        this.numerator *= this.sign;
        other.numerator *= other.sign;
        return new Fraction(this.numerator * other.denominator + other.numerator * this.denominator, this.denominator * other.denominator);
    }

    subtract(other: Fraction) {
        this.numerator *= this.sign;
        other.numerator *= other.sign;
        return new Fraction(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator);
    }

    evaluate() {
        if (this.denominator === 0)
            throw new Error("Invalid fraction");
        else
            return this.numerator * this.sign / this.denominator;
    }

    isZero() {
        return this.numerator === 0 && this.denominator !== 0;
    }

    isOne() {
        return this.numerator === 1 && this.denominator ===  1;
    }

    print() {
        if (this.denominator === 1)
            return String(this.sign * this.numerator);
        else if (this.numerator === 0)
            return "0";
        else if (this.denominator === 0)
            return "undefined";
        else
            return "\\frac{"+ String(this.sign * this.numerator) + "}{" + String(this.denominator) + "}";
    }
}

class Polynomial extends Expression {
    private readonly monomials: Monomial[];

    constructor(monomials: Monomial[]) {
        super();
        this.monomials = monomials.sort((x, y) => y.exp - x.exp);
        console.log(this.monomials);
    }

    evaluate(argument: number) {
        // @ts-ignore
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
    private coeff: Fraction;
    exp: number;

    constructor(coeff: Fraction, exp: number) {
        super();
        this.coeff = coeff;
        this.exp = exp;
    }

    evaluate(argument: number) {
        return this.coeff.multiply(new Fraction(Math.pow(argument, this.exp),1));
    }

    integrate() {
        return new Monomial(new Fraction(this.coeff.numerator * this.coeff.sign, this.coeff.denominator * (this.exp + 1)), this.exp + 1);
    }

    print() {
        if (this.exp === 0)
            return this.coeff.print();
        else if(this.exp === 1)
            return this.coeff.isOne() ? (this.coeff.sign === 1 ? "x" : "-x") : this.coeff.print() + "x";
        else
            return this.coeff.isOne() ? "x^{" + String(this.exp) + "}" : this.coeff.print() + "x^{" + String(this.exp) + "}";
    }
}

//pair must be a double element array
function pairMonomial(pair: number[]) {
    if (pair.length === 1)
        return new Monomial(new Fraction(pair[0], 1), 1);
    else if (pair.length !== 2)
        throw Error("Invalid pair");
    else
        return new Monomial(new Fraction(pair[0], 1), pair[1]);
}

function testInput(input: string) {
    //Ten regex obsługuje na razie jedynie wielomiany z całkowitymi współczynnikami.
    let regex = new RegExp("^(\\-)?((\\d+)|(\\d*x(\\^\\d+)?))((\\+|\\+\\-)((\\d+)|(\\d*x(\\^\\d+)?)))*$");

    return regex.test(input);
}

function calculateResult(input: string) {
    let plus = new RegExp("\\+");
    let expSign = new RegExp("\\^");
    let xSign = new RegExp("x");
    let monomials = input.split(plus);
    let poly = new Polynomial(monomials.map(x => xSign.test(x) ? pairMonomial(x.split(expSign).map(x => parseInt(x, 10))) : new Monomial(new Fraction(parseInt(x, 10), 1), 0)));
    return [poly.print(), poly.integrate().print()];
}

class IntegralGraphics {
    public source : string;
    public text : string;

    public constructor(source : string, text : string) {
        this.source = source;
        this.text = text;
    }
};

const IntegralGraphicsList = Array(12).fill(new IntegralGraphics("int1.png", "\\int_{\\mathbb{R}} \\frac{\\cos x}{1+x^2}=\\frac{\\pi}{e}"));

const ExactIntCalculator: React.FC = () => {
    let [input, setInput] = useState<string>("");
    let [result, setResult] = useState<string>("");

    function handleClick() {
        let data = input.split(' ').join('').replaceAll("-","+-").replaceAll("-x","-1x")
            .replaceAll("+x","+1x").replace(new RegExp("^x"),"1x");

        if (data.charAt(0) === '+')
            data = data.substring(1);

        if (!testInput(data)) {
            alert("Bad input");
            setResult("");
        }
        else {
            let res = calculateResult(data);
            setResult("\\int_0^{x} " + res[0] + "\\: dx = " + res[1]);
        }
    }

	const convertRemToPixels = (rem : number) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

	document.addEventListener("scroll", function () {
		const calcPanel = document.querySelector<HTMLElement>(".calculator-panel");
		if (calcPanel !== null) {
			const navbarHeight = convertRemToPixels(3.5);
			const distanceFromTop = Math.abs( document.body.getBoundingClientRect().top);
			if (navbarHeight >= distanceFromTop)
				calcPanel.style.marginTop = (navbarHeight - distanceFromTop).toString(10) + "px";
			else
				calcPanel.style.marginTop = "0px";
		}
	});

    return (
        <main>
            <div className="panel-filler"></div>

			<div className="main-content">
				<div>
					<div className="album py-5"> 
						<div className="container">
							<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">	
								{IntegralGraphicsList.map((integralGraphics) => (
								<div className="col">
									<div className="card shadow-sm">
                                        <img src={integralGraphics.source}></img>

										<div className="card-body">
											<p className="card-text">{EQ(integralGraphics.text)}</p>
										</div>
									</div>
								</div>))}
							</div>
						</div>
					</div>
				</div>
				
				<div className="calculator-panel">
					{/* To jest sekcja nagłówka naszej strony czyli o czym to jest */}
					<section className="container text-center py-5">
						<div className="row py-lg-5">
							<div className="col-lg-6 col-md-8 mx-auto">
								<h1 className="fw-light h11">Kalkulator wielomianowy</h1>

								<p className="lead text-muted p11">
									Ten kalkulator liczy funkcję pierwotną wielomianu.
								</p>
							</div>
						</div>
					</section>

					<section className="container">
						<div className="row">
							<div className="col-lg-6 col-md-8 mx-auto">
								<p className="text-muted">
									Wpisz wielomian w postaci ogólnej {iEQ("a_nx^n + \\ldots + a_1x + a_0")}:
								</p>
								<form>
									<input type="text" name="exactexpression" id="exactexpression" onChange={(e) => {setInput(e.target.value)}}/>
									<input type="button" value="Policz" name="exactbtn" id="exactbtn" onClick={handleClick}/>
								</form>
								<div id="exactresult" className="my-5">
									{EQ(result)}
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
        </main>
    );
}

export default ExactIntCalculator;