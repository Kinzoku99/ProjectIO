import React, {useState} from "react";
import {EQ, iEQ} from "../mathOutputFunctions";
import Gallery from "./Gallery";
import {CalculatorSettings} from "../calculatorSettings";
import currentURL from "../URLconfig";


const ExactIntCalculator: React.FC = () => {
    let [input, setInput] = useState<string>("");
    let [result, setResult] = useState<string>("");
    let [inputValid, setInputValid] = useState<string>("");

    function handleClick() {
        if (input.length === 0) {
			setInputValid(' is-invalid');
		}
		else {
			const valuesRequest = {
				function_expression: input
			}

			fetch(currentURL + 'calculator/indefinite_integration/', {
				method: 'POST',
				mode: 'cors',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(valuesRequest)
			}).then((response) => {
				if (response.status === 400) {
					setInputValid(' is-invalid');
					setResult('');
					return null;
				}
				return response.json();
			}).then((data) => {
				if (data !== null) {
					setInputValid('');
					setResult("\\int_0^{x} " + data.tex_function + "\\: dx = " + data.tex_result);
				}
			})
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
            <div className="panel-filler"/>

			<div className="main-content">
				<Gallery />
				
				<div className="calculator-panel">
					{/* To jest sekcja nagłówka naszej strony czyli o czym to jest */}
					<section className="container text-center pt-5 pb-xs-5">
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
                                <div className="row">
                                    <input
                                        type="text"
                                        className={"form-control" + inputValid}
                                        name="exactexpression"
                                        id="exactexpression"
                                        onKeyUpCapture={(e) => {if(e.key === 'Enter') {handleClick();}}}
                                        onChange={(e) => {setInput(e.target.value)}}
                                    />
                                    <input
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        value="Policz"
                                        name="exactbtn"
                                        id="exactbtn"
                                        onClick={handleClick}
                                    />
                                </div>
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